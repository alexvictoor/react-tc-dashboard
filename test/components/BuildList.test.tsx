import { expect } from 'chai';
import * as React from 'react';
import { shallow, mount } from 'enzyme';
import { ListGroupItem, Label } from "react-bootstrap";
import BuildList from '../../src/components/BuildList'
import { BuildShortDescription } from '../../src/build-status-reducers'


describe('Component', () => {

  describe('BuildList', () => {
   
    const builds: BuildShortDescription[] = [ 
      { id: "1_first", name: "first", minutesSinceBuild: 0 },
      { id: "2_second", name: "second", minutesSinceBuild: 0 },
      { id: "3_third", name: "third", minutesSinceBuild: 0 }
    ];
    
    it('should generate one item per build', () => {
      const wrapper = shallow(<BuildList builds={builds} cssClass="success" />);
      expect(wrapper.find(ListGroupItem)).to.have.length(3);
    });
    
    it('should apply cssClass on each build item', () => {
      const wrapper = shallow(<BuildList builds={builds} cssClass="success" />);
      expect(wrapper.find(ListGroupItem).every({bsStyle: "success"})).to.be.true;
    });

    it('should generate a message without label for new builds', () => {
      const newBuild = [
        { id: "new", name: "new build", minutesSinceBuild: 9 }
      ];
      const wrapper = shallow(<BuildList builds={newBuild} cssClass="success" />);
      expect(wrapper.find(Label)).to.have.length(0);
    });
    
  });
});