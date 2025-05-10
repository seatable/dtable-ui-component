import React, { forwardRef } from 'react';
import MediaQuery from 'react-responsive';
import RowExpandPCRateEditor from './pc-editor';
import RowExpandMBRateEditor from './mb-editor';

import './index.css';

const RowExpandRateEditor = forwardRef((props, ref) => {
  return (
    <>
      <MediaQuery query="(min-width: 768px)">
        <RowExpandPCRateEditor { ...props } ref={ref} />
      </MediaQuery>
      <MediaQuery query="(max-width: 768px)">
        <RowExpandMBRateEditor { ...props } ref={ref} />
      </MediaQuery>
    </>
  );
});

export default RowExpandRateEditor;
