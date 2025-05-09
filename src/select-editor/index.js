import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import MediaQuery from 'react-responsive';
import PCSelectEditor from './pc-editor';
import MBSelectEditor from './mb-editor';

const SelectEditor = forwardRef(({ isMobile, ...props }, ref) => {
  if (isMobile === false) return (<PCSelectEditor { ...props } ref={ref} />);
  if (isMobile === true) return (<MBSelectEditor { ...props } ref={ref} />);

  return (
    <>
      <MediaQuery query="(min-width: 768px)">
        <PCSelectEditor { ...props } ref={ref} />
      </MediaQuery>
      <MediaQuery query="(max-width: 768px)">
        <MBSelectEditor { ...props } ref={ref} />
      </MediaQuery>
    </>
  );
});

SelectEditor.propTypes = {
  isMobile: PropTypes.bool,
};

export default SelectEditor;
