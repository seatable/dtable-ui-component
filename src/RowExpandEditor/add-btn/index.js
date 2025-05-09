import React, { forwardRef } from 'react';
import MediaQuery from 'react-responsive';
import RowExpandPCAddBtn from './pc-add-btn';
import RowExpandMBAddBtn from './mb-add-btn';

const RowExpandAddBtn = forwardRef((props, ref) => {
  return (
    <>
      <MediaQuery query="(min-width: 768px)">
        <RowExpandPCAddBtn { ...props } ref={ref} />
      </MediaQuery>
      <MediaQuery query="(max-width: 768px)">
        <RowExpandMBAddBtn { ...props } ref={ref} />
      </MediaQuery>
    </>
  );
});

export default RowExpandAddBtn;
