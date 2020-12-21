import React from 'react';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import ShowCode from '../../utils/show-code';
import { FormulaFormatter } from '../../../src/components/cell-formatter';

import '../../css/cell-formatter.css';

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

let tables = [
  { 
    _id: '0000',
    rows: [
      {_id: '111', '0000': 'xiaohong'},
      {_id: '222', '0000': 'xiaomei'},
      {_id: '333', '0000': 'xiaogang'},
    ],
    columns: [
      { key: '0000', name: 'Name', type: 'text'},
      { key: '1111', name: '计算', type: 'single-select', data: {
        options: [
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
          }
        ]
      }
    },
    { key: '2222', name: '负责人', type: 'collaborator'},
  ]
  },
  { 
    _id: '1111',
    rows: [
      {_id: 'aaa', '0000': 'Alex'},
      {_id: 'bbb', '0000': 'LiLei'},
      {_id: 'ccc', '0000': 'Kitty'},
      {_id: 'ddd', '0000': 'A long time ago, I had a lot of money to buy anything I wanted'},
    ],
    columns: [
      { key: '0000', name: 'Name', type: 'text'},
      { key: '1111', name: '计算', type: 'text'},
    ]
  }
]

const value1 = 123344;
const value2 = true;
const value3 = '1992-07-09 12:24';
const value4 = 'abcdeale';
const value5 = '5555';
const value6 = ['lilei@seafile.com'];
const value7 = 12300;

const collaborators = [
  {name: 'Alex', email: 'alex@seafile.com', contact_email: 'alex@seafile.com', avatar_url: 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=3574700877,553982185&fm=26&gp=0.jpg'},
  {name: 'LiLei', email: 'lilei@seafile.com', contact_email: 'lilei@seafile.com', avatar_url: 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3468940910,2793580922&fm=26&gp=0.jpg'},
  {name: 'Kitty', email: 'kitty@seafile.com', contact_email: 'kitty@seafile.com', avatar_url: 'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=139910319,1330512143&fm=26&gp=0.jpg'},
];

let column1 = {
  key: '0000',
  type: 'formula',
  name: 'abcd',
  data: {
    decimal: "dot",
    enable_precision: true,
    format: "number",
    thousands: "comma",
    precision: 2,
    result_type: 'number',
  }
};

let column2 = {
  key: '111',
  type: 'formula',
  name: '山水人家',
  data: {
    result_type: 'bool'
  }
};

let column3 = {
  key: '222',
  type: 'formula',
  name: 'xiaoqiang',
  data: {
    result_type: 'date',
    format: 'YYYY-MM-DD'
  }
}

let column4 = {
  key: '333',
  type: 'formula',
  name: 'xiaoqiang',
  data: {
    result_type: 'string',
  }
}

let column5 = {
  key: '444',
  type: 'formula',
  name: 'xiaoqiang',
  data: {
    result_type: 'column',
    display_column_key: '1111',
    linked_table_id: '0000'
  }
}

let column6 = {
  key: '555',
  type: 'formula',
  name: 'xiaowang',
  data: {
    result_type: 'column',
    display_column_key: '2222',
    linked_table_id: '0000'
  }
}

let column7 = {
  key: '666',
  type: 'formula',
  name: 'xiaowang',
  data: {
    result_type: 'number',
    format: 'duration',
  }
}

storiesOf('CELLS|formula-formatter', module)
  .addDecorator(withInfo)
  .add('formula component', () => (
    <div>
      <h1>Sample display</h1>
      <ShowCode title={'the formula result is a number value'}>
        <FormulaFormatter
          value={value1} 
          column={column1}
          containerClassName={'formula-container'} 
        />
      </ShowCode>
      <ShowCode title={'the formula result is a string value'}>
        <FormulaFormatter 
          value={value2} 
          column={column2}
          containerClassName={'formula-container'} 
        />
      </ShowCode>
       <ShowCode title={'the formula result is a date value'}>
        <FormulaFormatter 
          value={value3} 
          column={column3}
        />
      </ShowCode>
     <ShowCode title={'the formula result is a bool value'}>
        <FormulaFormatter 
          value={value4} 
          column={column4}
          containerClassName={'formula-container'} 
          collaborators={collaborators}
        />
      </ShowCode>
      <ShowCode title={'the formula result is a column value'}>
        <FormulaFormatter 
          value={value5} 
          column={column5}
          tables={tables}
        />
      </ShowCode>
      <ShowCode title={'the formula result is a column value'}>
        <FormulaFormatter 
          value={value6} 
          column={column6}
          tables={tables}
          collaborators={collaborators}
        />
      </ShowCode>
      <ShowCode title={'the formula result is a column value'}>
        <FormulaFormatter 
          value={value7} 
          column={column7}
          containerClassName={'formula-container'} 
        />
      </ShowCode>
    </div>
  ), {info})
