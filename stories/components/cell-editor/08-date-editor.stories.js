import React from 'react';
import { action } from '@storybook/addon-actions';
import DateEditor from '../../../src/DateEditor';

let column1 = {
  key: 'abcd',
  name: 'abcd',
  type: 'date',
  data: {
    format: 'YYYY-MM-DD'
  }
};

let column2 = {
  key: 'abcd',
  name: 'abcd',
  type: 'date',
  data: {
    format: 'YYYY-MM-DD HH:mm'
  }
};

const meta = {
  title: 'Editors/date-editor',
  component: DateEditor,
  tags: ['autodocs'],
  decorators: [
    (Story, context) => {
      return (
        <div>
          {context.parameters.title && <h1>{context.parameters.title}</h1>}
          {context.parameters.subTitle && <p className='storybook-sub'>{context.parameters.subTitle}</p>}
          <Story />
        </div>
      );
    }
  ],
  parameters: {
    title: '',
    subTitle: '',
  }
};

export default meta;

export const Demo1 = {
  args: {
    isReadOnly: false,
    isMobile: false,
    value: '2024-03-05',
    column: column1,
    onCommit: (updated) => { action('onCommit')(updated); },
  },
  parameters: {
    subTitle: ''
  }
};

export const Demo2 = {
  args: {
    isReadOnly: false,
    isMobile: false,
    value: '2024-03-05 08:00',
    column: column2,
    onCommit: (updated) => { action('onCommit')(updated); },
  },
  parameters: {
    subTitle: '',
  }
};
