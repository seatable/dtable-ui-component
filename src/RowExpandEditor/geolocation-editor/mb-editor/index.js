import React from 'react';
import PropTypes from 'prop-types';
import { isEmptyObject, getGeolocationDisplayString } from 'dtable-utils';
import RowExpandAddBtn from '../../add-btn';
import { getLocale } from '../../../lang';
import GeolocationEditor from '../../../GeolocationEditor';

class RowExpandMBGeolocationEditor extends React.Component {

  constructor(props) {
    super(props);
    const { row, column, valueKey } = props;
    this.state = {
      isShowEditor: false,
      value: row[column[valueKey]] || {}
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { column, row, valueKey } = nextProps;
    if (row._id !== this.props.row._id) {
      this.setState({
        value: row[column[valueKey]] || {},
        isShowEditor: false
      });
    }
  }

  openEditor = () => {
    this.setState({ isShowEditor: true });
  };

  closeEditor = () => {
    this.setState({ isShowEditor: false });
  };

  onCommit = (value) => {
    this.setState({ value });
    this.props.onCommit(value);
  };

  getLocationInfo = (value) => {
    const { column, config } = this.props;
    const { dtableBaiduMapKey, dtableMineMapKey } = config;
    const isBaiduMap = !!(dtableBaiduMapKey || dtableMineMapKey);
    return getGeolocationDisplayString(value, column.data, { isBaiduMap, hyphen: ' ' });
  };

  renderGeoLocation = () => {
    const { value } = this.state;
    const text = isEmptyObject(value) ? getLocale('Edit_Location') : this.getLocationInfo(value);
    return (
      <RowExpandAddBtn onClick={this.openEditor} text={text} className="py-4" />
    );
  };

  render() {
    const { column, row, config } = this.props;
    const { value } = this.state;
    return (
      <>
        {this.renderGeoLocation()}
        {this.state.isShowEditor && (
          <GeolocationEditor
            column={column}
            row={row}
            value={value}
            config={config}
            onCommit={this.onCommit}
            onToggle={this.closeEditor}
          />
        )}
      </>
    );
  }
}

RowExpandMBGeolocationEditor.propTypes = {
  column: PropTypes.object,
  row: PropTypes.object,
  onCommit: PropTypes.func,
};

export default RowExpandMBGeolocationEditor;
