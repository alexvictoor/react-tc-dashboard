import { expect } from 'chai';
import * as reducers from "../src/build-status-reducers"
import { Action, BuildNotification, types, createClockTick  } from "../src/actions"

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
      success: success
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
      success: true
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
      success: false
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
    expect(newState["dummy"].lastKnownSuccess.buildNumber).to.be.equal(action.payload.buildNumber);
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
    expect(newState["dummy"].lastKnownFailure.buildNumber).to.be.equal(action.payload.buildNumber); 
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
    expect(newState["dummy"].lastKnownSuccess.buildNumber).to.deep.equal(previousAction.payload.buildNumber);
  });
  
  it('should not update last known failed build on success notification', () => 
  {
    // given
    const previousAction = createBuildNotification(false);
    const previousState = reducers.byId({}, previousAction);
    
    // when
    const newState = reducers.byId(previousState, createBuildNotification());
    
    // then
    expect(newState["dummy"].lastKnownFailure.buildNumber).to.deep.equal(previousAction.payload.buildNumber);
  });
  
});

describe('Build status selectors', () => {
  it('should get a successful build', () => {
    // given
    const state = reducers.byId({}, createBuildNotification());
    // when
    const builds = reducers.getSuccessfulBuilds(state);
    // then
    expect(builds).to.deep.equal([{ id: "dummy", name: "dummy" }]);
   
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
    expect(builds).to.deep.equal([{ id: "dummy", name: "dummy" }]);
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

  it('should return build names without duplicates', () => {
    // given
    const firstBuildAction = createBuildNotification(false);
    console.log("Object.assign", Object.assign);
    const secondBuildAction = createBuildNotification(false);
    secondBuildAction.payload.buildId ="second build";
    const state = reducers.byId({}, firstBuildAction);
    const state2 = reducers.byId(state, secondBuildAction);
    // when
    const builds = reducers.getFailedBuilds(state2)
    // then
    console.log("state2", state2)
    expect(builds).to.have.length(1);
  });
  

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
      createClockTick(123),
      createClockTick(456)
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
      createClockTick(123),
      createClockTick(456),
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
  
  const buildState = (actions: Array<Action<any>>, initialState : reducers.BuildsToDisplayState = undefined) => (
    actions.reduce((state, action) => reducers.buildsToDisplay(state, action), initialState)    
  );
  
  
  
  
});