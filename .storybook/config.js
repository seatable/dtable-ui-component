import React from 'react';
import { addDecorator } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';


const backgroundDecorator = story => (
  <div className='main-wrapper'>
    { story() }
  </div>
)

addDecorator(withInfo);
addDecorator(backgroundDecorator);
