import React, { forwardRef } from 'react';
import MediaQuery from 'react-responsive';
import RowExpandPCLongTextEditor from './pc-editor';
import RowExpandMBLongTextEditor from './mb-editor';

const RowExpandLongTextEditor = forwardRef((props, ref) => {
  return (
    <>
      <MediaQuery query="(min-width: 768px)">
        <RowExpandPCLongTextEditor { ...props } ref={ref} />
      </MediaQuery>
      <MediaQuery query="(max-width: 768px)">
        <RowExpandMBLongTextEditor { ...props } ref={ref} />
      </MediaQuery>
    </>
  );
});

export default RowExpandLongTextEditor;
