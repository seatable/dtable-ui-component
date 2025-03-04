import React from 'react';
import { CellType } from 'dtable-utils';
import BaseFormatterConfig from './base-formatter-config';
import LinkFormatter from '../LinkFormatter';
import FormulaFormatter from '../FormulaFormatter';

const FormatterConfig = {
  ...BaseFormatterConfig,
  [CellType.FORMULA]: <FormulaFormatter />,
  [CellType.LINK]: <LinkFormatter />,
};

export default FormatterConfig;
