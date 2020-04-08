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

const value1_1 = [
  {name: '123.png', type: 'file', url: 'abde'}
];

const value1_2 = [
  {name: '123.png', type: 'file', url: 'abde'},
  {name: 'anc.jpg', type: 'file', url: 'abde'},
  {name: 'nke.text', type: 'file', url: 'abde'}
];

const value2_1 = [
  {name: '123.png', type: 'file', url: 'abde'},
];

const value2_2 = [
  {name: '123.png', type: 'file', url: 'abde'},
  {name: 'anc.jpg', type: 'file', url: 'abde'},
  {name: 'nke.text', type: 'file', url: 'abde'},
  {name: 'nke.md', type: 'file', url: 'abde'}
];

storiesOf('CELLS|file-formatter', module)
  .addDecorator(withInfo)
  .add('file component', () => (
    <div>
      <h1>Sample display</h1>
      <ShowCode title={`file-formmater: the demo will show sample file formatter with one file.`}>
        <FileFormatter value={value1_1}  isSample={true}/>
      </ShowCode>
      <ShowCode title={`file-formmater: the demo will show sample file formatter with more files.`}>
        <FileFormatter value={value1_2}  isSample={true}/>
      </ShowCode>
      <ShowCode title={`file-formmater: the demo will show complex file formatter with one file.`}>
        <FileFormatter value={value2_1}  />
      </ShowCode>
      <ShowCode title={`file-formmater: the demo will show complex file formatter with more files.`}>
        <FileFormatter value={value2_2} />
      </ShowCode>
    </div>
  ), {info})
  