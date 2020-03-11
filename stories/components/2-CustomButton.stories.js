import React from 'react';
import CustomButton from '../../src/components/custom-button';

export default {
  title: 'SeaTable Button',
  component: CustomButton,
};

export const FirstTest = () => <CustomButton />;

FirstTest.story = {
  name: 'test',
};
