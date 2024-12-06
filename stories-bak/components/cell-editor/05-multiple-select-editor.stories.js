import React from 'react';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import { action } from '@storybook/addon-actions';
import ShowCode from '../../utils/show-code';
import Description from '../../utils/description';
import MultipleSelectEditor from '../../../src/MultipleSelectEditor';

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

const value1_1 = [];
const column1_1 = {
  key: '0000',
  type: 'multiple-select',
  name: 'state',
  data: {
    options: [
      {id: '1111', name: '未开始', color: 'red'},
      {id: '2222', name: '开始', color: 'blue'},
      {id: '3333', name: '结束', color: 'green'}
    ]
  },
};

const value1_2 = ['1111'];

const value2_1 = [];
const column2_1 = {
  key: '256713',
  type: 'multiple-select',
  name: 'state',
  data: {
    options: [
      {id: "256713", name: "待开始", color: "#EED5FF"},
      {name: "进行中", color: "#D7E8FF", textColor: "#212529", id: "839569"},
      {name: "评审", color: "#FFFDCF", id: "954270"},
      {name: "已完成", color: "#DDFFE6", textColor: "#212529", id: "686249"},
      {id: "669117", name: "需要设计稿", color: "#FFFDCF"},
    ]
  },
};

const value2_2 = ['1111'];

storiesOf('Editors|multiple-select-editor', module)
  .addDecorator(withInfo)
  .add('multiple-select editor component', () => {
    return (
      <div>
        <h1>Scene One: editor permission is readonly</h1>
        <ShowCode sub={"multiple-select editor: null value in the editor"}>
          <MultipleSelectEditor 
            isReadOnly={true}
            value={value1_1} 
            column={column1_1}
            onCommit={(updated) => action('onCommit')(updated)}
          />
        </ShowCode>
        <ShowCode sub={"multiple-select editor: a default value in the editor"}>
          <MultipleSelectEditor 
            isReadOnly={true}
            value={value1_2} 
            column={column1_1}
            onCommit={(updated) => action('onCommit')(updated)}
          />
        </ShowCode>
        <h1>Scene One: editor permission is read and write</h1>
        <ShowCode sub={"multiple-select editor: null value in the editor"}>
          <MultipleSelectEditor 
            isReadOnly={false}
            value={value2_1} 
            column={column2_1}
            onCommit={(updated) => action('onCommit')(updated)}
          />
        </ShowCode>
        <ShowCode sub={"multiple-select editor: a default value in the editor"}>
          <MultipleSelectEditor 
            isReadOnly={false}
            value={value2_2} 
            column={column2_1}
            onCommit={(updated) => action('onCommit')(updated)}
          />
        </ShowCode>
        <ShowCode sub={"multiple-select editor: can create a new option by the search value"}>
          <MultipleSelectEditor 
            isReadOnly={false}
            value={value2_2} 
            column={column2_1}
            onCommit={(updated) => action('onCommit')(updated)}
            isSupportNewOption={true}
            onAddNewOption={(optionName) => action('onAddNewOption')(optionName)}
          />
        </ShowCode>
      </div>
    )
  }, {info})
