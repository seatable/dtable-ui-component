import React from 'react';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import ShowCode from '../../utils/show-code';
import { SingleSelectFormatter } from '../../../src/components/cell-formatter';

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

storiesOf('cells|single-select-formatter', module)
  .addDecorator(withInfo)
  .add('single-select使用文档', () => (
    <div>
      <h1>类型一</h1>
      <ShowCode sub={"单选标签按钮"}>
        <SingleSelectFormatter value={'1111'} options={options} />
        <SingleSelectFormatter value={'2222'} options={options} />
        <SingleSelectFormatter value={'3333'} options={options} />
        <SingleSelectFormatter value={'4444'} options={options} />
        <SingleSelectFormatter value={'5555'} options={options} />
      </ShowCode>
    </div>
  ), {
    info: {
      text: '<h1>API</h1>',
      inline: true,
      source: false,
      propTablesExclude: [ShowCode]
    }
  })






