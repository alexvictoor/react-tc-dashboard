import { createStore as reduxCreateStore, applyMiddleware, combineReducers, ReducersMapObject, Store } from "redux";
import { byId, buildsToDisplay, BuildsByIdState, BuildsToDisplayState, BuildShortDescription } from "./build-status-reducers"; 
import  * as builds from "./build-status-reducers";
import clock from "./clock"
import * as moment from 'moment';

export interface AppState {
  byId?: BuildsByIdState,
  buildsToDisplay?: BuildsToDisplayState,
  clock?: Date
}

export const createStore = (initialState : AppState) : Store<AppState> => {
  const reducer = combineReducers(
    { 
      byId, 
      buildsToDisplay,
      clock
    }
  );
  const store = reduxCreateStore(reducer, initialState, (window as any).devToolsExtension && (window as any).devToolsExtension())

  return store
}

export const getSuccessfulBuilds = (state : AppState) : BuildShortDescription[] => {
  return builds.getSuccessfulBuilds(state.byId, state.clock);
}

export const getFailedBuilds = (state : AppState) : BuildShortDescription[] => {
  return builds.getFailedBuilds(state.byId, state.clock);
}

export const getLastBuildNumber = (id : string, state : AppState) : number => {
  return builds.getLastBuildNumber(id, state.byId);
}


export interface BuildDetails {
  id: string,
  name: string,
  healthy: boolean,
  brokenTimeInMin?: number,
  numberAttemptsToFix?: number,
  messageOfFirstBrokenBuild?: string
}

export const getBuildHighlight = (state: AppState): BuildDetails => {
  
  const id = state.buildsToDisplay.buildToShowId;

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
      = build.lastKnownBuildStatus.buildNumber - build.lastKnownSuccess.buildNumber - 1;    
    
    result = {
      id: build.buildName,
      name: build.buildName,
      healthy: false,
      brokenTimeInMin,
      numberAttemptsToFix,
      messageOfFirstBrokenBuild: build.lastKnownFailure.text
    }
  }

  return result;
}