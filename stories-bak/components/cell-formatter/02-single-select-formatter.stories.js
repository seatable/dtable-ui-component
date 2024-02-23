import React from 'react';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import ShowCode from '../../utils/show-code';
import SingleSelectFormatter from '../../../src/SingleSelectFormatter';

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
    name: '未开始',
    color: '#e3f9f6',
  },
  {
    id: '2222',
    name: '进行中',
    color: '#ff7500',
  },
  {
    id: '3333',
    name: '待评审',
    color: '#eaff56',
  },
  {
    id: '4444',
    name: '已评审',
    color: '#faff72',
  },
  {
    id: '5555',
    name: '完成',
    color: '#00e500',
  },
]

storiesOf('CELLS|single-select-formatter', module)
  .addDecorator(withInfo)
  .add('single-select component', () => (
    <div>
      <h1>Sample display</h1>
      <ShowCode>
        <SingleSelectFormatter value={'1111'} options={options} />
      </ShowCode>
      <ShowCode>
        <SingleSelectFormatter value={'2222'} options={options} />
      </ShowCode>
      <ShowCode>
        <SingleSelectFormatter value={'3333'} options={options} />
      </ShowCode>
      <ShowCode>
        <SingleSelectFormatter value={'4444'} options={options} />
      </ShowCode>
      <ShowCode>
        <SingleSelectFormatter value={'5555'} options={options} />
      </ShowCode>
    </div>
  ), {info})






