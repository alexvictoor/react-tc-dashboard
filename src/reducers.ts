import { createStore as reduxCreateStore, applyMiddleware, combineReducers, ReducersMapObject, Store } from "redux";
import { byId, buildsToDisplay, BuildsByIdState, BuildsToDisplayState, BuildId, BuildDetails } from "./build-status-reducers"; 
import  * as builds from "./build-status-reducers";


export interface AppState {
  byId? : BuildsByIdState,
  buildsToDisplay? : BuildsToDisplayState
}

export const createStore = (initialState : AppState) : Store<AppState> => {
  const reducer = combineReducers(
    { 
      byId, 
      buildsToDisplay 
    }
  );
  const store = reduxCreateStore(reducer, initialState, (window as any).devToolsExtension && (window as any).devToolsExtension())

  return store
}

export const getSuccessfulBuildNames = (state : AppState) : BuildId[] => {
  return builds.getSuccessfulBuilds(state.byId);
}

export const getFailedBuildNames = (state : AppState) : BuildId[] => {
  return builds.getFailedBuilds(state.byId);
}

export const getLastBuildNumber = (id : string, state : AppState) : number => {
  return builds.getLastBuildNumber(id, state.byId);
}


export const getBuildHighlight= (state: AppState): BuildDetails => {
  const id = state.buildsToDisplay.buildToShowId;
  const build = state.byId[id];
  let result: BuildDetails;
  if (build.lastKnownBuildStatus.success) {
    
  } else {
    
  }
  /*const details: BuildDetails = {
    mess
    brokenTimeInMin: 0,
    
  }*/
  return result;
}