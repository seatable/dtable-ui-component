import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { isValidEmail } from 'dtable-utils';
import CollaboratorItem from '../../CollaboratorItem';

export default class CollaboratorItemFormatter extends Component {

  static propTypes = {
    cellValue: PropTypes.string,
    collaborators: PropTypes.array,
    context: PropTypes.object,
    renderEmpty: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      isDataLoaded: false,
      collaborator: null,
    };
  }

  componentDidMount() {
    this.calculateCollaboratorData(this.props);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.calculateCollaboratorData(nextProps);
  }

  calculateCollaboratorData = (props) => {
    const { context, collaborators } = this.props;
    const { cellValue } = props;
    if (!cellValue) {
      this.setState({ isDataLoaded: true, collaborator: null });
      return;
    }
    this.setState({ isDataLoaded: false, collaborator: null });
    let collaborator = collaborators && collaborators.find(c => c.name === cellValue);
    if (collaborator) {
      this.setState({ isDataLoaded: true, collaborator });
      return;
    }

    if (!context) return;
    const mediaUrl = context.getSetting('mediaUrl');
    const defaultAvatarUrl = `${mediaUrl}/avatars/default.png`;
    if (cellValue === 'anonymous') {
      collaborator = {
        name: 'anonymous',
        avatar_url: defaultAvatarUrl,
      };
      this.setState({ isDataLoaded: true, collaborator });
      return;
    }

    let collaboratorsCache = context.getSetting('collaboratorsCache');
    collaborator = collaboratorsCache[cellValue];
    if (collaborator) {
      this.setState({ isDataLoaded: true, collaborator });
      return;
    }

    if (!isValidEmail(cellValue)) {
      collaborator = {
        name: cellValue,
        avatar_url: defaultAvatarUrl,
      };
      collaboratorsCache[cellValue] = collaborator;
      this.setState({ isDataLoaded: true, collaborator });
      return;
    }
    this.props.context.getUserCommonInfo(cellValue).then(res => {
      collaborator = res.data;
      collaboratorsCache[cellValue] = collaborator;
      this.setState({ isDataLoaded: true, collaborator });
    }).catch(() => {
      collaborator = {
        name: cellValue,
        avatar_url: defaultAvatarUrl,
      };
      collaboratorsCache[cellValue] = collaborator;
      this.setState({ isDataLoaded: true, collaborator });
    });
  };

  render() {
    const { cellValue } = this.props;
    const { collaborator, isDataLoaded } = this.state;
    if (!isDataLoaded || !cellValue || !collaborator) {
      return this.props.renderEmpty();
    }
    return (
      <CollaboratorItem collaborator={collaborator} enableDeleteCollaborator={false} />
    );
  }
}
