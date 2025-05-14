import React, { forwardRef } from 'react';
import MediaQuery from 'react-responsive';
import RowExpandPCSingleSelectEditor from './pc-editor';
import RowExpandMBSingleSelectEditor from './mb-editor';

const RowExpandSingleSelectEditor = forwardRef((props, ref) => {
  return (
    <>
      <MediaQuery query="(min-width: 768px)">
        <RowExpandPCSingleSelectEditor { ...props } ref={ref} />
      </MediaQuery>
      <MediaQuery query="(max-width: 768px)">
        <RowExpandMBSingleSelectEditor { ...props } ref={ref} />
      </MediaQuery>
    </>
  );
});

export default RowExpandSingleSelectEditor;
