import { Action, BuildNotification, types } from "./actions";
import * as moment from 'moment';

export interface BuildsToDisplayState {
  buildToShowId: string | null;
  ticksSinceBuildWasChoosen: number;
  failedBuilds: string[];
}


export default (
  state: BuildsToDisplayState = { 
    buildToShowId: null, 
    ticksSinceBuildWasChoosen: 0,
    failedBuilds: [] 
  }, 
  action?: Action<any>) : BuildsToDisplayState  => {
    
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
          ticksSinceBuildWasChoosen: 0,
          failedBuilds
        }
      } else if (state.buildToShowId === buildId) {
        return {
          buildToShowId: chooseNewBuild(state),
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
        ticksSinceBuildWasChoosen: (state.ticksSinceBuildWasChoosen + 1),
        failedBuilds: state.failedBuilds
      }
    } else {
      const buildId = chooseNewBuild(state);
      return {
        buildToShowId: buildId,
        ticksSinceBuildWasChoosen: 0,
        failedBuilds: state.failedBuilds
      }
    }
  }
    
  return state;
}

const chooseNewBuild = (state: BuildsToDisplayState): string  => {
  const currentId = state.buildToShowId || "";
  const nextIdIndex 
    = (state.failedBuilds.indexOf(currentId) + 1) % state.failedBuilds.length;
  return state.failedBuilds[nextIdIndex];
}

