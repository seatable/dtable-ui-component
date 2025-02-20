import React from 'react';
import { shallow } from 'enzyme';
import Loading from '../../src/Loading';

describe('components/loading', () => {
  it('basic test', () => {
    let wrapper = shallow(<Loading />);
    // eslint-disable-next-line jest/valid-expect
    expect(wrapper.find('.dtable-ui-loading-icon').hasClass('dtable-ui-loading-tip'));
  });
});
