import React from 'react';
import MediaQuery from 'react-responsive';
import RowExpandPCDepartmentFormatter from './pc-formatter';
import RowExpandMBDepartmentFormatter from './mb-formatter';

const RowExpandDepartmentFormatter = (props) => {

  return (
    <>
      <MediaQuery query={'(min-width: 768px)'}>
        <RowExpandPCDepartmentFormatter { ...props} />
      </MediaQuery>
      <MediaQuery query={'(max-width: 768px)'}>
        <RowExpandMBDepartmentFormatter { ...props} />
      </MediaQuery>
    </>
  );
};

export default RowExpandDepartmentFormatter;
