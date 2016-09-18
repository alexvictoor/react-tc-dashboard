import { expect } from 'chai';
import * as React from 'react';
import { shallow, mount } from 'enzyme';
import RepairedBuildHighlight from '../../src/components/RepairedBuildHighlight.tsx';

describe('RepairedBuildHighlight', () => {

    it('should generate a chunk of html with an image', () => {
      const wrapper = mount(<RepairedBuildHighlight name="Some successful build" picture="foo.gif" />);
      expect(wrapper.find("img")).to.have.length(1);
      expect(wrapper.find("img").at(0).prop("src")).to.be.equal("foo.gif");
    });
    
});
