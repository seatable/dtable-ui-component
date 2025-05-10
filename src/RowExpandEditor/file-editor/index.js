import React, { forwardRef } from 'react';
import MediaQuery from 'react-responsive';
import RowExpandPCFileEditor from './pc-editor';
import RowExpandMBFileEditor from './mb-editor';

const RowExpandFileEditor = forwardRef((props, ref) => {
  return (
    <>
      <MediaQuery query="(min-width: 768px)">
        <RowExpandPCFileEditor { ...props } ref={ref} />
      </MediaQuery>
      <MediaQuery query="(max-width: 768px)">
        <RowExpandMBFileEditor { ...props } ref={ref} />
      </MediaQuery>
    </>
  );
});

export default RowExpandFileEditor;
