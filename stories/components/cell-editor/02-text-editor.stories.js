import React from 'react';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import { action } from '@storybook/addon-actions';
import ShowCode from '../../utils/show-code';
import Description from '../../utils/description';
import { TextEditor } from '../../../src/components/cell-editor';

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

const value1_1 = 'alex';
const column1_1 = {
  key: '0000',
  type: 'text',
  name: 'Name',
  data: null,
};

const value2_1 = 'LiLei';
const column2_1 = {
  key: '0000',
  type: 'text',
  name: 'Name',
  data: null
};

storiesOf('Editors|text-editor', module)
  .addDecorator(withInfo)
  .add('text editor component', () => {
    return (
      <div>
        <h1>Scene One: editor permission is readonly</h1>
        <ShowCode sub={"text editor"}>
          <TextEditor 
            isReadOnly={true}
            value={value1_1} 
            column={column1_1}
            onCommit={(updated) => action('onCommit')(updated)}
          />
        </ShowCode>
        <h1>Scene One: editor permission is read and write</h1>
        <ShowCode sub={"text editor"}>
          <TextEditor 
            isReadOnly={false}
            value={value2_1} 
            column={column2_1}
            onCommit={(updated) => action('onCommit')(updated)}
          />
        </ShowCode>
      </div>
    )
  }, {info})






