import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import MediaQuery from 'react-responsive';
import PCFileEditor from './pc-editor';
import MBFileEditor from './mb-editor';

import './index.css';

const FileEditor = forwardRef(({ isMobile, ...props }, ref) => {
  if (isMobile === false) return (<PCFileEditor { ...props } ref={ref} />);
  if (isMobile === true) return (<MBFileEditor { ...props } ref={ref} />);

  return (
    <>
      <MediaQuery query="(min-width: 768px)">
        <PCFileEditor { ...props } ref={ref} />
      </MediaQuery>
      <MediaQuery query="(max-width: 768px)">
        <MBFileEditor { ...props } ref={ref} />
      </MediaQuery>
    </>
  );
});

FileEditor.propTypes = {
  isMobile: PropTypes.bool,
};

export default FileEditor;
