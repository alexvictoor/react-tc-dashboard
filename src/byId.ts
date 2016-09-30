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

export interface BuildsByIdState {
    [id: string]: Build
}

// TODO include corejs instead to get Object.assign
const copy = <T>  (src : T) : T => {
  const result: any = {}  
   for (let key in src) {
     result[key] = (src as any)[key];
   }
  return result as T;
}


export default (state: BuildsByIdState = {}, action?: Action<BuildNotification>) : BuildsByIdState => {
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
  return result.sort((b1, b2) => b1.minutesSinceBuild  - b2.minutesSinceBuild);
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

