import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import MediaQuery from 'react-responsive';
import Large from './lg';
import Small from './sm';

import './index.css';

const CheckboxEditor = forwardRef(({ size, ...props }, ref) => {
  if (size === 'lg') return (<Large { ...props } />);
  if (size === 'sm') return (<Small { ...props } />);

  return (
    <>
      <MediaQuery query="(min-width: 768px)">
        <Large { ...props } ref={ref} />
      </MediaQuery>
      <MediaQuery query="(max-width: 768px)">
        <Small { ...props } ref={ref} />
      </MediaQuery>
    </>
  );
});

CheckboxEditor.propTypes = {
  size: PropTypes.oneOf(['lg', 'sm']),
};

export default CheckboxEditor;
