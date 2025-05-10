import React, { forwardRef } from 'react';
import MediaQuery from 'react-responsive';
import RowExpandPCDigitalSignEditor from './pc-editor';
import RowExpandMBDigitalSignEditor from './mb-editor';

const RowExpandDigitalSignEditor = forwardRef((props, ref) => {
  return (
    <>
      <MediaQuery query="(min-width: 768px)">
        <RowExpandPCDigitalSignEditor { ...props } ref={ref} />
      </MediaQuery>
      <MediaQuery query="(max-width: 768px)">
        <RowExpandMBDigitalSignEditor { ...props } ref={ref} />
      </MediaQuery>
    </>
  );
});

export default RowExpandDigitalSignEditor;
