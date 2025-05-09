import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import MediaQuery from 'react-responsive';
import PCFilesPreviewer from './pc-previewer';
import MBFilesPreviewer from './mb-previewer';

import './index.css';

const FilesPreviewer = forwardRef(({ isMobile, ...props }, ref) => {
  if (isMobile === false) return (<PCFilesPreviewer { ...props } ref={ref} />);
  if (isMobile === true) return (<MBFilesPreviewer { ...props } ref={ref} />);

  return (
    <>
      <MediaQuery query="(min-width: 768px)">
        <PCFilesPreviewer { ...props } ref={ref} />
      </MediaQuery>
      <MediaQuery query="(max-width: 768px)">
        <MBFilesPreviewer { ...props } ref={ref} />
      </MediaQuery>
    </>
  );
});

FilesPreviewer.propTypes = {
  isMobile: PropTypes.bool,
};

export default FilesPreviewer;
