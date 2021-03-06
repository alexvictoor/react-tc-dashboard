import { expect } from 'chai';
import * as React from 'react';
import { shallow, mount } from 'enzyme';
import { ListGroupItem, Label } from "react-bootstrap";
import { BuildList, Duration } from '.'
import { BuildShortDescription } from '../byId'


describe('Component', () => {

  describe('BuildList', () => {
   
    const builds: BuildShortDescription[] = [ 
      { id: "1_first", name: "first", minutesSinceBuild: 0 },
      { id: "2_second", name: "second", minutesSinceBuild: 0 },
      { id: "3_third", name: "third", minutesSinceBuild: 0 }
    ];
    
    it('should generate one item per build', () => {
      const wrapper = shallow(<BuildList builds={builds} healthy={true} />);
      expect(wrapper.find(ListGroupItem)).to.have.length(3);
    });
    
    it('should apply cssClass on each build item', () => {
      const wrapper = shallow(<BuildList builds={builds} healthy={true} />);
      expect(wrapper.find(ListGroupItem).every({bsStyle: "success"})).to.be.true;
    });

  });
});