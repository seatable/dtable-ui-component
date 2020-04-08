import React from 'react';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import ShowCode from '../../utils/show-code';
import { TextFormatter } from '../../../src/components/cell-formatter';

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

let value1 = 'How do you like to go up in a swing, 你喜欢荡一趟秋千，'
let value2 = 'Up in the air so blue? 置身于蓝蓝的晴空吗？'
let value3 = '清晨入古寺，初日照高林。曲径通幽处，禅房花木深。'
let value4 = '山光悦鸟性，潭影空人心。万籁此都寂，但余钟磬音。'

storiesOf('CELLS|text-formatter', module)
  .addDecorator(withInfo)
  .add('text component', () => (
    <div>
      <h1>Sample display</h1>
      <ShowCode>
        <TextFormatter value={value1} containerClassName={'text-container'} />
      </ShowCode>
      <ShowCode>
        <TextFormatter value={value2} containerClassName={'text-container'} />
      </ShowCode>
      <ShowCode>
        <TextFormatter value={value3} />
      </ShowCode>
      <ShowCode>
        <TextFormatter value={value4} />
      </ShowCode>
    </div>
  ), {info})
