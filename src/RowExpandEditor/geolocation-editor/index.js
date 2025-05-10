import React, { forwardRef } from 'react';
import MediaQuery from 'react-responsive';
import RowExpandPCGeolocationEditor from './pc-editor';
import RowExpandMBGeolocationEditor from './mb-editor';

const RowExpandGeolocationEditor = forwardRef((props, ref) => {
  return (
    <>
      <MediaQuery query="(min-width: 768px)">
        <RowExpandPCGeolocationEditor { ...props } ref={ref} />
      </MediaQuery>
      <MediaQuery query="(max-width: 768px)">
        <RowExpandMBGeolocationEditor { ...props } ref={ref} />
      </MediaQuery>
    </>
  );
});

export default RowExpandGeolocationEditor;
