import { 
  createStore as reduxCreateStore, 
  applyMiddleware, 
  combineReducers, 
  ReducersMapObject, 
  Store 
} from "redux";

import  byId, { 
  BuildsByIdState, 
  BuildShortDescription, 
  getLatestBuildDate,
  getFailedBuilds as doGetFailedBuilds, 
  getSuccessfulBuilds as doGetSuccessfulBuilds,
}  from "./byId";

import buildsToDisplay, { 
  BuildsToDisplayState 
} from "./buildsToDisplay"

import clock from "./clock"
import * as moment from 'moment';

export interface AppState {
  byId: BuildsByIdState,
  buildsToDisplay: BuildsToDisplayState,
  clock: Date
}

export const createStore = (initialState : any) : Store<AppState> => {
  const reducer = combineReducers(
    { 
      byId, 
      buildsToDisplay,
      clock
    }
  );
  const store 
    = reduxCreateStore(
        reducer, 
        initialState, 
        (window as any).devToolsExtension && (window as any).devToolsExtension()
      );

  return store as Store<AppState>
}

export const getSuccessfulBuilds = (state : AppState) : BuildShortDescription[] => {
  return doGetSuccessfulBuilds(state.byId, state.clock);
}

export const getFailedBuilds = (state : AppState) : BuildShortDescription[] => {
  return doGetFailedBuilds(state.byId, state.clock);
}

export interface BuildDetails {
  id?: string,
  name: string,
  healthy: boolean,
  brokenTimeInMin?: number,
  numberAttemptsToFix?: number,
  messageOfFirstBrokenBuild?: string,
  timeBeingGreenInMin?: number
}

export const getBuildHighlight = (state: AppState): BuildDetails => {
  
  const id = state.buildsToDisplay.buildToShowId;
  if (!id) {
    // all builds are green
    const latestBuildDate = getLatestBuildDate(state.byId);
    const timeBeingGreen
      = moment(state.clock)
        .diff(
          moment(latestBuildDate), 
          "minute"
        );

    return {
      id: "ALL",
      name: "ALL",
      healthy: true,
      timeBeingGreenInMin: timeBeingGreen
    }
  }

  const build = state.byId[id];
  let result: BuildDetails;
  if (build.lastKnownBuildStatus.success) {
    result = {
      id: build.buildId,
      name: build.buildName,
      healthy: true
    }
  } else {
    
    const brokenTimeInMin
      = moment(state.clock)
        .diff(
          moment(build.lastKnownFailure.buildDate), 
          "minute"
        );
        
    const numberAttemptsToFix 
      = build.buildsSinceLastStatusChange;    
    
    result = {
      id: build.buildId,
      name: build.buildName,
      healthy: false,
      brokenTimeInMin,
      numberAttemptsToFix,
      messageOfFirstBrokenBuild: build.lastKnownFailure.text
    }
  }

  return result;
}