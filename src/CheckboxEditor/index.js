import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import MediaQuery from 'react-responsive';
import PCCheckboxEditor from './pc-editor';
import MBCheckboxEditor from './mb-editor';

import './index.css';

const CheckboxEditor = forwardRef(({ isMobile, ...props }, ref) => {
  if (isMobile === false) return (<PCCheckboxEditor { ...props } ref={ref} />);
  if (isMobile === true) return (<MBCheckboxEditor { ...props } ref={ref} />);

  return (
    <>
      <MediaQuery query="(min-width: 768px)">
        <PCCheckboxEditor { ...props } ref={ref} />
      </MediaQuery>
      <MediaQuery query="(max-width: 768px)">
        <MBCheckboxEditor { ...props } ref={ref} />
      </MediaQuery>
    </>
  );
});

CheckboxEditor.propTypes = {
  isMobile: PropTypes.bool,
};

export default CheckboxEditor;
