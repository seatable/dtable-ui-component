import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import {
  TextFormatter,
  NumberFormatter,
  CheckboxFormatter,
  DateFormatter,
  SingleSelectFormatter,
  MultipleSelectFormatter,
  CollaboratorFormatter,
  LongTextFormatter,
  GeolocationFormatter,
  CTimeFormatter,
  CreatorFormatter,
  LastModifierFormatter,
  MTimeFormatter,
  AutoNumberFormatter,
  DurationFormatter,
  ButtonFormatter,
  RowExpandUrlFormatter,
  RowExpandEmailFormatter,
  RowExpandRateFormatter,
  RowExpandImageFormatter,
  RowExpandFileFormatter,
  RowExpandLinkFormatter,
  RowExpandFormulaFormatter,
  DigitalSignFormatter,
  DepartmentSingleSelectFormatter,
} from '../index';
import { CellType } from '../constants';

import './index.css';

export default class EditorFormatter extends React.Component {

  static defaultProps = {
    className: '',
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
    context: PropTypes.object,
    eventBus: PropTypes.object,
    config: PropTypes.object, // for digital sign formatter
  };

  constructor(props) {
    super(props);
    this.state = {
      collaborators: this.getCollaborator(),
    };
  }

  componentDidMount() {
    this.calculateCollaboratorData(this.props);
    if (this.props.eventBus) {
      this.listenCollaboratorsUpdated = this.props.eventBus.subscribe('collaborators-updated', this.updateCollaborators);
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.calculateCollaboratorData(nextProps);
  }

  componentWillUnmount() {
    this.listenCollaboratorsUpdated();
  }

  updateCollaborators = () => {
    this.setState({ collaborators: this.getCollaborator() });
  }

  calculateCollaboratorData = (props) => {
    const { row, column } = props;
    if (column.type === CellType.CREATOR || column.type === CellType.LAST_MODIFIER) {
      const email = row[column.name];
      this.loadCollaborator(email);
    }
    else if (column.type === CellType.COLLABORATOR) {
      const emails = row[column.name];
      if (Array.isArray(emails)) {
        emails.forEach(email => {
          this.loadCollaborator(email);
        });
      }
    }
  }

  getCollaborator = () => {
    const { context, collaborators } = this.props;
    if (context && context.getCollaboratorsFromCache) {
      return context.getCollaboratorsFromCache();
    }
    return collaborators || [];
  }

  loadCollaborator = (email) => {
    const { context } = this.props;
    if (context && context.loadCollaborator) {
      context.loadCollaborator(email);
    }
  }

  renderEmpty = () => {
    return (
      <div className="d-flex align-items-center form-control disabled h-auto"></div>
    );
  }

  renderFormatter = () => {
    let { column, row, className } = this.props;
    let { type: columnType } = column;

    const { collaborators } = this.state;
    const containerClassName = `dtable-${columnType}-formatter ${className || ''}`;
    let cellValue = row[column.key] || row[column.name];

    switch(columnType) {
      case CellType.TEXT: {
        return (
          <div className="form-control d-flex align-items-center w-100">
            <TextFormatter value={cellValue} containerClassName={containerClassName} />
          </div>
        );
      }
      case CellType.COLLABORATOR: {
        return (
          <div className="form-control d-flex align-items-center w-100 h-auto">
            <CollaboratorFormatter
              value={cellValue}
              collaborators={collaborators}
              containerClassName={containerClassName}
            />
          </div>
        );
      }
      case CellType.LONG_TEXT: {
        if (!cellValue) return null;
        return (
          <div className="longtext-formatter-container">
            <LongTextFormatter value={cellValue} containerClassName={containerClassName} isSample={false} />
          </div>
        );
      }
      case CellType.GEOLOCATION : {
        if (typeof cellValue !== 'object') return null;
        return (
          <div className="geolocation-formatter-container">
            <GeolocationFormatter value={cellValue} data={column.data} containerClassName={containerClassName} />
          </div>
        );
      }
      case CellType.NUMBER: {
        return (
          <div className="form-control d-flex align-items-center" style={{ width: 320 }}>
            <NumberFormatter value={cellValue} data={column.data} containerClassName={containerClassName} />
          </div>
        );
      }
      case CellType.DATE: {
        return (
          <div className="form-control d-flex align-items-center" style={{ width: 320 }}>
            <DateFormatter value={cellValue} format={column.data.format} containerClassName={containerClassName} />
          </div>
        );
      }
      case CellType.CTIME: {
        return (
          <div className="form-control d-flex align-items-center ctime-formatter-container" style={{ width: 320 }}>
            <CTimeFormatter value={row._ctime} containerClassName={containerClassName} />
          </div>
        );
      }
      case CellType.MTIME: {
        return (
          <div className="form-control d-flex align-items-center mtime-formatter-container" style={{ width: 320 }}>
            <MTimeFormatter value={row._mtime} containerClassName={containerClassName} />
          </div>
        );
      }
      case CellType.MULTIPLE_SELECT: {
        const options = column.data ? column.data.options : [];
        return (
          <div className="form-control d-flex align-items-center w-100 h-auto">
            <MultipleSelectFormatter
              value={cellValue}
              options={options}
              containerClassName={containerClassName}
            />
          </div>
        );
      }
      case CellType.SINGLE_SELECT: {
        const options = column.data ? column.data.options : [];
        return (
          <div className="form-control d-flex align-items-center w-100">
            <SingleSelectFormatter
              value={cellValue}
              options={options}
              containerClassName={containerClassName}
            />
          </div>
        );
      }
      case CellType.FILE: {
        return (
          <RowExpandFileFormatter
            value={cellValue}
            column={column}
            downloadFile={this.props.downloadFile}
            deleteFile={this.props.deleteFile}
          />
        );
      }
      case CellType.IMAGE: {
        return (
          <RowExpandImageFormatter
            value={cellValue}
            column={column}
            downloadImage={this.props.downloadImage}
            deleteFile={this.props.deleteFile}
            onRotateImage={this.props.onRotateImage}
          />
        );
      }
      case CellType.CHECKBOX: {
        return (
          <div className="checkbox-formatter-container">
            <CheckboxFormatter value={cellValue} />
          </div>
        );
      }
      case CellType.CREATOR: {
        return (
          <CreatorFormatter collaborators={collaborators} value={cellValue} containerClassName={containerClassName} />
        );
      }
      case CellType.LAST_MODIFIER: {
        return (
          <LastModifierFormatter collaborators={collaborators} value={cellValue} containerClassName={containerClassName} />
        );
      }
      case CellType.FORMULA:
      case CellType.LINK_FORMULA: {
        return (
          <RowExpandFormulaFormatter
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
          <RowExpandLinkFormatter
            value={cellValue}
            column={column}
            collaborators={collaborators}
            containerClassName={containerClassName}
            renderEmpty={this.renderEmpty}
          />
        );
      }
      case CellType.AUTO_NUMBER: {
        return <AutoNumberFormatter value={cellValue} containerClassName={containerClassName} />;
      }
      case CellType.URL: {
        return (
          <div className="form-control d-flex align-items-center w-100">
            <RowExpandUrlFormatter value={cellValue} containerClassName={containerClassName} />
          </div>
        );
      }
      case CellType.EMAIL: {
        return (
          <div className="form-control d-flex align-items-center w-100">
            <RowExpandEmailFormatter value={cellValue} containerClassName={containerClassName} />
          </div>
        );
      }
      case CellType.DURATION: {
        return (
          <div className="form-control d-flex align-items-center" style={{ width: 320 }}>
            <DurationFormatter value={cellValue} format={column.data.duration_format} containerClassName={containerClassName} />
          </div>
        );
      }
      case CellType.RATE: {
        return (
          <div className="form-control d-flex align-items-center" style={{ width: 320 }}>
            <RowExpandRateFormatter value={cellValue} data={column.data} containerClassName={containerClassName} />
          </div>
        );
      }
      case CellType.BUTTON: {
        return (
          <ButtonFormatter data={column.data} containerClassName={containerClassName} onClickButton={this.props.onClickButton}/>
        );
      }
      case CellType.DIGITAL_SIGN: {
        return (
          <DigitalSignFormatter value={cellValue} containerClassName={containerClassName} config={this.props.config}/>
        );
      }
      case CellType.DEPARTMENT_SINGLE_SELECT: {
        return (
          <DepartmentSingleSelectFormatter value={cellValue} departments={this.props.departments}/>
        );
      }
      default:
        return null;
    }
  }

  render() {
    const { className } = this.props;
    return(
      <div className={classnames('dtable-ui dtable-row-expand-formatter', {[className]: className})}>
        {this.renderFormatter()}
      </div>
    );
  }
}
