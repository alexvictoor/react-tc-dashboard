import { expect } from 'chai';
import * as reducers from "./build-status-reducers"
import { Action, BuildNotification, types, createClockTick  } from "./actions"

import "core-js"

let buildNumber = 0;

const createBuildNotification = (success = true) => (
  {
    type: types.BUILD_NOTIFICATION,
    payload: {
      buildDate: new Date(),
      buildNumber: buildNumber++,
      buildId: "dummy",
      buildName: "dummy",
      success: success,
      statusText: "" 
    }
  }
);

const createSuccessBuildNotification = (id = "123") => (
  {
    type: types.BUILD_NOTIFICATION,
    payload: {
      buildDate: new Date(),
      buildNumber: buildNumber++,
      buildId: id,
      buildName: "dummy " + id,
      success: true,
      statusText: "It works!"
    }
  }
);

const createFailedBuildNotification = (id = "123") => (
  {
    type: types.BUILD_NOTIFICATION,
    payload: {
      buildDate: new Date(),
      buildNumber: buildNumber++,
      buildId: id,
      buildName: "dummy " + id,
      success: false,
      statusText: "KO"
    }
  }
);


describe('Builds by id reducer', () => {
  
  it('should return empty on init', () => {
    const initial = reducers.byId(undefined, undefined);
    expect(initial).to.deep.equal({});    
  });
  
  it('should add an entry on new build', () => 
  {
    // given
    const action = createBuildNotification();
    // when
    const newState = reducers.byId({}, action);
    // then
    expect(newState["dummy"]).to.be.not.null;
  });
  
  
  it('should update last known success build', () => 
  {
    // given
    const action = createBuildNotification();
    // when
    const newState = reducers.byId({}, action);
    // then
    expect(newState["dummy"].lastKnownSuccess).to.be.not.null;
    expect(newState["dummy"].lastKnownSuccess.buildNumber).to.equal(action.payload.buildNumber);
    expect(newState["dummy"].lastKnownSuccess.text).to.equal(action.payload.statusText);
    
  });
  
  it('should update last known failed build', () => 
  {
    // given
    const previousState = {};
    const action = createBuildNotification(false);
    // when
    const newState = reducers.byId({}, action);
    // then
    expect(newState["dummy"].lastKnownFailure).to.be.not.null;
    expect(newState["dummy"].lastKnownFailure.buildNumber).to.equal(action.payload.buildNumber); 
  });
  
  it('should not update last known success build on failure notification', () => 
  {
    // given
    const previousAction = createBuildNotification();
    const previousState = reducers.byId({}, previousAction);
    
    // when
    const action = createBuildNotification(false);
    const newState = reducers.byId(previousState, action);
    
    // then
    expect(newState["dummy"].lastKnownSuccess.buildNumber).to.equal(previousAction.payload.buildNumber);
  });
  
  it('should not update last known failed build on success notification', () => 
  {
    // given
    const previousAction = createBuildNotification(false);
    const previousState = reducers.byId({}, previousAction);
    
    // when
    const newState = reducers.byId(previousState, createBuildNotification());
    
    // then
    expect(newState["dummy"].lastKnownFailure.buildNumber).to.equal(previousAction.payload.buildNumber);
  });
  
  it('should keep last known failed build when there is a success notification', () => 
  {
    // given
    const firstFailureAction = createBuildNotification(false);
    const firstState = reducers.byId({}, firstFailureAction);
    const secondFailureAction = createBuildNotification(false);
    const secondState = reducers.byId(firstState, secondFailureAction);
    
    // when
    const thirdState = reducers.byId(secondState, createBuildNotification(true));
    
    // then
    expect(thirdState["dummy"].lastKnownFailure.buildNumber).to.equal(secondFailureAction.payload.buildNumber);
  });
  
});

describe('Build status selectors', () => {
  it('should get a successful build', () => {
    // given
    const state = reducers.byId({}, createBuildNotification());
    // when
    const builds = reducers.getSuccessfulBuilds(state);
    // then
    expect(builds).to.deep.equal([{ id: "dummy", name: "dummy", minutesSinceBuild: 0 }]);
   
  });
  
  it('should remove build from successful builds after a failure', () => {
    // given
    const state = reducers.byId({}, createBuildNotification());
    // when
    const newState = reducers.byId(state, createBuildNotification(false));
    const builds = reducers.getSuccessfulBuilds(newState);
    // then
    expect(builds).to.deep.equal([]);
  });
  
  it('should get a failed build', () => {
    // given
    const state = reducers.byId({}, createBuildNotification(false));
    // when
    const builds = reducers.getFailedBuilds(state);
    // then
    expect(builds).to.deep.equal([{ id: "dummy", name: "dummy", minutesSinceBuild: 0 }]);
  });
  
  it('should remove build from failed builds after a success', () => {
    // given
    const state = reducers.byId({}, createBuildNotification(false));
    // when
    const newState = reducers.byId(state, createBuildNotification());
    const builds = reducers.getFailedBuilds(newState);
    // then
    expect(builds).to.deep.equal([]);
  });
  
  it('should get a build with the number of minuted since it was finished', () => {
    // given
    const notification = createBuildNotification();
    notification.payload.buildDate = new Date(2010, 1, 1, 1, 0, 0);
    const state = reducers.byId({}, notification);
    // when
    const now = new Date(2010, 1, 1, 1, 0 + 42, 0);
    const builds = reducers.getSuccessfulBuilds(state, now);
    // then
    expect(builds[0].minutesSinceBuild).to.be.equal(42);
  });
  
  it('should sort builds from latest to oldest', () => {
    // given
    const buildA_notification = createSuccessBuildNotification("A")
    buildA_notification.payload.buildDate = new Date(2010, 1, 1, 1, 0, 0);
    const buildB_notification = createSuccessBuildNotification("B")
    buildB_notification.payload.buildDate = new Date(2010, 1, 42, 1, 0, 0);
    const buildC_notification = createSuccessBuildNotification("C")
    buildC_notification.payload.buildDate = new Date(2010, 1, 36, 1, 0, 0);
    
    const state = buildState([
      buildA_notification,
      buildB_notification,
      buildC_notification
    ]);
    // when
    const now = new Date();
    const builds = reducers.getSuccessfulBuilds(state, now);
    // then
    expect(builds.map(build => build.id)).to.be.deep.equal(["B", "C", "A"]);
  });
   
  it('should get last build number', () => {
    // given
    const expectedNumber = buildNumber;
    const state = reducers.byId({}, createBuildNotification());
    // when
    const result = reducers.getLastBuildNumber("dummy", state)
    // then
    expect(result).to.be.equal(expectedNumber);
  });
  
  it('should get 0 as a build number for unknown build', () => {
    // given
    const state = reducers.byId({}, createBuildNotification());
    // when
    const result = reducers.getLastBuildNumber("bullshit", state)
    // then
    expect(result).to.be.equal(0);
  });

  const buildState = (actions: Array<Action<any>>, initialState: reducers.BuildsByIdState = {}) => (
    actions.reduce((state, action) => reducers.byId(state, action), initialState)    
  );
  
});

describe('Builds to display reducer', () => {
  
  it('should return empty on init', () => {
    const initial = reducers.buildsToDisplay(undefined, undefined);
    expect(initial).to.deep.equal(
      { 
        buildToShowId: null, 
        buildToShowStatus: null,
        ticksSinceBuildWasChoosen:0,
        failedBuilds: [] 
      }
    );    
  });
  
  it('should add an entry on new build failure', () => 
  {
    // given
    const action = createBuildNotification(false);
    // when
    const newState = reducers.buildsToDisplay(undefined, action);
    // then
    expect(newState.failedBuilds).to.deep.equal([ action.payload.buildName ]);
  });
  
  it('should display build after failure', () => 
  {
    // given
    const action = createBuildNotification(false);
    // when
    const newState = reducers.buildsToDisplay(undefined, action);
    // then
    expect(newState.buildToShowId).to.be.equal(action.payload.buildName);
    expect(newState.buildToShowStatus).to.be.equal(reducers.BuildEvent.Failed); 
  });
  
  it('should keep displaying build after failure', () => 
  {
    // given
    const action = createBuildNotification(false);
    const oldState = reducers.buildsToDisplay(undefined, action);
    // when
    const newState = reducers.buildsToDisplay(oldState, action);
    // then
    expect(newState.buildToShowId).to.be.equal(action.payload.buildName);
  });
  
  it('should promote repaired build', () => 
  {
    // when
    const state = buildState([
      createFailedBuildNotification("001"),
      createSuccessBuildNotification("001")
    ]);
    // then
    expect(state.buildToShowId).to.be.equal("001");
    expect(state.buildToShowStatus).to.be.equal(reducers.BuildEvent.Repaired);
  });
  
  it('should keep promoting a failing build after a success on another build', () => 
  {
    // when
    const state = buildState([
      createFailedBuildNotification("001"),
      createSuccessBuildNotification("002")
    ]);
    // then
    expect(state.buildToShowId).to.be.equal("001");
  });
  
  it('should change build to display after two clock ticks', () => 
  {
    // when
    const state = buildState([
      createFailedBuildNotification("001"),
      createFailedBuildNotification("002"),
      createClockTick(new Date()),
      createClockTick(new Date())
    ]);
    
    // then
    expect(state.buildToShowId).to.be.equal("001");
    
  });
  
  it('should keep same state on tick when no failed builds and repaired build promoted', () => 
  {
    // given
    const repairedState = buildState([
      createFailedBuildNotification(),
      createSuccessBuildNotification(),
    ]);
    // when
    const stateAfterTwoTicks = buildState([
      createClockTick(new Date()),
      createClockTick(new Date()),
    ], repairedState);
    // then
    expect(stateAfterTwoTicks.buildToShowId).to.be.equal(repairedState.buildToShowId);
    
  });
  
  it('should promote another failed builds when a promoted repaired build success again', () => 
  {
    // given
    const firstState = buildState([
      createFailedBuildNotification("001")
    ]);
    // when
    const finalState = buildState([
      createFailedBuildNotification("002"),
      createSuccessBuildNotification("002"),
      createSuccessBuildNotification("002")
    ], firstState);
    // then
    expect(finalState.buildToShowId).to.be.equal(firstState.buildToShowId);
    
  });
  
  const buildState = (actions: Array<Action<any>>, initialState : reducers.BuildsToDisplayState =  reducers.buildsToDisplay()) => (
    actions.reduce((state, action) => reducers.buildsToDisplay(state, action), initialState)    
  );
  
});