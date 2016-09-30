import { expect } from 'chai';
import * as React from 'react';
import { Label } from "react-bootstrap";
import { shallow, mount } from 'enzyme';
import Duration from './Duration';

describe('Duration', () => {

    it('should be "just now" when less than 2 minutes', () => {
      // when
      const wrapper = mount(
        <Duration 
           minutes={1} 
        />);
      // then
      expect(wrapper.text()).to.contain("just now");
    });

    it('should return the number of minutes if less than 1h/60min', () => {
      // given
      const minutes = Math.floor(Math.random() * 59);
      // when
      const wrapper = mount(
        <Duration 
           minutes={minutes} 
        />
      );
      // then
      expect(wrapper.text()).to.contain(`${minutes} minutes ago`)
    });

    it('should return one hour when more than 60min', () => {
      // given
      const minutes = Math.floor(Math.random() * 59 + 60);
      // when
      const wrapper = mount(
        <Duration 
           minutes={minutes} 
        />
      );
      // then
      expect(wrapper.text()).to.contain(`1 hour ago`)
    })

    it('should return X hours when more than one hour', () => {
      // given
      const minutes = 2 * 60 + 33;
      // when
      const wrapper = mount(
        <Duration 
           minutes={minutes} 
        />
      );
      // then
      expect(wrapper.text()).to.contain(`2 hours ago`)
    })


    it('should return a Label instead of a span when above threshold', () => {
      // given
      const threshold = Math.floor(Math.random() * 59 + 60);
      const minutes = threshold + 1;
      // when
      const wrapper = mount(
        <Duration 
           minutes={minutes}
           threshold={threshold} 
        />
      );
      // then
      expect(wrapper.find(Label)).to.have.length(1);
    })
    
});
