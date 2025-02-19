import React from 'react';
import PropTypes from 'prop-types';
import MediaQuery from 'react-responsive';
import PCCollaboratorEditor from './pc-collaborator-editor';
import MBCollaboratorEditor from './mb-collaborator-editor';

import './index.css';

const CollaboratorEditor = ({ value: oldValue, ...props }) => {
  const value = Array.isArray(oldValue) ? oldValue : [];

  return (
    <>
      <MediaQuery query={'(min-width: 768px)'}>
        <PCCollaboratorEditor { ...props} value={value} />
      </MediaQuery>
      <MediaQuery query={'(max-width: 767.8px)'}>
        <MBCollaboratorEditor { ...props} value={value} />
      </MediaQuery>
    </>
  );
};

CollaboratorEditor.propTypes = {
  isReadOnly: PropTypes.bool,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  column: PropTypes.object,
  collaborators: PropTypes.array.isRequired,
  onCommit: PropTypes.func,
  isShowEditButton: PropTypes.bool,
};

export default CollaboratorEditor;
