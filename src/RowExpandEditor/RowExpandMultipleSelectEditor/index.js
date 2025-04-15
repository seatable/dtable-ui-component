import React from 'react';
import MediaQuery from 'react-responsive';
import Large from './lg';
import Small from './sm';

const RowExpandMultipleSelectEditor = (props) => {
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

export default RowExpandMultipleSelectEditor;
