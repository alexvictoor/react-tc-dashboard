import { Action, BuildNotification, types } from "./actions";
import * as moment from 'moment';

interface Build {
  buildId: string;
  buildName: string;  
  lastKnownBuildStatus: BuildStatus,
  lastKnownSuccess: BuildStatus,
  lastKnownFailure: BuildStatus
}

interface BuildStatus {
  success: boolean;
  buildNumber: number;
  buildDate: Date;  
  text: string;
}

export enum BuildEvent {
  Failed,
  Repaired
}

export interface BuildsByIdState {
    [id: string]: Build
}

// TODO include corejs instead to get Object.assign
const copy = <T>  (src : T) : T => {
  const result = {}  
   for (var key in src) {
     result[key] = src[key];
   }
  return result as T;
}


export const byId = (state: BuildsByIdState = {}, action: Action<BuildNotification>) : BuildsByIdState => {
  if (action && action.type === types.BUILD_NOTIFICATION) {

    const notification = action.payload;

    const build : Build = copy(
      state[notification.buildId] || 
      {
          buildId : notification.buildId,
          buildName : notification.buildName,  
          lastKnownBuildStatus: null,
          lastKnownSuccess: {
            success: true,
            buildDate: notification.buildDate,
            buildNumber: notification.buildNumber - 1,
            text: ""
          },
          lastKnownFailure: null
      }
    );

    build.lastKnownBuildStatus = {
      success: notification.success,
      buildDate: notification.buildDate,
      buildNumber: notification.buildNumber,
      text: notification.statusText
    };
    
    if (notification.success) {
      build.lastKnownSuccess = build.lastKnownBuildStatus;      
    } else {
      build.lastKnownFailure = build.lastKnownBuildStatus;
    }
    
    const newState = copy(state);
    newState[notification.buildId] = build;
    return newState;
  }
  return state;
}


export interface BuildsToDisplayState {
  buildToShowId: string;
  ticksSinceBuildWasChoosen: number;
  buildToShowStatus: BuildEvent;
  failedBuilds: string[];
}


export const buildsToDisplay = (
  state: BuildsToDisplayState = { 
    buildToShowId: null, 
    buildToShowStatus: null,
    ticksSinceBuildWasChoosen: 0,
    failedBuilds: [] 
  }, 
  action: Action<any>) : BuildsToDisplayState => {
    
  if (action && action.type === types.BUILD_NOTIFICATION) {
    const notification 
      = (action as Action<BuildNotification>).payload;
    const buildId = notification.buildId;
    if (notification.success) {
      const repairedBuild 
        = state.failedBuilds.indexOf(buildId) > -1;
      if (repairedBuild) {
        const failedBuilds 
          = state.failedBuilds.filter(id => id !== buildId);
        return {
          buildToShowId: buildId,
          buildToShowStatus: BuildEvent.Repaired,
          ticksSinceBuildWasChoosen: 0,
          failedBuilds
        }
      } else if (state.buildToShowId === buildId) {
        return {
          buildToShowId: chooseNewBuild(state),
          buildToShowStatus: BuildEvent.Failed,
          ticksSinceBuildWasChoosen: 0,
          failedBuilds: state.failedBuilds
        }  
      } 
    } else {
      const alreadyFailedBuild 
        = state.failedBuilds.indexOf(buildId) > -1;
      const failedBuilds 
        = alreadyFailedBuild ? 
          state.failedBuilds : [ ...state.failedBuilds, buildId];

      return {
        buildToShowId: buildId,
        buildToShowStatus: BuildEvent.Failed,
        ticksSinceBuildWasChoosen: 0,
        failedBuilds
      }
    }
    
  }  
  
  if (action && action.type === types.CLOCK_TICK) {
    const ticks = state.ticksSinceBuildWasChoosen + 1;
    if (ticks == 1 || state.failedBuilds.length == 0) {
      return {
        buildToShowId: state.buildToShowId,
        buildToShowStatus: state.buildToShowStatus,
        ticksSinceBuildWasChoosen: (state.ticksSinceBuildWasChoosen + 1),
        failedBuilds: state.failedBuilds
      }
    } else {
      const buildId = chooseNewBuild(state);
      return {
        buildToShowId: buildId,
        buildToShowStatus: state.buildToShowStatus,
        ticksSinceBuildWasChoosen: 0,
        failedBuilds: state.failedBuilds
      }
    }
  }
    
  return state;
}

const chooseNewBuild = (state: BuildsToDisplayState) : string => {
  const currentId = state.buildToShowId;
  const nextIdIndex 
    = (state.failedBuilds.indexOf(currentId) + 1) % state.failedBuilds.length;
  return state.failedBuilds[nextIdIndex];
}


// selectors

export interface BuildShortDescription {
  id: string;
  name: string;  
  minutesSinceBuild: number;
}



const getBuildsByStatus = (state : BuildsByIdState, success : boolean, now = new Date()) : BuildShortDescription[] => {
  const result: BuildShortDescription[] = [];
  for (var key in state) {
    const build = state[key];
    if (build.lastKnownBuildStatus.success === success) {
      const minutesSinceBuild
        = moment(now)
          .diff(
            moment(build.lastKnownBuildStatus.buildDate), 
            "minute"
          );
      result.push({ id: build.buildId, name: build.buildName, minutesSinceBuild });
    }
  }
  return result;
}

export const getSuccessfulBuilds = (state : BuildsByIdState, now = new Date()) : BuildShortDescription[] => {
  return getBuildsByStatus(state, true, now);
}

export const getFailedBuilds = (state : BuildsByIdState, now = new Date()) : BuildShortDescription[] => {
  return getBuildsByStatus(state, false, now);
}

export const getLastBuildNumber = (id : string, state : BuildsByIdState) : number => {
  if (state[id]) {
    return state[id].lastKnownBuildStatus.buildNumber;
  }
  return 0;
}

