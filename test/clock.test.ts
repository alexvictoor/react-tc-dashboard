import { expect } from "chai";
import * as actions from "../src/actions";
import clock from "../src/clock"

describe('Clock reducer', () => {

  it('should update on build notification', () => {
    // when
    const state = clock(new Date(1970, 1), 
      actions.createNotification({
        buildId: "123",
        buildDate: new Date(2000, 1),
        buildName: "dummy",
        buildNumber: 12,
        success: false
      })
    );
    // then
    expect(state).to.deep.equal(new Date(2000, 1));
       
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