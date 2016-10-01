import { expect } from 'chai';
import * as React from 'react';
import { shallow, mount } from 'enzyme';
import MediaHighlight from './MediaHighlight';

describe('MediaHighlight', () => {

    it('should generate an image element when picture is not an mp4 file', () => {
      const wrapper = shallow(<MediaHighlight picture="foo.gif" />);
      expect(wrapper.find("img")).to.have.length(1);
      expect(wrapper.find("img").at(0).prop("src")).to.be.equal("foo.gif");
    });

    it('should generate a video element when picture is an mp4 file', () => {
      const wrapper = shallow(<MediaHighlight picture="foo.mp4" />);
      expect(wrapper.find("video")).to.have.length(1);
      expect(wrapper.find("video").at(0).childAt(0).prop("src")).to.be.equal("foo.mp4");
    });
    
});