import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'reactstrap';
import DTableToolTip from '../../DTableToolTip';
import DTableColumnIcon from '../../DTableColumnIcon';

import './index.css';

const ColumnContent = ({ column, children }) => {
  const descriptionRef = useRef(null);
  const { name, key, description } = column;
  return (
    <Row className="dtable-ui-row-expand-column-content pb-4">
      <Col md={3} className="dtable-ui-row-expand-column-content-info d-flex">
        <span className="dtable-ui-header-icon" id={`header-icon-${key}`}>
          <DTableColumnIcon column={column} />
        </span>
        <span className="dtable-ui-row-expand-column-name">{name || ''}</span>
        {description &&
          <>
            <span
              className="dtable-font dtable-icon-description dtable-ui-column-tip-icon ml-2"
              ref={descriptionRef}
            >
            </span>
            {descriptionRef.current && (
              <DTableToolTip target={descriptionRef.current} placement="bottom" >
                {description}
              </DTableToolTip>
            )}
          </>
        }
      </Col>
      <Col md={9} className="d-flex align-items-center dtable-ui-row-expand-column-content-value">{children}</Col>
    </Row>
  );
};

ColumnContent.propTypes = {
  column: PropTypes.object,
  children: PropTypes.any,
};

export default ColumnContent;
