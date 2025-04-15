import React from 'react';
import PropTypes from 'prop-types';
import { getDateDisplayString } from 'dtable-utils';
import DateEditor from '../../DateEditor';
import RightAngle from '../RightAngle';
import { getDateColumnFormat } from '../../utils/column-utils';

class Small extends React.Component {

  constructor(props) {
    super(props);
    const { column, row, valueKey } = props;
    this.state = {
      isShowEditor: false,
      value: row[column[valueKey]],
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { column, row, valueKey } = nextProps;
    if (row._id !== this.props.row._id) {
      this.setState({ value: row[column[valueKey]], isShowEditor: false });
    }
  }

  hideCalendar = () => {
    this.setState({ isShowEditor: false });
  };

  toggleEditor = () => {
    this.setState({ isShowEditor: !this.state.isShowEditor });
  };

  onCommit = (value) => {
    this.props.onCommit(value);
    this.setState({ value });
  };

  render() {
    let { column, lang } = this.props;
    let { value, isShowEditor } = this.state;
    const format = getDateColumnFormat(column);
    return (
      <>
        <div className="position-relative">
          <div style={{ height: '50px', lineHeight: '50px' }} onClick={this.toggleEditor}>
            {value ? getDateDisplayString(value, format) : ''}
          </div>
          {<RightAngle />}
        </div>
        {isShowEditor && (
          <DateEditor
            value={value}
            lang={lang}
            column={column}
            onCommit={this.onCommit}
            hideCalendar={this.hideCalendar}
          />
        )}
      </>
    );
  }
}

Small.propTypes = {
  onCommit: PropTypes.func,
  column: PropTypes.object,
  row: PropTypes.object,
  lang: PropTypes.string,
};

export default Small;
