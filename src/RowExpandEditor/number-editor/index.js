import React, { forwardRef } from 'react';
import MediaQuery from 'react-responsive';
import RowExpandPCNumberEditor from './pc-editor';
import RowExpandMBNumberEditor from './mb-editor';

const RowExpandNumberEditor = forwardRef((props, ref) => {
  return (
    <>
      <MediaQuery query="(min-width: 768px)">
        <RowExpandPCNumberEditor { ...props } ref={ref} />
      </MediaQuery>
      <MediaQuery query="(max-width: 768px)">
        <RowExpandMBNumberEditor { ...props } ref={ref} />
      </MediaQuery>
    </>
  );
});

export default RowExpandNumberEditor;
