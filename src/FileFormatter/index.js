import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import FileItemFormatter from '../FileItemFormatter';

import './index.css';

export default class FileFormatter extends React.PureComponent {

  static propTypes = {
    isSample: PropTypes.bool,
    value: PropTypes.array,
    containerClassName: PropTypes.string,
    renderItem: PropTypes.func,
  };

  static defaultProps = {
    isSample: false,
    value: [],
    containerClassName: ''
  };

  render() {
    let { isSample, value, containerClassName, renderItem } = this.props;
    if (!Array.isArray(value) || value.length === 0) {
      return null;
    }

    let className = classnames('dtable-ui cell-formatter-container file-formatter', containerClassName);

    if (isSample) {
      let item = value[0];
      return (
        <div className={className}>
          <FileItemFormatter file={item}/>
          {value.length !== 1 && <span className="file-item-count">{`+${value.length}`}</span>}
        </div>
      );
    }

    return (
      <div className={className}>
        {value.map((item, index) => {
          const dom = (<FileItemFormatter file={item} />);
          if (renderItem) return (<Fragment key={index}>{renderItem(dom)}</Fragment>);
          return (<Fragment key={index}>{dom}</Fragment>);
        })}
      </div>
    );
  }
}
