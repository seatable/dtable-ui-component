import React from 'react';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import { action } from '@storybook/addon-actions';
import ShowCode from '../../utils/show-code';
import Description from '../../utils/description';
import { SingleSelectEdtior } from '../../../src/components/cell-editor';
import { setLocale } from '../../../src/lang';

// setLocale('zh-cn');

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

const value1_1 = '';
const column1_1 = {
  key: '0000',
  type: 'single-select',
  name: 'state',
  data: {
    options: [
      {id: '1111', name: '未开始', color: 'red'},
      {id: '2222', name: '开始', color: 'blue'},
      {id: '3333', name: '结束', color: 'green'}
    ]
  },
};

const value1_2 = '1111';

const value2_1 = '';
const column2_1 = {
  key: '0000',
  type: 'single-select',
  name: 'state',
  data: {
    options: [
      {id: '1111', name: '未开始', color: 'red'},
      {id: '2222', name: '开始', color: 'blue'},
      {id: '3333', name: '结束', color: 'green'}
    ]
  },
};

const value2_2 = '1111';

storiesOf('Editors|single-select-editor', module)
  .addDecorator(withInfo)
  .add('single-select editor component', () => {
    return (
      <div>
        <h1>Scene One: editor permission is readonly</h1>
        <ShowCode sub={"single-select editor: null value in the editor"}>
          <SingleSelectEdtior 
            isReadOnly={true}
            value={value1_1} 
            column={column1_1}
            onCommit={(updated) => action('onCommit')(updated)}
          />
        </ShowCode>
        <ShowCode sub={"single-select editor: a default value in the editor"}>
          <SingleSelectEdtior 
            isReadOnly={true}
            value={value1_2} 
            column={column1_1}
            onCommit={(updated) => action('onCommit')(updated)}
          />
        </ShowCode>
        <h1>Scene One: editor permission is read and write</h1>
        <ShowCode sub={"single-select editor: null value in the editor"}>
          <SingleSelectEdtior 
            isReadOnly={false}
            value={value2_1} 
            column={column2_1}
            onCommit={(updated) => action('onCommit')(updated)}
          />
        </ShowCode>
        <ShowCode sub={"single-select editor: a default value in the editor"}>
          <SingleSelectEdtior 
            isReadOnly={false}
            value={value2_2} 
            column={column2_1}
            onCommit={(updated) => action('onCommit')(updated)}
          />
        </ShowCode>
        <ShowCode sub={"single-select editor: can create a new option by the search value"}>
          <SingleSelectEdtior 
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






