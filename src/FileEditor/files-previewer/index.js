import React from 'react';
import PropTypes from 'prop-types';
import MediaQuery from 'react-responsive';
import Large from './lg';
import Small from './sm';

import './index.css';

const FilesPreviewer = ({ size, ...props }) => {
  if (size === 'lg') return (<Large { ...props } />);
  if (size === 'sm') return (<Small { ...props } />);

  return (
    <>
      <MediaQuery query="(min-width: 768px)">
        <Large { ...props } />
      </MediaQuery>
      <MediaQuery query="(max-width: 768px)">
        <Small { ...props } />
      </MediaQuery>
    </>
  );
};

FilesPreviewer.propTypes = {
  size: PropTypes.oneOf(['lg', 'sm']),
};

export default FilesPreviewer;
