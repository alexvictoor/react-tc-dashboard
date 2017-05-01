import { Action, BuildNotification, types } from "./actions";
import * as moment from 'moment';

export interface Build {
  buildId: string;
  buildName: string;  
  buildsSinceLastStatusChange: number;
  buildDateOfLastStatusChange: Date;
  lastKnownBuildStatus: BuildStatus,
  lastKnownSuccess: BuildStatus,
  lastKnownFailure: BuildStatus
}

export interface BuildStatus {
  success: boolean;
  buildDate: Date;  
  text: string;
}

export interface BuildsByIdState {
    [id: string]: Build
}

export default (state: BuildsByIdState = {}, action?: Action<BuildNotification>): BuildsByIdState => {
  if (action && action.type === types.BUILD_NOTIFICATION) {

    const notification = action.payload;

    const build: Build = Object.assign( {},
      state[notification.buildId] || 
      {
          buildId : notification.buildId,
          buildName : notification.buildName,  
          buildsSinceLastStatusChange: 0,
          buildDateOfLastStatusChange: notification.buildDate,
          lastKnownBuildStatus: {
            success: true,
            buildDate: notification.buildDate,
            text: ""
          },
          lastKnownSuccess: {
            success: true,
            buildDate: notification.buildDate,
            text: ""
          },
          lastKnownFailure: null
      });

    if (notification.success === build.lastKnownBuildStatus.success) {
        build.buildsSinceLastStatusChange++;
    } else {
        build.buildsSinceLastStatusChange = 0;
        build.buildDateOfLastStatusChange = notification.buildDate;
    }

    build.lastKnownBuildStatus = {
      success: notification.success,
      buildDate: notification.buildDate,
      text: notification.statusText
    };
    
    if (notification.success) {
      build.lastKnownSuccess = build.lastKnownBuildStatus;      
    } else {
      build.lastKnownFailure = build.lastKnownBuildStatus;
    }
    
    const newState = Object.assign({}, state);
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

const getBuildsByStatus = (state: BuildsByIdState, success: boolean, now = new Date()): BuildShortDescription[] => {
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
  return result.sort((b1, b2) => b1.minutesSinceBuild - b2.minutesSinceBuild);
}

export const getSuccessfulBuilds = (state: BuildsByIdState, now = new Date()): BuildShortDescription[] => {
  return getBuildsByStatus(state, true, now);
}

export const getFailedBuilds = (state: BuildsByIdState, now = new Date()): BuildShortDescription[] => {
  return getBuildsByStatus(state, false, now);
}

export const getLatestBuildDate = (state: BuildsByIdState): Date => {
  return Object.keys(state).map(key => state[key]).reduce((lastBuildDate: Date, build: Build) => {
    if (build.lastKnownBuildStatus.buildDate > lastBuildDate) {
      return build.lastKnownBuildStatus.buildDate;
    }
    return lastBuildDate;
  }, new Date(0));
} 

