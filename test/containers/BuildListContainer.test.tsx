import { expect } from 'chai';
import * as React from 'react';
import { shallow } from 'enzyme';
import { BuildListContainer } from '../../src/containers/BuildListContainer'

describe('BuildListContainer', () => {
  
    it('should generate a panel with a header counting total number of builds', () => {
  
      const wrapper = shallow(
          <BuildListContainer 
            failedBuilds={[
              { id: "123", name: "bad", minutesSinceBuild: 0 }
            ]} 
            successfulBuilds={[
              { id: "456", name: "good", minutesSinceBuild: 0 }
            ]}  
          />
        );
      const header = wrapper.prop("header");
      expect(header).to.contain("2");
    });
    
    
});
