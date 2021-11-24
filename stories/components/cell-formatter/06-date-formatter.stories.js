import React from 'react';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import ShowCode from '../../utils/show-code';
import { DATE_TYPES } from '../../../src/constants';
import DateFormatter from '../../../src/DateFormatter';

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

storiesOf('CELLS|date-formatter', module)
  .addDecorator(withInfo)
  .add('date component', () => (
    <div>
      <h1>Sample display</h1>
      <ShowCode title={'Default Date type'}>
        <DateFormatter value={'1997-04-09 12:23'}  />
      </ShowCode>
      <ShowCode title={`Date type is ${DATE_TYPES['D/M/YYYY']}`}>
        <DateFormatter value={'1997-04-09 12:23'}  format={DATE_TYPES['D/M/YYYY']}/>
      </ShowCode>
      <ShowCode title={`Date type is ${DATE_TYPES['D/M/YYYY HH:mm']}`}>
        <DateFormatter value={'1997-04-09 12:23'} format={DATE_TYPES['D/M/YYYY HH:mm']}/>
      </ShowCode>
      <ShowCode title={`Date type is ${DATE_TYPES['M/D/YYYY']}`}>
        <DateFormatter value={'1997-04-09 12:23'} format={DATE_TYPES['M/D/YYYY']}/>
      </ShowCode>
      <ShowCode title={`Date type is ${DATE_TYPES['M/D/YYYY HH:mm']}`}>
        <DateFormatter value={'1997-04-09 12:23'} format={DATE_TYPES['M/D/YYYY HH:mm']}/>
      </ShowCode>
      <ShowCode title={`Date type is ${DATE_TYPES['YYYY-MM-DD']}`}>
        <DateFormatter value={'1997-04-09 12:23'} format={DATE_TYPES['YYYY-MM-DD']}/>
      </ShowCode>
      <ShowCode title={`Date type is ${DATE_TYPES['YYYY-MM-DD HH:mm']}`}>
        <DateFormatter value={'1997-04-09 12:23'} format={DATE_TYPES['YYYY-MM-DD HH:mm']}/>
      </ShowCode>
    </div>
  ), {info})
  
