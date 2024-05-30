import React from 'react';
import DTableRadioGroup from '../../../src/DTableRadioGroup';

const meta = {
  title: 'Common/DTableRadioGroup',
  component: DTableRadioGroup,
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
  args: {},
  parameters: {
    subTitle: ''
  }
};

export const Demo1 = Object.assign({}, Demo, {
  args: {
    activeOption: 'yes',
    options: ['yes', 'no'],
    optionsDisplay: { yes: 'Yes', no: 'No' },
    onSelectChanged: () => {},
  }
});

export const Demo2 = Object.assign({}, Demo, {
  args: {
    activeOption: 'top',
    options: ['top', 'vertical', 'bottom'],
    optionsDisplay: { top: 'Top', vertical: 'Vertical', bottom: 'Bottom' },
    onSelectChanged: () => {},
  }
});

export const Demo3 = Object.assign({}, Demo, {
  args: {
    activeOption: 'top',
    options: ['top', 'right', 'bottom', 'left'],
    optionsDisplay: { top: 'Top', right: 'Right', bottom: 'Bottom', left: 'Left' },
    onSelectChanged: () => {},
  }
});
