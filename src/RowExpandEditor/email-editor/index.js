import React, { forwardRef } from 'react';
import MediaQuery from 'react-responsive';
import RowExpandPCEmailEditor from './pc-editor';
import RowExpandMBEmailEditor from './mb-editor';

const RowExpandEmailEditor = forwardRef((props, ref) => {
  return (
    <>
      <MediaQuery query="(min-width: 768px)">
        <RowExpandPCEmailEditor { ...props } ref={ref} />
      </MediaQuery>
      <MediaQuery query="(max-width: 768px)">
        <RowExpandMBEmailEditor { ...props } ref={ref} />
      </MediaQuery>
    </>
  );
});

export default RowExpandEmailEditor;
