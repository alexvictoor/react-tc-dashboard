import { expect } from 'chai';
import buildsToDisplay, { BuildsToDisplayState } from "./buildsToDisplay"
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


describe('Builds to display reducer', () => {
  
  it('should return empty on init', () => {
    const initial = buildsToDisplay(undefined, undefined);
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
    const newState = buildsToDisplay(undefined, action);
    // then
    expect(newState.failedBuilds).to.deep.equal([ action.payload.buildName ]);
  });
  
  it('should display build after failure', () => 
  {
    // given
    const action = createBuildNotification(false);
    // when
    const newState = buildsToDisplay(undefined, action);
    // then
    expect(newState.buildToShowId).to.be.equal(action.payload.buildName);
  });
  
  it('should keep displaying build after failure', () => 
  {
    // given
    const action = createBuildNotification(false);
    const oldState = buildsToDisplay(undefined, action);
    // when
    const newState = buildsToDisplay(oldState, action);
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
  
  const buildState = (actions: Array<Action<any>>, initialState: BuildsToDisplayState = buildsToDisplay()) => (
    actions.reduce((state, action) => buildsToDisplay(state, action), initialState)    
  );
  
});