import React, { forwardRef } from 'react';
import MediaQuery from 'react-responsive';
import RowExpandPCCollaboratorEditor from './pc-editor';
import RowExpandMBCollaboratorEditor from './mb-editor';

const RowExpandCollaboratorEditor = forwardRef((props, ref) => {
  return (
    <>
      <MediaQuery query="(min-width: 768px)">
        <RowExpandPCCollaboratorEditor { ...props } ref={ref} />
      </MediaQuery>
      <MediaQuery query="(max-width: 768px)">
        <RowExpandMBCollaboratorEditor { ...props } ref={ref} />
      </MediaQuery>
    </>
  );
});

export default RowExpandCollaboratorEditor;
