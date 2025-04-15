import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import MediaQuery from 'react-responsive';
import Large from './lg';
import Small from './sm';

import './index.css';

const CollaboratorEditor = forwardRef(({ value: oldValue, size, ...props }, ref) => {
  const value = Array.isArray(oldValue) ? oldValue : [];

  if (size === 'lg') return (<Large { ...props } value={value} />);
  if (size === 'sm') return (<Small { ...props } value={value} />);

  return (
    <>
      <MediaQuery query={'(min-width: 768px)'}>
        <Large { ...props} value={value} ref={ref} />
      </MediaQuery>
      <MediaQuery query={'(max-width: 767.8px)'}>
        <Small { ...props} value={value} ref={ref} />
      </MediaQuery>
    </>
  );
});

CollaboratorEditor.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  size: PropTypes.oneOf(['lg', 'sm']),
};

export default CollaboratorEditor;
