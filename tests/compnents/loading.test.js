import React from 'react';
import { shallow } from 'enzyme';
import Loading from '../../src/Loading';

describe('components/loading', () => {
  it('basic test', () => {
    let wrapper = shallow(<Loading />);
    expect(wrapper.find('.loading-icon').hasClass('loading-tip'));
  })
})
