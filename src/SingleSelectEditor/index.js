import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import SelectEditor from '../select-editor';

const SingleSelectEditor = forwardRef(({ value: oldValue, ...props }, ref) => {
  const value = oldValue ? [oldValue] : [];

  return (<SelectEditor { ...props } value={value} ref={ref} />);
});

SingleSelectEditor.propTypes = {
  value: PropTypes.string,
};

export default SingleSelectEditor;
