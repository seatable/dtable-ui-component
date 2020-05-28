import React from 'react';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import ShowCode from '../../utils/show-code';
import { FormulaFormatter } from '../../../src/components/cell-formatter';

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

const value1 = 123344;
const value2 = 'abcdeale';
const value3 = '1992-07-09 12:24';
const value4 = true;

storiesOf('CELLS|formula-formatter', module)
  .addDecorator(withInfo)
  .add('formula component', () => (
    <div>
      <h1>Sample display</h1>
      <ShowCode title={'the fomula result is a number value'}>
        <FormulaFormatter value={value1} resultType={'number'} containerClassName={'formula-container'} />
      </ShowCode>
      <ShowCode title={'the fomula result is a string value'}>
        <FormulaFormatter value={value2} resultType={'string'} containerClassName={'formula-container'} />
      </ShowCode>
      <ShowCode title={'the fomula result is a date value'}>
        <FormulaFormatter value={value3} resultType={'date'} containerClassName={'formula-container'} />
      </ShowCode>
      <ShowCode title={'the fomula result is a bool value'}>
        <FormulaFormatter value={value4} resultType="bool" containerClassName={'formula-container'} />
      </ShowCode>
    </div>
  ), {info})
