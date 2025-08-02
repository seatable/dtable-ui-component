import { action } from 'storybook/actions';
import DTableColorPicker from '../../src/DTableColorPicker';

export default {
  title: 'General/DTableColorPicker',
  component: DTableColorPicker,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {},
  args: {
    onSubmit: (updated) => {action('onCommit')(updated);},
  },
};

export const Demo1 = {
  args: {
    color: '#111111',
    defaultColors: ['#111111', '#222222', '#eef6f9', '#deffe6', '#aaaaaa', '#bbbbbb', '#eeeeee', '#da32ef'],
    popoverStyle: { left: '30px' },
    onToggle: () => {},
  }
};

export const Demo2 = {
  args: {
    color: '#aaaaaa',
    defaultColors: ['#111111', '#222222', '#eef6f9', '#deffe6', '#aaaaaa', '#bbbbbb'],
    popoverStyle: { right: '10px' },
    onToggle: () => {},
  }
};

export const Demo3 = {
  args: {
    color: '#666666',
    defaultColors: ['#111111', '#222222', '#eef6f9', '#deffe6'],
    popoverStyle: { bottom: '20px' },
    onToggle: () => {},
  }
};
