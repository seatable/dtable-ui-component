import React from 'react';
import { action } from '@storybook/addon-actions';
import TextEditor from '../../../src/TextEditor';

const value1_1 = 'Hello SeaTable';

const column1_1 = {
  key: '0000',
  name: 'Read-write text editor',
};

const column1_2 = {
  key: '0000',
  name: 'Read-only text editor',
};

const meta = {
  title: 'Editors/text-editor',
  component: TextEditor,
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
    value: value1_1,
    column: column1_2,
    onCommit: (updated) => { action('onCommit')(updated); },
  },
  parameters: {
    subTitle: '',
  }
};
