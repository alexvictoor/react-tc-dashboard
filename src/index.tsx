import * as React from "react";
import { Store } from 'redux'
import * as ReactDOM from "react-dom";
import { Provider } from 'react-redux';
import * as $ from 'jquery';

import App from "./containers/App";
import { createStore, AppState } from "./reducers";
import { createClockTick, createNotification } from "./actions";
import { getLastBuildNumber } from "./build-status-reducers";

interface Configuration {
    teamcityUrl: string,
    user?: string,
    password?: string,
    pollingInterval: number,
    tickInterval: number,
    builds: string[]
}

declare const conf : Configuration;


const store = createStore({});

const isNewBuild = (data: any) : boolean => {
  const buildNumber = parseInt(data.number);
  return (getLastBuildNumber(data.buildTypeId, store.getState().byId) < buildNumber);
};

setInterval(() => {
  store.dispatch(createClockTick(conf.tickInterval));
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
        const buildNumber = parseInt(data.number);
        if (isNewBuild(data)) {
          console.log("result", data);
          store.dispatch(
            createNotification({ 
              buildDate: new Date(),  //TODO use moment.js
              buildId: data.buildTypeId,
              buildName: data.buildType.projectName,
              buildNumber,
              success: data.status == "SUCCESS"
            })
          );
        } 
      },
      error: (xhr, status, err) => console.error(err.toString())
    });
  });
  console.log("Application started with redux");
};

setInterval( fetchBuids, conf.pollingInterval * 1000);
fetchBuids();

ReactDOM.render((
     <Provider store={ store }>
        <App foo="couocu" />
     </Provider>
     ),
     document.getElementById("main")
);