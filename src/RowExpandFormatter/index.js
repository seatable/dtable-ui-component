import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { CellType } from 'dtable-utils';
import { DEFAULT_FORMATTER } from './constants';

import './index.css';

class RowExpandFormatter extends React.Component {

  static defaultProps = {
    className: '',
    valueKey: 'name',
  };

  static propTypes = {
    column: PropTypes.object.isRequired,
    row: PropTypes.object.isRequired,
    className: PropTypes.string,
    collaborators: PropTypes.array,
    departments: PropTypes.array,
    onClickButton: PropTypes.func,
    downloadFile: PropTypes.func,
    deleteFile: PropTypes.func,
    downloadImage: PropTypes.func,
    onRotateImage: PropTypes.func,
    eventBus: PropTypes.object,
    config: PropTypes.object,
    component: PropTypes.object,
    getCollaborators: PropTypes.func,
    queryCollaborators: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      collaborators: this.getCollaborators(),
    };
    this.component = {
      ...DEFAULT_FORMATTER,
      ...this.props.component,
    };
  }

  componentDidMount() {
    this.calculateCollaboratorData(this.props);
    const eventBus = this.props.eventBus;
    if (eventBus) {
      this.unsubscribeCollaboratorsUpdated = eventBus.subscribe('collaborators-updated', this.updateCollaborators);
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.calculateCollaboratorData(nextProps);
  }

  componentWillUnmount() {
    if (this.props.eventBus && this.unsubscribeCollaboratorsUpdated) {
      this.unsubscribeCollaboratorsUpdated();
    }
  }

  updateCollaborators = () => {
    const { column } = this.props;
    if (![CellType.CREATOR, CellType.LAST_MODIFIER, CellType.COLLABORATOR].includes(column.type)) return;
    const collaborators = this.getCollaborators();
    this.setState({ collaborators });
  };

  calculateCollaboratorData = (props) => {
    const { row, column, valueKey, queryCollaborators } = props;
    if (column.type === CellType.CREATOR || column.type === CellType.LAST_MODIFIER) {
      const email = row[column[valueKey]];
      queryCollaborators && queryCollaborators(email);
    } else if (column.type === CellType.COLLABORATOR) {
      const emails = row[column[valueKey]];
      if (Array.isArray(emails)) {
        queryCollaborators && queryCollaborators(emails);
      }
    }
  };

  getCollaborators = () => {
    const { getCollaborators, collaborators } = this.props;
    if (getCollaborators) return getCollaborators();
    return collaborators || [];
  };

  renderEmpty = () => {
    return (
      <div className="d-flex align-items-center form-control disabled h-auto"></div>
    );
  };

  renderFormatter = () => {
    let { column, row, valueKey } = this.props;
    let { type: columnType } = column;

    const { collaborators } = this.state;
    const containerClassName = `dtable-ui-row-expand-${columnType}-formatter`;

    let cellValue = row[column[valueKey]];
    const Formatter = this.component[columnType];
    if (!Formatter) return null;

    switch (columnType) {
      case CellType.TEXT: {
        return (
          <div className="form-control d-flex align-items-center w-100">
            <Formatter value={cellValue} containerClassName={containerClassName} />
          </div>
        );
      }
      case CellType.COLLABORATOR: {
        return (
          <div className="form-control d-flex align-items-center w-100 h-auto">
            <Formatter
              value={cellValue}
              collaborators={collaborators}
              containerClassName={containerClassName}
            />
          </div>
        );
      }
      case CellType.LONG_TEXT: {
        if (!cellValue) return (<div className="form-control d-flex align-items-center w-100"></div>);
        return (
          <div className="longtext-formatter-container">
            <Formatter value={cellValue} containerClassName={containerClassName} isSample={false} />
          </div>
        );
      }
      case CellType.GEOLOCATION: {
        if (!cellValue) return null;
        if (typeof cellValue !== 'object') return null;
        return (
          <div className="dtable-ui-geolocation-formatter-container">
            <Formatter value={cellValue} data={column.data} containerClassName={containerClassName} />
          </div>
        );
      }
      case CellType.NUMBER: {
        return (
          <div className="form-control d-flex align-items-center" style={{ width: 320 }}>
            <Formatter value={cellValue} data={column.data} containerClassName={containerClassName} />
          </div>
        );
      }
      case CellType.DATE: {
        return (
          <div className="form-control d-flex align-items-center" style={{ width: 320 }}>
            <Formatter value={cellValue} format={column.data.format} containerClassName={containerClassName} />
          </div>
        );
      }
      case CellType.CTIME: {
        return (
          <div className="form-control d-flex align-items-center ctime-formatter-container" style={{ width: 320 }}>
            <Formatter value={cellValue} containerClassName={containerClassName} />
          </div>
        );
      }
      case CellType.MTIME: {
        return (
          <div className="form-control d-flex align-items-center mtime-formatter-container" style={{ width: 320 }}>
            <Formatter value={cellValue} containerClassName={containerClassName} />
          </div>
        );
      }
      case CellType.MULTIPLE_SELECT: {
        const options = column?.data?.options || [];
        return (
          <div className="form-control d-flex align-items-center w-100 h-auto">
            <Formatter
              value={cellValue}
              options={options}
              containerClassName={containerClassName}
            />
          </div>
        );
      }
      case CellType.SINGLE_SELECT: {
        const options = column?.data?.options || [];
        return (
          <div className="form-control d-flex align-items-center w-100">
            <Formatter
              value={cellValue}
              options={options}
              containerClassName={containerClassName}
            />
          </div>
        );
      }
      case CellType.FILE: {
        return (
          <Formatter
            value={cellValue}
            column={column}
            downloadFile={this.props.downloadFile}
            deleteFile={this.props.deleteFile}
            config={this.props.config}
          />
        );
      }
      case CellType.IMAGE: {
        return (
          <Formatter
            value={cellValue}
            column={column}
            downloadImage={this.props.downloadImage}
            deleteFile={this.props.deleteFile}
            onRotateImage={this.props.onRotateImage}
            config={this.props.config}
          />
        );
      }
      case CellType.CHECKBOX: {
        return (
          <div className="checkbox-formatter-container">
            <Formatter value={cellValue} checkboxStyle={column.data?.checkbox_style || {}} />
          </div>
        );
      }
      case CellType.CREATOR:
      case CellType.LAST_MODIFIER: {
        return (
          <Formatter collaborators={collaborators} value={cellValue} containerClassName={containerClassName} />
        );
      }
      case CellType.FORMULA:
      case CellType.LINK_FORMULA: {
        return (
          <Formatter
            value={cellValue}
            column={column}
            collaborators={collaborators}
            containerClassName={containerClassName}
          />
        );
      }
      case CellType.LINK: {
        // handle link column do not have column.data.display_column
        const { data } = column;
        const { display_column_key, array_type, array_data } = data;
        if (!data.display_column) {
          column = {
            ...column,
            data: {
              ...data,
              display_column: {
                key: display_column_key || '0000',
                type: array_type || CellType.TEXT,
                data: array_data || null,
              }
            }
          };
        }
        return (
          <Formatter
            value={cellValue}
            column={column}
            collaborators={collaborators}
            containerClassName={containerClassName}
            renderEmpty={() => null}
          />
        );
      }
      case CellType.AUTO_NUMBER: {
        return <Formatter value={cellValue} containerClassName={containerClassName} />;
      }
      case CellType.URL: {
        return (
          <div className="form-control d-flex align-items-center w-100">
            <Formatter value={cellValue} containerClassName={containerClassName} />
          </div>
        );
      }
      case CellType.EMAIL: {
        return (
          <div className="form-control d-flex align-items-center w-100">
            <Formatter value={cellValue} containerClassName={containerClassName} />
          </div>
        );
      }
      case CellType.DURATION: {
        return (
          <div className="form-control d-flex align-items-center" style={{ width: 320 }}>
            <Formatter value={cellValue} format={column.data.duration_format} containerClassName={containerClassName} />
          </div>
        );
      }
      case CellType.RATE: {
        return (
          <div className="form-control d-flex align-items-center" style={{ width: 320 }}>
            <Formatter value={cellValue} data={column.data} containerClassName={containerClassName} />
          </div>
        );
      }
      case CellType.BUTTON: {
        return (<Formatter data={column.data} containerClassName={containerClassName} onClickButton={this.props.onClickButton} />);
      }
      case CellType.DIGITAL_SIGN: {
        return (<Formatter value={cellValue} containerClassName={containerClassName} config={this.props.config} />);
      }
      case CellType.DEPARTMENT_SINGLE_SELECT: {
        return (<Formatter value={cellValue} departments={this.props.departments} />);
      }
      default: {
        return (<Formatter value={cellValue} containerClassName={containerClassName} config={this.props.config} />);
      }
    }
  };

  render() {
    const { className } = this.props;
    return (
      <div className={classnames('dtable-ui dtable-ui-row-expand-formatter', className)}>
        {this.renderFormatter()}
      </div>
    );
  }
}

export default RowExpandFormatter;
