import React from 'react';
import PropTypes from 'prop-types';
import MediaQuery from 'react-responsive';
import { PCSelectEditor, MBSelectEditor } from '../select-editor';

const MultipleSelectEditor = ({ value: oldValue, ...props }) => {
  const value = oldValue ? Array.isArray(oldValue) ? oldValue : [oldValue] : [];

  return (
    <>
      <MediaQuery query="(min-width: 768px)">
        <PCSelectEditor { ...props } value={value} />
      </MediaQuery>
      <MediaQuery query="(max-width: 767.8px)">
        <MBSelectEditor { ...props } value={value} />
      </MediaQuery>
    </>
  );
};

MultipleSelectEditor.propTypes = {
  value: PropTypes.array,
};

export default MultipleSelectEditor;
