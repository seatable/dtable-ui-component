import React from 'react';
import { action } from '@storybook/addon-actions';
import CheckboxEditor from '../../../src/CheckboxEditor';

const value1_1 = false;
const column1_1 = {
  key: '0000',
  type: 'checkbox',
  name: 'Name',
  data: null,
};

const value1_2 = true;
const column1_2 = {
  key: '0000',
  type: 'checkbox',
  name: 'Name',
  data: null
};

const meta = {
  title: 'Editors/checkbox-editor',
  component: CheckboxEditor,
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
    value: value1_1,
    column: column1_1,
    onCommit: (updated) => { action('onCommit')(updated); },
  },
  parameters: {
    subTitle: ''
  }
};

export const Demo2 = {
  args: {
    isReadOnly: true,
    value: value1_2,
    column: column1_2,
    onCommit: (updated) => { action('onCommit')(updated); },
  },
  parameters: {
    subTitle: '',
  }
};
