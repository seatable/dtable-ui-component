import React from 'react';
import PropTypes from 'prop-types';
import MediaQuery from 'react-responsive';
import { PCSelectEditor, MBSelectEditor } from '../select-editor';

const SingleSelectEditor = ({ value: oldValue, ...props }) => {
  const value = oldValue ? [oldValue] : [];

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

SingleSelectEditor.propTypes = {
  value: PropTypes.string,
};

export default SingleSelectEditor;
