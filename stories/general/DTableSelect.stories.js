import DTableSelect from '../../src/DTableSelect';

export default {
  title: 'General/DTableSelect',
  component: DTableSelect,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {},
  args: {},
};

export const Demo1 = {
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
    noOptionsMessage: () => { return 'No options'; },
  }
};
