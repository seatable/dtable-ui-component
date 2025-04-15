import React from 'react';
import PropTypes from 'prop-types';
import CollaboratorEditor from '../../../CollaboratorEditor';
import { getLocale } from '../../../lang';
import CollaboratorItem from '../../../CollaboratorItem';
import RightAngle from '../../RightAngle';
import RowExpandAddBtn from '../../RowExpandAddBtn';

import './index.css';

class Small extends React.Component {

  constructor(props) {
    super(props);
    const { row, column, valueKey } = this.props;
    this.state = {
      menuPosition: null,
      value: row[column[valueKey]] || [],
      showEditor: false,
      emailCollaboratorMap: {},
    };
  }

  componentDidMount() {
    this.initCollaborators(this.props);
    const eventBus = this.props.eventBus;
    if (eventBus) {
      this.unsubscribeCollaboratorsUpdated = eventBus.subscribe('collaborators-updated', this.updateCollaborators);
    } else {
      this.updateCollaborators();
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { column, row, valueKey } = nextProps;
    if (row._id !== this.props.row._id) {
      this.initCollaborators(nextProps);
      this.setState({
        value: row[column[valueKey]] || [],
        showEditor: false
      });
    }
  }

  componentWillUnmount() {
    if (this.props.eventBus && this.unsubscribeCollaboratorsUpdated) {
      this.unsubscribeCollaboratorsUpdated();
    }
  }

  initCollaborators = (props) => {
    const { row, column, valueKey } = props;
    const emails = row[column[valueKey]] || [];
    props.queryCollaborators && props.queryCollaborators(emails);
  };

  getCollaborators = () => {
    const { getCollaborators, collaborators } = this.props;
    if (getCollaborators) return getCollaborators();
    return collaborators || [];
  };

  updateCollaborators = () => {
    const collaborators = this.getCollaborators();
    let emailCollaboratorMap = {};
    collaborators.forEach(c => {
      emailCollaboratorMap[c.email] = c;
    });
    this.setState({ emailCollaboratorMap });
  };

  toggleEditor = (value) => {
    this.setState({ showEditor: value });
  };

  openEditor = (event) => {
    event.stopPropagation();
    this.toggleEditor(true);
  };

  closeEditor = () => {
    this.toggleEditor(false);
  };

  onChange = (collaborator) => {
    let newValue = this.state.value.slice(0);
    const collaboratorIndex = newValue.findIndex(email => collaborator.email === email);
    if (collaboratorIndex === -1) {
      newValue.push(collaborator.email);
    } else {
      newValue.splice(collaboratorIndex, 1);
    }
    this.setState({ value: newValue });
    this.props.onCommit(newValue);
  };

  renderCollaborators = (value) => {
    const { emailCollaboratorMap } = this.state;
    if (Array.isArray(value) && value.length > 0) {
      return value.map((email, index) => {
        let collaborator = emailCollaboratorMap[email];
        if (collaborator) {
          const { email } = collaborator;
          return (<CollaboratorItem key={email} collaborator={collaborator}/>);
        }
        collaborator = { name: getLocale('Unknown'), avatar_url: '', email: index + '' };
        return (<CollaboratorItem key={email} className="dtable-ui-unknown-collaborator" collaborator={collaborator} />);
      });
    }
    return (<RowExpandAddBtn text={getLocale('Add_collaborator')} />);
  };

  render() {
    const { collaborators, column } = this.props;
    const { showEditor, value } = this.state;
    return (
      <>
        <div className="dtable-ui mobile-dtable-ui-row-expand-collaborators position-relative" onClick={this.openEditor}>
          {this.renderCollaborators(value)}
          <RightAngle />
        </div>
        {showEditor && (
          <CollaboratorEditor
            value={value}
            column={column}
            collaborators={collaborators}
            onCommit={this.onChange}
            onClose={this.closeEditor}
          />
        )}
      </>
    );
  }
}

Small.propTypes = {
  row: PropTypes.object,
  column: PropTypes.object,
  valueKey: PropTypes.string,
  collaborators: PropTypes.array,
  eventBus: PropTypes.object,
  getCollaborators: PropTypes.func,
  queryCollaborators: PropTypes.func,
  onEditorOpen: PropTypes.func,
  onCommit: PropTypes.func,
};

export default Small;
