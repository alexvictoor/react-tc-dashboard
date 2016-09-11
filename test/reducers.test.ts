import { expect } from 'chai';
import * as reducers from "../src/reducers";
import * as actions from "../src/actions"

import "core-js"


const store = reducers.createStore({});

describe('Selector get build highlight', () => {
  
  it('should return failed build', () => {
    // given
    store.dispatch(actions.createNotification({
      buildId: "123",
      buildDate: null,
      buildName: "dummy",
      buildNumber: 12,
      success: false
    }));
    const initial = store.getState();
    // when
    const highlight = reducers.getBuildHighlight(initial);
    const expected: reducers.BuildDetails = {
      name: "dummy",
      healthy: false
    }
    expect(highlight).to.deep.equal(expected);    
  });
  
});