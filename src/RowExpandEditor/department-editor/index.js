import React, { forwardRef } from 'react';
import MediaQuery from 'react-responsive';
import RowExpandPCDepartmentEditor from './pc-editor';
import RowExpandMBDepartmentEditor from './mb-editor';

const RowExpandDepartmentEditor = forwardRef((props, ref) => {
  return (
    <>
      <MediaQuery query="(min-width: 768px)">
        <RowExpandPCDepartmentEditor { ...props } ref={ref} />
      </MediaQuery>
      <MediaQuery query="(max-width: 768px)">
        <RowExpandMBDepartmentEditor { ...props } ref={ref} />
      </MediaQuery>
    </>
  );
});

export default RowExpandDepartmentEditor;
