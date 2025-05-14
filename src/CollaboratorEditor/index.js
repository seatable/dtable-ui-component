import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import MediaQuery from 'react-responsive';
import PCCollaboratorEditor from './pc-editor';
import MBCollaboratorEditor from './mb-editor';

import './index.css';

const CollaboratorEditor = forwardRef(({ isMobile, value: oldValue, ...props }, ref) => {
  const value = Array.isArray(oldValue) ? oldValue : [];
  if (isMobile === false) return (<PCCollaboratorEditor { ...props } value={value} ref={ref} />);
  if (isMobile === true) return (<MBCollaboratorEditor { ...props } value={value} ref={ref} />);

  return (
    <>
      <MediaQuery query="(min-width: 768px)">
        <PCCollaboratorEditor { ...props } value={value} ref={ref} />
      </MediaQuery>
      <MediaQuery query="(max-width: 768px)">
        <MBCollaboratorEditor { ...props } value={value} ref={ref} />
      </MediaQuery>
    </>
  );
});

CollaboratorEditor.propTypes = {
  isMobile: PropTypes.bool,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
};

export default CollaboratorEditor;
