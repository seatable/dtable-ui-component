import React from 'react';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import { action } from '@storybook/addon-actions';
import ShowCode from '../../utils/show-code';
import Description from '../../utils/description';
import { CheckboxEditor } from '../../../src/components/cell-editor';

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
  type: 'checkbox',
  name: 'Name',
  data: null,
};

const value1_2 = true;

const value2_1 = true;
const column2_1 = {
  key: '0000',
  type: 'checkbox',
  name: 'Name',
  data: null
};

storiesOf('Editors|checkbox-editor', module)
  .addDecorator(withInfo)
  .add('checkbox editor component', () => {
    return (
      <div>
        <h1>Scene One: editor permission is readonly</h1>
        <ShowCode sub={"checkbox editor: unchecked"}>
          <CheckboxEditor 
            isReadOnly={true}
            value={value1_1} 
            column={column1_1}
            onCommit={(updated) => action('onCommit')(updated)}
          />
        </ShowCode>
        <ShowCode sub={"checkbox editor: checked"}>
          <CheckboxEditor 
            isReadOnly={true}
            value={value1_2} 
            column={column1_1}
            onCommit={(updated) => action('onCommit')(updated)}
          />
        </ShowCode>
        <h1>Scene One: editor permission is read and write</h1>
        <ShowCode sub={"checkbox editor: can edit checked state"}>
        <CheckboxEditor 
          isReadOnly={false}
          value={value2_1} 
          column={column2_1}
          onCommit={(updated) => action('onCommit')(updated)}
          />
        </ShowCode>
      </div>
    )
  }, {info})






