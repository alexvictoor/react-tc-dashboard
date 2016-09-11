import { expect } from 'chai';
import * as React from 'react';
import { shallow, mount } from 'enzyme';
import { ListGroupItem } from "react-bootstrap";
import BuildList from '../src/components/BuildList.tsx'


describe('Component', () => {

  describe('BuildList', () => {
   
    const builds = [ 
      { id: "1_first", name: "first" },
      { id: "2_second", name: "second" },
      { id: "3_third", name: "third" }
    ];
    
    it('should generate one item per build', () => {
      const wrapper = shallow(<BuildList builds={builds} cssClass="success" />);
      expect(wrapper.find(ListGroupItem)).to.have.length(3);
    });
    
    it('should apply cssClass on each build item', () => {
      const wrapper = shallow(<BuildList builds={builds} cssClass="success" />);
      expect(wrapper.find(ListGroupItem).every({bsStyle: "success"})).to.be.true;
    });
    
  });
});