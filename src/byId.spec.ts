import { expect } from 'chai';
import byId, { BuildsByIdState, getSuccessfulBuilds, getFailedBuilds } from "./byId"
import { Action, BuildNotification, types, createClockTick  } from "./actions"

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


describe('Builds by id reducer', () => {
  
  it('should return empty on init', () => {
    const initial = byId(undefined, undefined);
    expect(initial).to.deep.equal({});    
  });
  
  it('should add an entry on new build', () => 
  {
    // given
    const action = createBuildNotification();
    // when
    const newState = byId({}, action);
    // then
    expect(newState["dummy"]).to.be.not.null;
  });
  
  
  it('should update last known success build', () => 
  {
    // given
    const action = createBuildNotification();
    // when
    const newState = byId({}, action);
    // then
    expect(newState["dummy"].lastKnownSuccess).to.be.not.null;
    expect(newState["dummy"].lastKnownSuccess.buildDate).to.equal(action.payload.buildDate);
    expect(newState["dummy"].lastKnownSuccess.text).to.equal(action.payload.statusText);
    
  });
  
  it('should update last known failed build', () => 
  {
    // given
    const previousState = {};
    const action = createBuildNotification(false);
    // when
    const newState = byId({}, action);
    // then
    expect(newState["dummy"].lastKnownFailure).to.be.not.null;
    expect(newState["dummy"].lastKnownFailure.buildDate).to.equal(action.payload.buildDate); 
  });
  
  it('should not update last known success build on failure notification', () => 
  {
    // given
    const previousAction = createBuildNotification();
    const previousState = byId({}, previousAction);
    
    // when
    const action = createBuildNotification(false);
    const newState = byId(previousState, action);
    
    // then
    expect(newState["dummy"].lastKnownSuccess.buildDate).to.equal(previousAction.payload.buildDate);
  });
  
  it('should not update last known failed build on success notification', () => 
  {
    // given
    const previousAction = createBuildNotification(false);
    const previousState = byId({}, previousAction);
    
    // when
    const newState = byId(previousState, createBuildNotification());
    
    // then
    expect(newState["dummy"].lastKnownFailure.buildDate).to.equal(previousAction.payload.buildDate);
  });
  
  it('should keep last known failed build when there is a success notification', () => 
  {
    // given
    const firstFailureAction = createBuildNotification(false);
    const firstState = byId({}, firstFailureAction);
    const secondFailureAction = createBuildNotification(false);
    const secondState = byId(firstState, secondFailureAction);
    
    // when
    const thirdState = byId(secondState, createBuildNotification(true));
    
    // then
    expect(thirdState["dummy"].lastKnownFailure.buildDate).to.equal(secondFailureAction.payload.buildDate);
  });

  it('should set to 0 builds since last status change on build fix and get date of fixed build', () => 
  {
    // given
    const failureAction = createBuildNotification(false);
    const firstState = byId({}, failureAction);
    const fixAction = createBuildNotification(true);
    
    // when
    const fixedState = byId(firstState, fixAction);
    
    // then
    expect(fixedState["dummy"].buildsSinceLastStatusChange).to.equal(0);
    expect(fixedState["dummy"].buildDateOfLastStatusChange).to.equal(fixAction.payload.buildDate);
  });

  it('should update builds since last status change on new successful build', () => 
  {
    // given
    const failureAction = createBuildNotification(false);
    const firstState = byId({}, failureAction);
    const fixAction = createBuildNotification(true);
    const fixedState = byId(firstState, fixAction);
    
    // when
    const successAction = createBuildNotification(true);
    const successState = byId(fixedState, successAction);
    
    // then
    expect(successState["dummy"].buildsSinceLastStatusChange).to.equal(1);
    expect(successState["dummy"].buildDateOfLastStatusChange).to.equal(fixAction.payload.buildDate);
  });
  
});

describe('Build status selectors', () => {
  it('should get a successful build', () => {
    // given
    const state = byId({}, createBuildNotification());
    // when
    const builds = getSuccessfulBuilds(state);
    // then
    expect(builds).to.deep.equal([{ id: "dummy", name: "dummy", minutesSinceBuild: 0 }]);
   
  });
  
  it('should remove build from successful builds after a failure', () => {
    // given
    const state = byId({}, createBuildNotification());
    // when
    const newState = byId(state, createBuildNotification(false));
    const builds = getSuccessfulBuilds(newState);
    // then
    expect(builds).to.deep.equal([]);
  });
  
  it('should get a failed build', () => {
    // given
    const state = byId({}, createBuildNotification(false));
    // when
    const builds = getFailedBuilds(state);
    // then
    expect(builds).to.deep.equal([{ id: "dummy", name: "dummy", minutesSinceBuild: 0 }]);
  });
  
  it('should remove build from failed builds after a success', () => {
    // given
    const state = byId({}, createBuildNotification(false));
    // when
    const newState = byId(state, createBuildNotification());
    const builds = getFailedBuilds(newState);
    // then
    expect(builds).to.deep.equal([]);
  });
  
  it('should get a build with the number of minuted since it was finished', () => {
    // given
    const notification = createBuildNotification();
    notification.payload.buildDate = new Date(2010, 1, 1, 1, 0, 0);
    const state = byId({}, notification);
    // when
    const now = new Date(2010, 1, 1, 1, 0 + 42, 0);
    const builds = getSuccessfulBuilds(state, now);
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
    const builds = getSuccessfulBuilds(state, now);
    // then
    expect(builds.map(build => build.id)).to.be.deep.equal(["B", "C", "A"]);
  });

  const buildState = (actions: Array<Action<any>>, initialState: BuildsByIdState = {}) => (
    actions.reduce((state, action) => byId(state, action), initialState)    
  );
  
});
