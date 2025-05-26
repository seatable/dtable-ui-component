import React, { forwardRef } from 'react';
import MediaQuery from 'react-responsive';
import RowExpandPCImageEditor from './pc-editor';
import RowExpandMBImageEditor from './mb-editor';

const RowExpandImageEditor = forwardRef((props, ref) => {
  return (
    <>
      <MediaQuery query="(min-width: 768px)">
        <RowExpandPCImageEditor { ...props } ref={ref} />
      </MediaQuery>
      <MediaQuery query="(max-width: 768px)">
        <RowExpandMBImageEditor { ...props } ref={ref} />
      </MediaQuery>
    </>
  );
});

export default RowExpandImageEditor;
