import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { CellType } from 'dtable-store';
import {
  TextFormatter,
  NumberFormatter,
  CheckboxFormatter,
  DateFormatter,
  SingleSelectFormatter,
  MultipleSelectFormatter,
  CollaboratorFormatter,
  SimpleLongTextFormatter,
  GeolocationFormatter,
  CTimeFormatter,
  CreatorFormatter,
  LastModifierFormatter,
  MTimeFormatter,
  AutoNumberFormatter,
  UrlFormatter,
  EmailFormatter,
  DurationFormatter,
  RateFormatter,
  ButtonFormatter,
  RowExpandImageFormatter,
  RowExpandFileFormatter,
  RowExpandLinkFormatter,
} from '../index';
import './index.css';

const emptyTypeMap = {
  [CellType.TEXT]: true,
  [CellType.LONG_TEXT]: true,
  [CellType.GEOLOCATION]: true,
  [CellType.SINGLE_SELECT]: true,
  [CellType.MULTIPLE_SELECT]: true,
  [CellType.CTIME]: true,
  [CellType.MTIME]: true,
  [CellType.DATE]: true,
  [CellType.AUTO_NUMBER]: true,
  [CellType.URL]: true,
  [CellType.EMAIL]: true,
  [CellType.DURATION]: true,
  [CellType.IMAGE]: true,
  [CellType.FILE]: true,
};

export default class EditorFormatter extends React.Component {

  static propTypes = {
    className: PropTypes.string,
    column: PropTypes.object.isRequired,
    row: PropTypes.object.isRequired,
    getOptionColors: PropTypes.func,
    collaborators: PropTypes.array,
    onClickButton: PropTypes.func,
    downloadFile: PropTypes.func,
    deleteFile: PropTypes.func,
    onRotateImage: PropTypes.func,
    context: PropTypes.object,
    eventBus: PropTypes.object,
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

  componentWillReceiveProps(nextProps) {
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
    return <span className="row-cell-empty"></span>;
  }

  renderFormatter = () => {
    let { column, row, className } = this.props;
    let { type: columnType } = column;

    const { collaborators } = this.state;
    const containerClassName = `dtable-${columnType}-formatter ${className || ''}`;
    let cellValue = row[column.key] || row[column.name];

    if (!cellValue && emptyTypeMap[columnType]) {
      return this.renderEmpty();
    }

    switch(columnType) {
      case CellType.TEXT: {
        return <TextFormatter value={cellValue} containerClassName={containerClassName} />;
      }
      case CellType.COLLABORATOR: {
        if (!cellValue || cellValue.length === 0) {
          return this.renderEmpty();
        }
        let collaboratorFormatter = (
          <CollaboratorFormatter
            value={cellValue}
            collaborators={collaborators}
            containerClassName={containerClassName}
          />
        );
        return collaboratorFormatter;
      }
      case CellType.LONG_TEXT: {
        return <SimpleLongTextFormatter value={cellValue} containerClassName={containerClassName} />;
      }
      case CellType.GEOLOCATION : {
        return <GeolocationFormatter value={cellValue} data={column.data} containerClassName={containerClassName} />;
      }
      case CellType.NUMBER: {
        if (!cellValue && cellValue !== 0) {
          return this.renderEmpty();
        }
        return <NumberFormatter value={cellValue} data={column.data} containerClassName={containerClassName} />;
      }
      case CellType.DATE: {
        return <DateFormatter value={cellValue} format={column.data.format} containerClassName={containerClassName} />;
      }
      case CellType.MULTIPLE_SELECT: {
        if (!cellValue || cellValue.length === 0) {
          return this.renderEmpty();
        }
        const options = column.data ? column.data.options : [];
        return (
          <MultipleSelectFormatter
            value={cellValue}
            options={options}
            containerClassName={containerClassName}
          />
        );
      }
      case CellType.SINGLE_SELECT: {
        const options = column.data ? column.data.options : [];
        return (
          <SingleSelectFormatter
            value={cellValue}
            options={options}
            containerClassName={containerClassName}
          />
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
            downloadFile={this.props.downloadFile}
            deleteFile={this.props.deleteFile}
            onRotateImage={this.props.onRotateImage}
          />
        );
      }
      case CellType.CHECKBOX: {
        return <CheckboxFormatter value={cellValue} />;
      }
      case CellType.CTIME: {
        let cTimeFormatter = <CTimeFormatter value={row._ctime} containerClassName={containerClassName} />;
        if (!row._ctime) {
          cTimeFormatter = this.renderEmpty();
        }
        return cTimeFormatter;
      }
      case CellType.MTIME: {
        let mTimeFormatter = <MTimeFormatter value={row._mtime} containerClassName={containerClassName} />;
        if (!row._mtime) {
          mTimeFormatter = this.renderEmpty();
        }
        return mTimeFormatter;
      }
      case CellType.CREATOR: {
        if (!cellValue) return this.renderEmpty();
        let creatorFormatter = <CreatorFormatter collaborators={collaborators} value={cellValue} containerClassName={containerClassName} />;
        return creatorFormatter;
      }
      case CellType.LAST_MODIFIER: {
        if (!cellValue) return this.renderEmpty();
        let lastModifierFormatter = <LastModifierFormatter collaborators={collaborators} value={cellValue} containerClassName={containerClassName} />;
        return lastModifierFormatter;
      }
      case CellType.FORMULA:
      case CellType.LINK_FORMULA: {
        let textFormatter = <TextFormatter value={cellValue} containerClassName={containerClassName} />;
        if (!cellValue) {
          textFormatter = this.renderEmpty();
        }
        return textFormatter;
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
        if (!Array.isArray(cellValue) || cellValue.length === 0) {
          return this.renderEmpty();
        }
        return (
          <RowExpandLinkFormatter
            value={cellValue}
            column={column}
            collaborators={collaborators}
            containerClassName={containerClassName}
            renderEmpty={this.renderEmpty}
            getOptionColors={this.props.getOptionColors}
          />
        );
      }
      case CellType.AUTO_NUMBER: {
        return <AutoNumberFormatter value={cellValue} containerClassName={containerClassName} />;
      }
      case CellType.URL: {
        return <UrlFormatter value={cellValue} containerClassName={containerClassName} />;
      }
      case CellType.EMAIL: {
        return <EmailFormatter value={cellValue} containerClassName={containerClassName} />;
      }
      case CellType.DURATION: {
        return <DurationFormatter value={cellValue} format={column.data.duration_format} containerClassName={containerClassName} />;
      }
      case CellType.RATE: {
        return <RateFormatter value={cellValue} data={column.data} containerClassName={containerClassName} />;
      }
      case CellType.BUTTON: {
        return <ButtonFormatter data={column.data} containerClassName={containerClassName} onClickButton={this.props.onClickButton}/>;
      }
      default:
        return null;
    }
  }

  render() {
    return(
      <Fragment>
        {this.renderFormatter()}
      </Fragment>
    );
  }
}
