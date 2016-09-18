import { expect } from 'chai';
import * as React from 'react';
import { shallow } from 'enzyme';
import { BuildHighlightContainer } from '../../src/containers/BuildHighlightContainer.tsx'
import RepairedBuildHighlight from '../../src/components/RepairedBuildHighlight.tsx'
import FailedBuildHighlight from '../../src/components/FailedBuildHighlight.tsx'



declare const global: any;

describe('BuildHighlightContainer', () => {
  
    it('should generate a repaired build highlight when build healthy', () => {
      const wrapper = shallow(<BuildHighlightContainer healthy={true} name="Some Build" />);
      const found = wrapper.find(RepairedBuildHighlight)
      expect(found).to.have.length(1);
    });
    
    it('should generate a failed build highlight when build broken', () => {
      const wrapper = shallow(
        <BuildHighlightContainer 
          healthy={false} 
          name="Some Build"
          brokenTimeInMin={12} 
          numberAttemptsToFix={3}
        />
      );
      const found = wrapper.find(FailedBuildHighlight)
      expect(found).to.have.length(1);
      expect(found.at(0).prop("name")).to.be.equal("Some Build");
      expect(found.at(0).prop("brokenTimeInMin")).to.be.equal(12);
      expect(found.at(0).prop("numberAttemptsToFix")).to.be.equal(3);      
    });
 
    global.conf = { successPictures: ["success.png"], failurePictures: ["failure.png"] };
      
    it('should generate a repaired build highlight with a success picture', () => {
      const wrapper = shallow(<BuildHighlightContainer healthy={true} name="Some Build" />);
      const found = wrapper.find(RepairedBuildHighlight).at(0);
      expect(found.prop("picture")).to.be.equal("success.png");
    });
    
    it('should generate a failed build highlight with a failure picture', () => {
      const wrapper = shallow(
        <BuildHighlightContainer 
          healthy={false} 
          name="Some Build"
          brokenTimeInMin={12} 
          numberAttemptsToFix={3}
        />
      );
      const found = wrapper.find(FailedBuildHighlight).at(0);
      expect(found.prop("picture")).to.be.equal("failure.png");
    });
    
});
