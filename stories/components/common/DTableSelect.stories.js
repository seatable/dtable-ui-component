import React from 'react';
import DTableSelect from '../../../src/DTableSelect';

const meta = {
  title: 'Common/DTableSelect',
  component: DTableSelect,
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

const Demo = {
  args: {
    value: ''
  },
  parameters: {
    subTitle: ''
  }
};

export const Demo1 = Object.assign({}, Demo, {
  args: {
    isMulti: false,
    isSearchable: true,
    isClearable: true,
    isDisabled: false,
    autoFocus: true,
    placeholder: 'Please select an option',
    options: [
      { value: 'chocolate', label: 'Chocolate' },
      { value: 'strawberry', label: 'Strawberry' },
      { value: 'vanilla', label: 'Vanilla' },
    ],
    value: { value: 'chocolate', label: 'Chocolate' },
    onChange: () => {},
    classNamePrefix: 'dtable-ui-component-demo',
    noOptionsMessage: () => { return 'No options' },
  }
});
