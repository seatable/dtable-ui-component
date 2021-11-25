import React from 'react';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import ShowCode from '../../utils/show-code';
import MultipleSelectFormatter from '../../../src/MultipleSelectFormatter';


const info = {
  text: '<h1>API</h1>',
  inline: true,
  source: false,
  propTablesExclude: [ShowCode],
  styles: {
    header: {
      h1: {
        'marginBottom': '8px'
      }
    }
  }
};

let options = [
  {
    id: '1111',
    name: 'urgent',
    color: '#e3f9f6',
  },
  {
    id: '2222',
    name: 'not urgent',
    color: '#ff7500',
  },
  {
    id: '3333',
    name: 'important',
    color: '#eaff56',
  },
  {
    id: '4444',
    name: 'unimportant',
    color: '#faff72',
  },
]

storiesOf('CELLS|multiple-select-formatter', module)
  .addDecorator(withInfo)
  .add('multiple-select component', () => (
    <div>
      <h1>Sample display</h1>
      <ShowCode>
        <MultipleSelectFormatter value={['1111', '3333']} options={options} />
      </ShowCode>
      <ShowCode>
        <MultipleSelectFormatter value={['1111', '4444']} options={options} />
      </ShowCode>
      <ShowCode>
        <MultipleSelectFormatter value={['2222', '3333']} options={options} />
      </ShowCode>
      <ShowCode>
        <MultipleSelectFormatter value={['2222', '4444']} options={options} />
      </ShowCode>
    </div>
  ), {info})






