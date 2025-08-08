import { fn } from 'storybook/test';
import { action } from 'storybook/actions';
import LinkEditor from '../../src/LinkEditor';

export default {
  title: 'Editor/link',
  component: LinkEditor,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {},
  args: {
    onCommit: (updated) => {action('onCommit')(updated);},
    onClose: fn(),
  },
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
      { _id: '111', '0000': 'xiaohong' },
      { _id: '222', '0000': 'xiaomei' },
      { _id: '333', '0000': 'xiaogang' },
    ],
    columns: [
      { key: '0000', name: 'Name', type: 'text' },
      { key: '1111', name: '计算', type: 'text' },
    ]
  },
  {
    _id: '1111',
    rows: [
      { _id: 'aaa', '0000': 'Alex' },
      { _id: 'bbb', '0000': 'LiLei' },
      { _id: 'ccc', '0000': 'Kitty' },
      { _id: 'ddd', '0000': 'A long time ago, I had a lot of money to buy anything I wanted' },
      { _id: 'eee', '0000': 'Bob' },
      { _id: 'fff', '0000': 'simth' },
      { _id: 'ggg', '0000': 'Today i need do many work' },
      { _id: 'hhh', '0000': 'nothing can make me happy, if you married with me.' },
      { _id: 'iii', '0000': 'you are a sweet cat.' },
      { _id: 'jjj', '0000': 'i me a luck dog.' },
      { _id: 'kkk', '0000': 'who are you.' },
      { _id: 'lll', '0000': 'i am a dockert.' },
    ],
    columns: [
      { key: '0000', name: 'Name', type: 'text' },
      { key: '1111', name: '计算', type: 'text' },
    ]
  }
];

const row1 = { _id: '111' };
const row2 = { _id: 'aaa' };

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

let linkMetaData = {
  getLinkedCellValue: function (linkId, table1Id, table2Id, row_id) {
    let link = linkedData.find(link => link._id === linkId);
    let linkMaps = link.table1_table2_maps;
    if (table1Id !== link.table1_id) {
      linkMaps = link.table2_table1_maps;
    }
    return linkMaps[row_id];
  },
  getLinkedTable: function (tableId) {
    return linkedTables.find(linkedTable => linkedTable._id === tableId);
  },
  getLinkedRows: function (tableId, rowIds) {
    let table = this.getLinkedTable(tableId);
    return table.rows.filter(row => {
      return rowIds.find(rowId => rowId === row._id);
    });
  },
  addLink: function (linkId, table_id, other_table_id, row_id, other_row_id) {
    // eslint-disable-next-line no-console
    console.log(linkId, table_id, other_table_id, row_id, other_row_id);
  },
  removeLink: function (linkId, table_id, other_table_id, row_id, other_row_id) {
    // eslint-disable-next-line no-console
    console.log(linkId, table_id, other_table_id, row_id, other_row_id);
  }
};

export const Demo1 = {
  args: {
    isReadOnly: false,
    row: row1,
    column: column1,
    currentTableId: '0000',
    linkMetaData: linkMetaData,
  },
};

export const Demo2 = {
  args: {
    isReadOnly: false,
    row: row2,
    column: column2,
    currentTableId: '0000',
    linkMetaData: linkMetaData,
  },
};
