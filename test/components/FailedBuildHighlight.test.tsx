import { expect } from 'chai';
import * as React from 'react';
import { shallow, mount } from 'enzyme';
import FailedBuildHighlight from '../../src/components/FailedBuildHighlight.tsx';

describe('FailedBuildHighlight', () => {

    it('should generate a chunk of html with an image', () => {
      const wrapper = mount(
        <FailedBuildHighlight 
           id="foo"
           name="Some successful build" 
           picture="foo.gif"
           brokenTimeInMin={12}
           numberAttemptsToFix={3}
           messageOfFirstBrokenBuild="crap" 
        />);
      expect(wrapper.find("img")).to.have.length(1);
      expect(wrapper.find("img").at(0).prop("src")).to.be.equal("foo.gif");
    });
    
});
