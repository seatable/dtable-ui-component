import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import MediaQuery from 'react-responsive';
import PCDepartmentSingleSelectEditor from './pc-editor';
import MBDepartmentSingleSelectEditor from './mb-editor';

const DepartmentSingleSelectEditor = forwardRef(({ isMobile, ...props }, ref) => {
  if (isMobile === false) return (<PCDepartmentSingleSelectEditor { ...props } ref={ref} />);
  if (isMobile === true) return (<MBDepartmentSingleSelectEditor { ...props } ref={ref} />);

  return (
    <>
      <MediaQuery query={'(min-width: 768px)'}>
        <PCDepartmentSingleSelectEditor { ...props} ref={ref} />
      </MediaQuery>
      <MediaQuery query={'(max-width: 768px)'}>
        <MBDepartmentSingleSelectEditor { ...props} ref={ref} />
      </MediaQuery>
    </>
  );
});

DepartmentSingleSelectEditor.propTypes = {
  isMobile: PropTypes.bool,
};

export default DepartmentSingleSelectEditor;
