import * as React from "react";
import { Store } from 'redux'
import * as ReactDOM from "react-dom";
import { Provider } from 'react-redux';
import * as $ from 'jquery';

import App from "./containers/App";
import { createStore, AppState } from "./reducers";
import { createClockTick, createNotification, parseBuildNotification, isNewBuild } from "./actions";

interface Configuration {
    teamcityUrl: string,
    user?: string,
    password?: string,
    pollingInterval: number,
    tickInterval: number,
    builds: string[]
}

declare const conf: Configuration;


const store = createStore({});

setInterval(() => {
  store.dispatch(createClockTick(new Date()));
}, conf.tickInterval * 1000);

const fetchBuids = () => {
  
  conf.builds.forEach(id => {
    $.ajax({
      url: conf.teamcityUrl + "/httpAuth/app/rest/builds/buildType:" + id,
      xhrFields: {
        withCredentials: true
      },
      dataType: 'json',
      cache: false,
      success: data => {
        const buildNotification 
            = parseBuildNotification(data);
        if (isNewBuild(buildNotification, store.getState())) {
          store.dispatch(
            createNotification(buildNotification)
          );
        } 
      },
      error: (xhr, status, err) => console.error(err.toString())
    });
  });
};

setInterval( fetchBuids, conf.pollingInterval * 1000);
fetchBuids();

ReactDOM.render((
     <Provider store={ store }>
        <App  />
     </Provider>
     ),
     document.getElementById("main") as HTMLElement
);