import * as moment from 'moment';
import { AppState } from './reducers';

export interface Action<T> {
    type: string,
    payload: T
}

export interface BuildNotification {
    success : boolean;
    buildId : string;
    buildName : string;    
    buildNumber: number;
    buildDate: Date;
    statusText: string;
}

export const types = {
  BUILD_NOTIFICATION : "BUILD_NOTIFICATION",
  CLOCK_TICK : "CLOCK_TICK"  
}


export const createNotification = (notification: BuildNotification): Action<BuildNotification> => (
  { 
    type: types.BUILD_NOTIFICATION,
    payload: notification 
  }
);

export const parseBuildNotification = (data: any): BuildNotification => {
  return { 
    buildDate: moment(data.finishDate, "YYYYMMDDTHHmmssZ").toDate(), 
    buildId: data.buildTypeId,
    buildName: data.buildType.projectName,
    buildNumber: parseInt(data.number),
    success: data.status == "SUCCESS",
    statusText: data.statusText
  };
}

export const isNewBuild = (notification: BuildNotification, state: AppState): boolean => {
  const buildState = state.byId[notification.buildId];  
  if (!buildState) {
    return true;
  }
  return !moment(notification.buildDate).isSame(buildState.lastKnownBuildStatus.buildDate);
}

export const createClockTick = (tick: Date): Action<Date> => (
  { 
    type: types.CLOCK_TICK,
    payload: tick 
  }
);