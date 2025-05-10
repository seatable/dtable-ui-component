import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import SelectEditor from '../select-editor';

const MultipleSelectEditor = forwardRef(({ value: oldValue, ...props }, ref) => {
  const value = oldValue ? Array.isArray(oldValue) ? oldValue : [oldValue] : [];

  return (<SelectEditor { ...props } value={value} ref={ref} />);
});

MultipleSelectEditor.propTypes = {
  value: PropTypes.array,
};

export default MultipleSelectEditor;

