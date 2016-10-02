import { expect } from "chai";
import * as actions from "./actions";
import clock from "./clock"

describe('Clock reducer', () => {

  it('should not update on build notification', () => {
    // when
    const state = clock(new Date(1970, 1), 
      actions.createNotification({
        buildId: "123",
        buildDate: new Date(2000, 1),
        buildName: "dummy",
        success: false,
        statusText: ""
      })
    );
    // then
    expect(state).to.deep.equal(new Date(1970, 1));
       
  });
  
  it('should update on tick notification', () => {
    // when
    const state = clock(new Date(1970, 1), 
      actions.createClockTick(
        new Date(2000, 1)
      )
    );
    // then
    expect(state).to.deep.equal(new Date(2000, 1));
       
  });
});
