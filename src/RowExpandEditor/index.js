import React from 'react';
import PropTypes from 'prop-types';
import { CELL_EDITOR_MAP } from './constants';

const RowExpandEditor = ({ column, component, ...props }) => {
  const components = { ...CELL_EDITOR_MAP, ...component };
  const Editor = components[column.type];
  if (!Editor) return null;
  const { row, valueKey } = props;
  const value = row[column[valueKey]];
  return (<Editor { ...props } value={value} column={column} />);
};

RowExpandEditor.propTypes = {
  column: PropTypes.object.isRequired,
  component: PropTypes.object,
};

export default RowExpandEditor;
