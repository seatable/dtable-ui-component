import React from 'react';
import { storiesOf } from '@storybook/react'
import Welcome from './welcome';

import '../public/media/seafile-ui.css';
import './css/story-cover.css';

export default {
  title: 'Introduce',
  component: Welcome,
};

storiesOf('Introduce|welcome', module)
  .add('welcome', () => {
    return (
      <div className="intro-wrapper">
        <h1 className="text-center">欢迎使用dtable-ui-component</h1>
        <div>
          <p>组件库使用规范</p>
        </div>
      </div>
    )
  })
