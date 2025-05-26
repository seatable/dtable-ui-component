import React, { forwardRef } from 'react';
import MediaQuery from 'react-responsive';
import RowExpandPCTextEditor from './pc-editor';
import RowExpandMBTextEditor from './mb-editor';

const RowExpandTextEditor = forwardRef((props, ref) => {
  return (
    <>
      <MediaQuery query="(min-width: 768px)">
        <RowExpandPCTextEditor { ...props } ref={ref} />
      </MediaQuery>
      <MediaQuery query="(max-width: 768px)">
        <RowExpandMBTextEditor { ...props } ref={ref} />
      </MediaQuery>
    </>
  );
});

export default RowExpandTextEditor;
