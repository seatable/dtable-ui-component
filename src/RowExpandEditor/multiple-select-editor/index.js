import React, { forwardRef } from 'react';
import MediaQuery from 'react-responsive';
import RowExpandPCMultipleSelectEditor from './pc-editor';
import RowExpandMBMultipleSelectEditor from './mb-editor';

const RowExpandMultipleSelectEditor = forwardRef((props, ref) => {
  return (
    <>
      <MediaQuery query="(min-width: 768px)">
        <RowExpandPCMultipleSelectEditor { ...props } ref={ref} />
      </MediaQuery>
      <MediaQuery query="(max-width: 768px)">
        <RowExpandMBMultipleSelectEditor { ...props } ref={ref} />
      </MediaQuery>
    </>
  );
});

export default RowExpandMultipleSelectEditor;
