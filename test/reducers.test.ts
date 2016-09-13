import { expect } from "chai";
import { Store } from "redux"
import * as reducers from "../src/reducers";
import * as actions from "../src/actions";

import "core-js";

import * as moment from 'moment';



describe('Selector get build highlight', () => {

  let store: Store<reducers.AppState>
  
  beforeEach('init the store', () => {
    store = reducers.createStore({});
  });
  
  it('should return failed build', () => {
    // given
    store.dispatch(actions.createNotification({
      buildId: "123",
      buildDate: new Date(),
      buildName: "dummy",
      buildNumber: 12,
      success: false
    }));
    const initial = store.getState();
    // when
    const highlight = reducers.getBuildHighlight(initial);
    // then
    const expected: reducers.BuildDetails = {
      name: "dummy",
      healthy: false
    }
    expect(highlight.name).to.equal(expected.name);
    expect(highlight.healthy).to.equal(expected.healthy);
       
  });
  
  it('should return failed build with broken time ', () => {
    // given
    store.dispatch(actions.createNotification({
      buildId: "123",
      buildDate: new Date(2016, 1, 1, 1, 0),
      buildName: "dummy",
      buildNumber: 12,
      success: false
    }));
    store.dispatch(actions.createNotification({
      buildId: "123",
      buildDate: new Date(2016, 1, 1, 1, 23),
      buildName: "dummy",
      buildNumber: 13,
      success: false
    }));
    const initial = store.getState();
    // when
    const highlight = reducers.getBuildHighlight(initial);
    // then
    expect(highlight.brokenTimeInMin).to.deep.equal(23 - 0);   
  });
  
});