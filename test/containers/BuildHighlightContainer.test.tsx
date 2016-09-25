import { expect } from 'chai';
import * as React from 'react';
import { shallow } from 'enzyme';
import { BuildHighlightContainer } from '../../src/containers/BuildHighlightContainer'
import  { RepairedBuildHighlight, FailedBuildHighlight, AllBuildsGreenHighlight } from "../../src/components"



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
          messageOfFirstBrokenBuild="That sucks!"
        />
      );
      const found = wrapper.find(FailedBuildHighlight)
      expect(found).to.have.length(1);
      const container = found.at(0);
      expect(container.prop("name")).to.be.equal("Some Build");
      expect(container.prop("brokenTimeInMin")).to.be.equal(12);
      expect(container.prop("numberAttemptsToFix")).to.be.equal(3);      
      expect(container.prop("messageOfFirstBrokenBuild")).to.be.equal("That sucks!");      
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

    it('should generate an all green highlight when all builds green', () => {
      const wrapper = shallow(<BuildHighlightContainer healthy={true} name="ALL" />);
      const found = wrapper.find(AllBuildsGreenHighlight)
      expect(found).to.have.length(1);
      expect(found.prop("picture")).to.be.equal("success.png");
    });
    
});
