import React from 'react';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import { action } from '@storybook/addon-actions';
import ShowCode from '../../utils/show-code';
import Description from '../../utils/description';
import { NUMBER_TYPES } from '../../../src/constants';
import NumberEditor from '../../../src/NumberEditor';

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

const value1_1 = 12345;
const column1_1 = {
  key: '0000',
  type: NUMBER_TYPES.NUMBER,
  name: 'number',
  data: {
    format: NUMBER_TYPES.NUMBER
  }
};

const column1_2 = {
  key: '0000',
  type: NUMBER_TYPES.NUMBER_WITH_COMMAS,
  name: 'number_with_commas',
  data: {
    format: NUMBER_TYPES.NUMBER_WITH_COMMAS
  }
};

const column1_3 = {
  key: '0000',
  type: NUMBER_TYPES.DOLLAR,
  name: 'dollar',
  data: {
    format: NUMBER_TYPES.DOLLAR
  }
};

const column1_4 = {
  key: '0000',
  type: NUMBER_TYPES.EURO,
  name: 'euro',
  data: {
    format: NUMBER_TYPES.EURO
  }
};

const column1_5 = {
  key: '0000',
  type: NUMBER_TYPES.YUAN,
  name: 'yuan',
  data: {
    format: NUMBER_TYPES.YUAN
  }
};

const column1_6 = {
  key: '0000',
  type: NUMBER_TYPES.PERCENT,
  name: 'percent',
  data: {
    format: NUMBER_TYPES.PERCENT
  }
};

const value2_1 = 78222;
const column2_1 = {
  key: '0000',
  type: NUMBER_TYPES.NUMBER,
  name: 'number',
  data: {
    format: NUMBER_TYPES.NUMBER
  }
};

const column2_2 = {
  key: '0000',
  type: NUMBER_TYPES.NUMBER_WITH_COMMAS,
  name: 'number_with_commas',
  data: {
    format: NUMBER_TYPES.NUMBER_WITH_COMMAS
  }
};

const column2_3 = {
  key: '0000',
  type: NUMBER_TYPES.DOLLAR,
  name: 'dollar',
  data: {
    format: NUMBER_TYPES.DOLLAR
  }
};

const column2_4 = {
  key: '0000',
  type: NUMBER_TYPES.EURO,
  name: 'euro',
  data: {
    format: NUMBER_TYPES.EURO
  }
};

const column2_5 = {
  key: '0000',
  type: NUMBER_TYPES.YUAN,
  name: 'yuan',
  data: {
    format: NUMBER_TYPES.YUAN
  }
};

const column2_6 = {
  key: '0000',
  type: NUMBER_TYPES.PERCENT,
  name: 'percent',
  data: {
    format: NUMBER_TYPES.PERCENT
  }
};



storiesOf('Editors|number-editor', module)
  .addDecorator(withInfo)
  .add('number editor component', () => {
    return (
      <div>
        <h1>Scene One: editor permission is readonly</h1>
        <ShowCode sub={"number format: 'NUMBER' "}>
          <NumberEditor 
            isReadOnly={true}
            value={value1_1} 
            column={column1_1}
            onCommit={(updated) => action('onCommit')(updated)}
          />
        </ShowCode>
        <ShowCode sub={"number format: 'NUMBER_WITH_COMMAS' "}>
          <NumberEditor 
            isReadOnly={true}
            value={value1_1} 
            column={column1_2}
            onCommit={(updated) => action('onCommit')(updated)}
          />
        </ShowCode>
        <ShowCode sub={"number format: 'DOLLAR' "}>
          <NumberEditor 
            isReadOnly={true}
            value={value1_1} 
            column={column1_3}
            onCommit={(updated) => action('onCommit')(updated)}
          />
        </ShowCode>
        <ShowCode sub={"number format: 'EURO' "}>
          <NumberEditor 
            isReadOnly={true}
            value={value1_1} 
            column={column1_4}
            onCommit={(updated) => action('onCommit')(updated)}
          />
        </ShowCode>
        <ShowCode sub={"number format: 'YUAN' "}>
          <NumberEditor 
            isReadOnly={true}
            value={value1_1} 
            column={column1_5}
            onCommit={(updated) => action('onCommit')(updated)}
          />
        </ShowCode>
        <ShowCode sub={"number format: 'PERCENT' "}>
          <NumberEditor 
            isReadOnly={true}
            value={value1_1} 
            column={column1_6}
            onCommit={(updated) => action('onCommit')(updated)}
          />
        </ShowCode>
        <h1>Scene One: editor permission is read and write</h1>
        <ShowCode sub={"number format: 'NUMBER' "}>
          <NumberEditor 
            isReadOnly={false}
            value={value2_1} 
            column={column2_1}
            onCommit={(updated) => action('onCommit')(updated)}
          />
        </ShowCode>
        <ShowCode sub={"number format: 'NUMBER_WITH_COMMAS' "}>
          <NumberEditor 
            isReadOnly={false}
            value={value2_1} 
            column={column2_2}
            onCommit={(updated) => action('onCommit')(updated)}
          />
        </ShowCode>
        <ShowCode sub={"number format: 'DOLLAR' "}>
          <NumberEditor 
            isReadOnly={false}
            value={value2_1} 
            column={column2_3}
            onCommit={(updated) => action('onCommit')(updated)}
          />
        </ShowCode>
        <ShowCode sub={"number format: 'EURO' "}>
          <NumberEditor 
            isReadOnly={false}
            value={value2_1} 
            column={column2_4}
            onCommit={(updated) => action('onCommit')(updated)}
          />
        </ShowCode>
        <ShowCode sub={"number format: 'YUAN' "}>
          <NumberEditor 
            isReadOnly={false}
            value={value2_1} 
            column={column2_5}
            onCommit={(updated) => action('onCommit')(updated)}
          />
        </ShowCode>
        <ShowCode sub={"number format: 'PERCENT' "}>
          <NumberEditor 
            isReadOnly={false}
            value={value2_1} 
            column={column2_6}
            onCommit={(updated) => action('onCommit')(updated)}
          />
        </ShowCode>
      </div>
    )
  }, {info})






