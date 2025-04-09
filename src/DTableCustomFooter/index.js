import React from 'react';
import './index.css';

// DTableCustomFooter is used in geolocation editor and digital sign editor
const DTableCustomFooter = ({ children }) => {
  return (
    <div className='dtable-custom-footer'>
      {children}
    </div>
  );
};

export default DTableCustomFooter;
