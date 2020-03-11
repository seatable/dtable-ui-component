import React from 'react';
import { shallow } from 'enzyme';
import CustomButton from '../../src/components/custom-button';

describe('components/custom-button', () => {
  it('basic test', () => {
    let wrapper = shallow(<CustomButton />);
    expect(wrapper.text()).toEqual('seatable component doc intruduction');
  })
})