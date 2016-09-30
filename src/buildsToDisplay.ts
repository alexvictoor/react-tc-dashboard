import { Action, BuildNotification, types } from "./actions";
import * as moment from 'moment';


export enum BuildEvent {
  Failed,
  Repaired
}

export interface BuildsToDisplayState {
  buildToShowId: string | null;
  ticksSinceBuildWasChoosen: number;
  buildToShowStatus: BuildEvent | null;
  failedBuilds: string[];
}


export default (
  state: BuildsToDisplayState = { 
    buildToShowId: null, 
    buildToShowStatus: null,
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

const chooseNewBuild = (state: BuildsToDisplayState): string  => {
  const currentId = state.buildToShowId || "";
  const nextIdIndex 
    = (state.failedBuilds.indexOf(currentId) + 1) % state.failedBuilds.length;
  return state.failedBuilds[nextIdIndex];
}

