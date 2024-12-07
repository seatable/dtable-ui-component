import React from 'react';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import ShowCode from '../../utils/show-code';
import Description from '../../utils/description';
import LinkEditor from '../../../src/LinkEditor';

const info = {
  text: '<h1>API</h1>',
  inline: true,
  source: false,
  propTablesExclude: [ShowCode, Description],
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
      '111': ['aaa', 'bbb', 'ddd', 'eee', 'ffff', 'hhh', 'iii'],
      '222': ['ccc'],
      '333': ['aaa', 'bbb', 'ccc'],
    },
    table2_table1_maps: {
      'aaa': [],
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
      'bbb': [],
      'ccc': ['111'],
    }
  },
];

let linkedTables = [
  { 
    _id: '0000',
    rows: [
      {_id: '111', '0000': 'xiaohong'},
      {_id: '222', '0000': 'xiaomei'},
      {_id: '333', '0000': 'xiaogang'},
    ],
    columns: [
      { key: '0000', name: 'Name', type: 'text'},
      { key: '1111', name: '计算', type: 'text'},
    ]
  },
  { 
    _id: '1111',
    rows: [
      {_id: 'aaa', '0000': 'Alex'},
      {_id: 'bbb', '0000': 'LiLei'},
      {_id: 'ccc', '0000': 'Kitty'},
      {_id: 'ddd', '0000': 'A long time ago, I had a lot of money to buy anything I wanted'},
      {_id: 'eee', '0000': 'Bob'},
      {_id: 'fff', '0000': 'simth'},
      {_id: 'ggg', '0000': 'Today i need do many work'},
      {_id: 'hhh', '0000': 'nothing can make me happy, if you married with me.'},
      {_id: 'iii', '0000': 'you are a sweet cat.'},
      {_id: 'jjj', '0000': 'i me a luck dog.'},
      {_id: 'kkk', '0000': 'who are you.'},
      {_id: 'lll', '0000': 'i am a dockert.'},
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
  getLinkedRows: function(tableId, rowIds) {
    let table = this.getLinkedTable(tableId);
    return table.rows.filter(row => {
      return rowIds.find(rowId => rowId === row._id);
    });
  },
  addLink: function(linkId, table_id, other_table_id, row_id, other_row_id) {
    console.log(linkId, table_id, other_table_id, row_id, other_row_id);
  },
  removeLink: function(linkId, table_id, other_table_id, row_id, other_row_id) {
    console.log(linkId, table_id, other_table_id, row_id, other_row_id);
  }
}

storiesOf('Editors|link-editor', module)
  .addDecorator(withInfo)
  .add('link editor component', () => {
    return (
      <div>
        <h1>Scene One: editor permission is readonly</h1>
        <ShowCode sub={"link editor: some default linked value in the linkData"}>
          <LinkEditor 
            isReadOnly={true}
            row={row1}
            column={column1}
            currentTableId={'0000'}
            linkMetaData={linkMetaData}
          />
        </ShowCode>
        <ShowCode sub={"link editor: no default linked value in the linkData"}>
          <LinkEditor 
            isReadOnly={true}
            row={row2}
            column={column2}
            currentTableId={'1111'}
            linkMetaData={linkMetaData}
          />
        </ShowCode>
        <h1>Scene One: editor permission is read and write</h1>
        <ShowCode sub={"link editor: some default linked value in the linkData"}>
          <LinkEditor 
            isReadOnly={false}
            row={row1}
            column={column1}
            currentTableId={'0000'}
            linkMetaData={linkMetaData}
          />
        </ShowCode>
        <ShowCode sub={"link editor: no default linked value in the linkData"}>
          <LinkEditor 
            isReadOnly={false}
            row={row3}
            column={column3}
            currentTableId={'1111'}
            linkMetaData={linkMetaData}
          />
        </ShowCode>
      </div>
    )
  }, {info})
