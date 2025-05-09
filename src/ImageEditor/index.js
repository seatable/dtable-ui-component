import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import MediaQuery from 'react-responsive';
import PCImageEditor from './pc-editor';
import MBImageEditor from './mb-editor';

import './index.css';

const ImageEditor = forwardRef(({ isMobile, ...props }, ref) => {
  if (isMobile === false) return (<PCImageEditor { ...props } ref={ref} />);
  if (isMobile === true) return (<MBImageEditor { ...props } ref={ref} />);

  return (
    <>
      <MediaQuery query="(min-width: 768px)">
        <PCImageEditor { ...props } ref={ref} />
      </MediaQuery>
      <MediaQuery query="(max-width: 768px)">
        <MBImageEditor { ...props } ref={ref} />
      </MediaQuery>
    </>
  );
});

ImageEditor.propTypes = {
  isMobile: PropTypes.bool,
};

export default ImageEditor;
