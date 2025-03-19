import React from 'react';
import Welcome from './utils/welcome';

import '../public/media/dtable-font.css';
import '../public/media/seatable-ui.css';
import './css/story-cover.css';

export default {
  title: 'Introduce/welcome',
  component: Welcome,
};

export const welcome = (args) => <Welcome />;
