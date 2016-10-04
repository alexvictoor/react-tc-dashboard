import { expect } from 'chai';
import * as React from 'react';
import { shallow, mount } from 'enzyme';
import MediaHighlight from './MediaHighlight';
import Video from './Video';

describe('MediaHighlight', () => {

    it('should generate an image element when picture is not an mp4 file', () => {
      const wrapper = shallow(<MediaHighlight picture="foo.gif" />);
      expect(wrapper.find("img")).to.have.length(1);
      expect(wrapper.find("img").at(0).prop("src")).to.be.equal("foo.gif");
    });

    it('should generate a Video element when picture is an mp4 file', () => {
      const wrapper = shallow(<MediaHighlight picture="foo.mp4" />);
      expect(wrapper.find(Video)).to.have.length(1);
      expect(wrapper.find(Video).at(0).prop("source")).to.be.equal("foo.mp4");
    });
    
});