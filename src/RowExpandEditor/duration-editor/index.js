import React, { forwardRef } from 'react';
import MediaQuery from 'react-responsive';
import RowExpandPCDurationEditor from './pc-editor';
import RowExpandMBDurationEditor from './mb-editor';

const RowExpandDurationEditor = forwardRef((props, ref) => {
  return (
    <>
      <MediaQuery query="(min-width: 768px)">
        <RowExpandPCDurationEditor { ...props } ref={ref} />
      </MediaQuery>
      <MediaQuery query="(max-width: 768px)">
        <RowExpandMBDurationEditor { ...props } ref={ref} />
      </MediaQuery>
    </>
  );
});

export default RowExpandDurationEditor;
