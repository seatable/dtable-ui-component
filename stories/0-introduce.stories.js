import React from 'react';
import { storiesOf } from '@storybook/react'
import Welcome from './utils/welcome';

import '../public/media/dtable-font.css';
import '../public/media/seatable-ui.css';
import './css/story-cover.css';

storiesOf('Introduce|welcome', module)
  .add('welcome', () => (<Welcome />))
