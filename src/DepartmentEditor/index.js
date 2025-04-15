import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import MediaQuery from 'react-responsive';
import Large from './lg';
import Small from './sm';

const DepartmentEditor = forwardRef(({ size, ...props }, ref) => {
  if (size === 'lg') return (<Large { ...props } ref={ref} />);
  if (size === 'sm') return (<Small { ...props } ref={ref} />);

  return (
    <>
      <MediaQuery query={'(min-width: 768px)'}>
        <Large { ...props} ref={ref} />
      </MediaQuery>
      <MediaQuery query={'(max-width: 767.8px)'}>
        <Small { ...props} ref={ref} />
      </MediaQuery>
    </>
  );
});

DepartmentEditor.propTypes = {
  size: PropTypes.oneOf(['lg', 'sm']),
};

export default DepartmentEditor;
