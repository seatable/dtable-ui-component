import React, { forwardRef } from 'react';
import MediaQuery from 'react-responsive';
import RowExpandPCUrlEditor from './pc-editor';
import RowExpandMBUrlEditor from './mb-editor';

const RowExpandUrlEditor = forwardRef((props, ref) => {
  return (
    <>
      <MediaQuery query="(min-width: 768px)">
        <RowExpandPCUrlEditor { ...props } ref={ref} />
      </MediaQuery>
      <MediaQuery query="(max-width: 768px)">
        <RowExpandMBUrlEditor { ...props } ref={ref} />
      </MediaQuery>
    </>
  );
});

export default RowExpandUrlEditor;
