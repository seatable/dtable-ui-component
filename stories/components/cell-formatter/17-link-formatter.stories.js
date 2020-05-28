import React from 'react';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import ShowCode from '../../utils/show-code';
import { LinkFormatter } from '../../../src/components/cell-formatter';

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

const linkedData = [
  {
    _id: 'abcd', 
    table1_id: '0000', 
    table2_id: '1111',
    table1_table2_maps: {
      '111': ['aaa', 'bbb', 'ddd'],
      '222': ['ccc'],
      '333': ['aaa', 'bbb', 'ccc'],
    },
    table2_table1_maps: {
      'aaa': ['111', '333'],
      'bbb': ['111', '333'],
      'ccc': ['222', '333'],
    }
  },
  {
    _id: 'mnpq', 
    table1_id: '1111', 
    table2_id: '0000',
    table1_table2_maps: {
      '111': ['aaa'],
      '222': ['bbb'],
      '333': ['bbb', 'ccc'],
    },
    table2_table1_maps: {
      'aaa': ['111'],
      'bbb': ['222', '333'],
      'ccc': ['333'],
    }
  },
  {
    _id: 'qwer', 
    table1_id: '0000', 
    table2_id: '1111',
    table1_table2_maps: {
      '111': ['ccc'],
      '222': ['aaa'],
      '333': ['bbb'],
    },
    table2_table1_maps: {
      'aaa': ['222'],
      'bbb': ['333'],
      'ccc': ['111'],
    }
  },
];

let linkedTables = [
  { 
    _id: '0000',
    rows: [
      {_id: '111', '0000': '小强'},
      {_id: '222', '0000': '小红'},
      {_id: '333', '0000': '小刚'},
    ],
    columns: [
      { key: '0000', name: 'Name', type: 'text'},
      { key: '1111', name: '计算', type: 'text'},
    ]
  },
  { 
    _id: '1111',
    rows: [
      {_id: 'aaa', '0000': '大疆'},
      {_id: 'bbb', '0000': '大河'},
      {_id: 'ccc', '0000': '大力'},
      {_id: 'ddd', '0000': '举头望明月，低头思故乡。举杯邀明月，对影成三人。'},
    ],
    columns: [
      { key: '0000', name: 'Name', type: 'text'},
      { key: '1111', name: '计算', type: 'text'},
    ]
  }
]

const row1 = { _id: '111' };
const row2 = { _id: 'aaa' };
const row3 = { _id: 'bbb' };

let column1 = {
  key: '0000',
  type: 'link',
  name: 'abcd',
  data: {
    link_id: 'abcd',
    table_id: '0000',
    other_table_id: '1111',
    display_column_key: '0000',
  }
};

let column2 = {
  key: '111',
  type: 'link',
  name: '山水人家',
  data: {
    link_id: 'abcd',
    table_id: '0000',
    other_table_id: '1111',
    display_column_key: '0000',
  }
};

let column3 = {
  key: '222',
  type: 'link',
  name: 'xiaoqiang',
  data: {
    link_id: 'qwer',
    table_id: '1111',
    other_table_id: '0000',
    display_column_key: '0000',
  }
}


let linkMetaData = {
  getLinkedCellValue: function(linkId, table1Id, table2Id, row_id) {
    let link = linkedData.find(link => link._id === linkId);
    let linkMaps = link.table1_table2_maps;
    if (table1Id !== link.table1_id) {
      linkMaps = link.table2_table1_maps;
    }
    return linkMaps[row_id];
  },
  getLinkedTable: function(tableId) {
    return linkedTables.find(linkedTable => linkedTable._id === tableId);
  },
  getLinkedRows: function(table, rowIds) {
    console.log(table);
    return table.rows.filter(row => {
      return rowIds.find(rowId => rowId === row._id);
    });
  },
  expandLinkedTableRow: function(row, tableId) {
    alert(row, tableId);
  }
}

storiesOf('CELLS|link-formatter', module)
  .addDecorator(withInfo)
  .add('link component', () => (
    <div>
      <h1>Sample display</h1>
      <ShowCode title={'the fomula result is a number value'}>
        <LinkFormatter 
          row={row1}
          column={column1}
          currentTableId={'0000'}
          linkMetaData={linkMetaData}
        />
      </ShowCode>
      <ShowCode title={'the fomula result is a string value'}>
        <LinkFormatter 
          row={row2} 
          column={column2}
          currentTableId={'1111'}
          linkMetaData={linkMetaData}
        />
      </ShowCode>
      <ShowCode title={'the fomula result is a date value'}>
        <LinkFormatter 
          row={row3}
          column={column3}
          currentTableId={'1111'}
          enableOpenLinkedRow={true}
          linkMetaData={linkMetaData}
        />
      </ShowCode>
    </div>
  ), {info})
