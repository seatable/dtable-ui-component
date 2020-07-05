import React from 'react';
import PropTypes from 'prop-types';
import cn from 'astro-classname';
import { getFileIconUrl } from '../../utils/utils';

const propTypes = {
  isSample: PropTypes.bool,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  containerClassName: PropTypes.string,
};

class FileFormatter extends React.PureComponent {

  static defaultProps = {
    isSample: false,
    value: [],
    containerClassName: ''
  }

  getFileIconData = (item) => {
    let fileIconUrl = getFileIconUrl(item.name, item.type);
    let fileIconData = require('../../' + fileIconUrl);
    return fileIconData;
  }

  render() {
    let { isSample, value, containerClassName } = this.props;
    let classname = cn('dtable-ui cell-formatter-container file-formatter', containerClassName);
    if (!Array.isArray(value) || value.length === 0) {
      return null;
    }

    if (isSample) {
      let item = value[0];
      return (
        <div className={classname}>
          <img className="file-item-icon" src={this.getFileIconData(item)} alt={item.name} />
          {value.length !== 1 && <span className="file-item-count">{`+${value.length}`}</span>}
        </div>
      );
    }
    
    return (
      <div className={classname}>
        {value.map((item, index) => {
          return (
            <img 
              key={index} 
              className="file-item-icon" 
              src={this.getFileIconData(item)} 
              alt={item.name}
            />
          );
        })}
      </div>
    );
  }
}

FileFormatter.propTypes = propTypes;

export default FileFormatter;
