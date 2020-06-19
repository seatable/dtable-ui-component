import React from 'react';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import { action } from '@storybook/addon-actions';
import ShowCode from '../../utils/show-code';
import Description from '../../utils/description';
import { DateEditor } from '../../../src/components/cell-editor';
import { setLocale } from '../../../src/lang';

setLocale('zh-cn');

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

let column1 = {
  key: 'abcd',
  name: 'abcd',
  type: 'date',
  data: {
    format: 'YYYY-MM-DD'
  }
}
let column2 = {
  key: 'abcd',
  name: 'abcd',
  type: 'date',
  data: {
    format: 'YYYY-MM-DD HH:mm'
  }
}

storiesOf('Editors|date-editor', module)
  .addDecorator(withInfo)
  .add('date editor component', () => {
    return (
      <div>
        <h1>Scene One: editor permission is readonly</h1>
        <ShowCode sub={"date editor: no default date value in the date editor"}>
          <DateEditor 
            isReadOnly={true}
            value={''}
            column={column1}
            onCommit={(updated) => action('onCommit')(updated)}
            />
        </ShowCode>
        <ShowCode sub={"date editor: a default date value in the date editor"}>
          <DateEditor 
            isReadOnly={true}
            value={'1992-07-09'}
            column={column1}
            onCommit={(updated) => action('onCommit')(updated)}
          />
        </ShowCode>
        <h1>Scene Two: editor permission is read-write</h1>
        <ShowCode sub={"date editor: no default value in the readonly editor"}>
          <DateEditor 
            value={''}
            column={column1}
            onCommit={(updated) => action('onCommit')(updated)}
            />
        </ShowCode>
        <ShowCode sub={"date editor: provide a default value in the readonly editor"}>
          <DateEditor 
            value={'1992-07-09'}
            column={column1}
            onCommit={(updated) => action('onCommit')(updated)}
          />
        </ShowCode>
        <h1>Scene Three: editor permission is read-write. the lang is 'en'</h1>
        <ShowCode sub={"date editor: no default value in the editor"}>
          <DateEditor 
            value={''}
            column={column1}
            onCommit={(updated) => action('onCommit')(updated)}
            />
        </ShowCode>
        <ShowCode sub={"date editor: a defalut value in the editor"}>
          <DateEditor 
            value={'1992-07-09'}
            column={column1}
            onCommit={(updated) => action('onCommit')(updated)}
          />
        </ShowCode>
        <h1>Scene Three: editor permission is read-write. the  lang is 'zh-cn'</h1>
        <ShowCode sub={"date editor: you can select a time to show"}>
          <DateEditor 
            lang={'zh-cn'}
            value={''}
            column={column2}
            onCommit={(updated) => action('onCommit')(updated)}
            />
        </ShowCode>
        <ShowCode sub={"date editor: you can select a time to show"}>
          <DateEditor 
            lang={'zh-cn'}
            value={'1992-07-09 09:09'}
            column={column2}
            onCommit={(updated) => action('onCommit')(updated)}
          />
        </ShowCode>
      </div>
    )
  }, {info})






