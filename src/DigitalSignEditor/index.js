import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import MediaQuery from 'react-responsive';
import PCDigitalSignEditor from './pc-editor';
import MBDigitalSignEditor from './mb-editor';

const DigitalSignEditor = forwardRef(({ isMobile, ...props }, ref) => {
  if (isMobile === false) return (<PCDigitalSignEditor { ...props } ref={ref} />);
  if (isMobile === true) return (<MBDigitalSignEditor { ...props } ref={ref} />);

  return (
    <>
      <MediaQuery query="(min-width: 768px)">
        <PCDigitalSignEditor { ...props } ref={ref} />
      </MediaQuery>
      <MediaQuery query="(max-width: 768px)">
        <MBDigitalSignEditor { ...props } ref={ref} />
      </MediaQuery>
    </>
  );
});

DigitalSignEditor.propTypes = {
  isMobile: PropTypes.bool,
};

export default DigitalSignEditor;

