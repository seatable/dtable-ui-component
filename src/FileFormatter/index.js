import React from 'react';
import PropTypes from 'prop-types';
import cn from 'astro-classname';
import FileItemFormatter from '../FileItemFormatter';

import './index.css';

export default class FileFormatter extends React.PureComponent {

  static propTypes = {
    isSample: PropTypes.bool,
    value: PropTypes.array,
    containerClassName: PropTypes.string,
  };

  static defaultProps = {
    isSample: false,
    value: [],
    containerClassName: ''
  }

  render() {
    let { isSample, value, containerClassName } = this.props;
    if (!Array.isArray(value) || value.length === 0) {
      return null;
    }

    let className = cn('dtable-ui cell-formatter-container file-formatter', containerClassName);

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
          return (
            <FileItemFormatter file={item} key={index} />
          );
        })}
      </div>
    );
  }
}
