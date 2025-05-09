import React, { forwardRef } from 'react';
import MediaQuery from 'react-responsive';
import RowExpandPCCheckboxEditor from './pc-editor';
import RowExpandMBCheckboxEditor from './mb-editor';

import './index.css';

const RowExpandCheckboxEditor = forwardRef((props, ref) => {
  return (
    <>
      <MediaQuery query="(min-width: 768px)">
        <RowExpandPCCheckboxEditor { ...props } ref={ref} />
      </MediaQuery>
      <MediaQuery query="(max-width: 768px)">
        <RowExpandMBCheckboxEditor { ...props } ref={ref} />
      </MediaQuery>
    </>
  );
});

export default RowExpandCheckboxEditor;
