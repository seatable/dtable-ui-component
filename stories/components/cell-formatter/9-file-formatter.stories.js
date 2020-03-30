import React from 'react';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import ShowCode from '../../utils/show-code';
import { FileFormatter } from '../../../src/components/cell-formatter';

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

const value1 = [
  {name: '123.png', type: 'file', url: 'abde'}
];

const value2 = [
  {name: '123.png', type: 'file', url: 'abde'},
  {name: 'anc.jpg', type: 'file', url: 'abde'},
  {name: 'nke.text', type: 'file', url: 'abde'}
]

storiesOf('CELLS|file-formatter', module)
  .addDecorator(withInfo)
  .add('file component', () => (
    <div>
      <h1>Sample display</h1>
      <ShowCode title={`file-formmater: the demo will be show only one file's icon in the formatter.`}>
        <FileFormatter value={value1}  />
      </ShowCode>
      <ShowCode title={`file-formmater: the demo will show sample file formatter.`}>
        <FileFormatter value={value2}  isSample={true}/>
      </ShowCode>
      <ShowCode title={`file-formmater: the demo will show complex file formatter.`}>
        <FileFormatter value={value2} />
      </ShowCode>
    </div>
  ), {info})
  