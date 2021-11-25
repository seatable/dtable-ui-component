import React from 'react';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import ShowCode from '../../utils/show-code';
import CheckboxFormatter from '../../../src/CheckboxFormatter';

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

storiesOf('CELLS|checkbox-formatter', module)
  .addDecorator(withInfo)
  .add('checkbox component', () => (
    <div>
      <h1>Sample display</h1>
      <ShowCode title={`checkbox: the props value is ''.`}>
        <CheckboxFormatter value={''}  />
      </ShowCode>
      <ShowCode title={`checkbox: the props value is false.`}>
        <CheckboxFormatter value={false}  />
      </ShowCode>
      <ShowCode title={'checkbox: the props value is true'}>
        <CheckboxFormatter value={true}/>
      </ShowCode>
    </div>
  ), {info})
  
