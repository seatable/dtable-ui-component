import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { Row, Col, UncontrolledTooltip } from 'reactstrap';
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
              <UncontrolledTooltip
                innerClassName="dtable-ui-column-description-tip"
                popperClassName="dtable-ui-row-expand-column-tip"
                target={descriptionRef.current}
                placement="bottom"
                fade={false}
              >
                {description}
              </UncontrolledTooltip>
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
