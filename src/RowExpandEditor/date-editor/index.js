import React, { forwardRef } from 'react';
import MediaQuery from 'react-responsive';
import RowExpandPCDateEditor from './pc-editor';
import RowExpandMBDateEditor from './mb-editor';

const RowExpandDateEditor = forwardRef((props, ref) => {
  return (
    <>
      <MediaQuery query="(min-width: 768px)">
        <RowExpandPCDateEditor { ...props } ref={ref} />
      </MediaQuery>
      <MediaQuery query="(max-width: 768px)">
        <RowExpandMBDateEditor { ...props } ref={ref} />
      </MediaQuery>
    </>
  );
});

export default RowExpandDateEditor;
