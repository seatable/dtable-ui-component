import React, { forwardRef } from 'react';
import MediaQuery from 'react-responsive';
import RowExpandDialog from '../RowExpandDialog';
import RowExpandView from '../RowExpandView';

const RowExpand = forwardRef((props, ref) => {

  return (
    <>
      <MediaQuery query={'(min-width: 768px)'}>
        <RowExpandDialog { ...props} ref={ref} />
      </MediaQuery>
      <MediaQuery query={'(max-width: 768px)'}>
        <RowExpandView { ...props} ref={ref} />
      </MediaQuery>
    </>
  );
});

export default RowExpand;
