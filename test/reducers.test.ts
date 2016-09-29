import { expect } from "chai";
import { Store } from "redux"
import * as reducers from "../src/reducers";
import * as actions from "../src/actions";

import "core-js";

import * as moment from 'moment';



describe('Selector get build highlight', () => {

  let store: Store<reducers.AppState>
  
  beforeEach('init the store', () => {
    store = reducers.createStore({});
  });
  
  it('should return failed build after one failure notification', () => {
    // given
    store.dispatch(actions.createNotification({
      buildId: "123",
      buildDate: new Date(),
      buildName: "dummy",
      buildNumber: 12,
      success: false,
      statusText: "sh$ù*m"
    }));
    const state = store.getState();
    // when
    const highlight = reducers.getBuildHighlight(state);
    // then
    const expected: reducers.BuildDetails = {
      id: "123",
      name: "dummy",
      healthy: false,
      messageOfFirstBrokenBuild: "sh$ù*m"
    }

    expect(highlight.id).to.equal(expected.id);
    expect(highlight.name).to.equal(expected.name);
    expect(highlight.healthy).to.equal(expected.healthy);
    expect(highlight.messageOfFirstBrokenBuild).to.equal(expected.messageOfFirstBrokenBuild);
       
  });
  
  it('should return failed build with broken time after one tick', () => {
    // given
    store.dispatch(actions.createNotification({
      buildId: "123",
      buildDate: new Date(2016, 1, 1, 1, 0),
      buildName: "dummy",
      buildNumber: 12,
      success: false,
      statusText: "baad"
    }));
    store.dispatch(actions.createClockTick(
      new Date(2016, 1, 1, 1, 23)
    ));
    // when
    const state = store.getState();
    const highlight = reducers.getBuildHighlight(state);
    // then
    expect(highlight.brokenTimeInMin).to.equal(23 - 0);   
  });
  
  it('should return failed build with number of attempt to fix', () => {
    // given
    store.dispatch(actions.createNotification({
      buildId: "123",
      buildDate: new Date(2016, 1, 1, 0, 0),
      buildName: "dummy",
      buildNumber: 11,
      success: true,
      statusText: ""
    }));
    store.dispatch(actions.createNotification({
      buildId: "123",
      buildDate: new Date(2016, 1, 1, 1, 0),
      buildName: "dummy",
      buildNumber: 12,
      success: false,
      statusText: ""
    }));
    store.dispatch(actions.createNotification({
      buildId: "123",
      buildDate: new Date(2016, 1, 1, 1, 1),
      buildName: "dummy",
      buildNumber: 13,
      success: false,
      statusText: ""
    }));
    // when
    const state = store.getState();
    const highlight = reducers.getBuildHighlight(state);
    // then
    expect(highlight.numberAttemptsToFix).to.equal(13 - 11 - 1);   
  });


  it('should return an empty detail with name ALL when all builds are green', () => {
    // given
    store.dispatch(actions.createNotification({
      buildId: "123",
      buildDate: new Date(2016, 1, 1, 0, 0),
      buildName: "dummy",
      buildNumber: 11,
      success: true,
      statusText: ""
    }));
    store.dispatch(actions.createNotification({
      buildId: "456",
      buildDate: new Date(2016, 1, 1, 1, 0),
      buildName: "dummy",
      buildNumber: 12,
      success: true,
      statusText: ""
    }));
    // when
    const state = store.getState();
    const highlight = reducers.getBuildHighlight(state);
    // then
    expect(highlight.name).to.equal("ALL");
  });
  
  
});