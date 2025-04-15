import React from 'react';
import PropTypes from 'prop-types';
import { searchCollaborators } from 'dtable-utils';
import classnames from 'classnames';
import { Popover } from 'reactstrap';
import CollaboratorItem from '../../CollaboratorItem';
import DTableSearchInput from '../../DTableSearchInput';
import { getLocale } from '../../lang';
import { KeyCodes } from '../../constants';
import ObjectUtils from '../../utils/object-utils';

import './index.css';

class Large extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      searchValue: '',
      highlightIndex: -1,
      maxItemNum: 0,
      itemHeight: 0,
    };
    this.filteredCollaborators = props.collaborators || [];
  }

  onValueChanged = (newSearchValue) => {
    if (newSearchValue === this.state.searchValue) return;
    const { collaborators } = this.props;
    this.filteredCollaborators = searchCollaborators(collaborators, newSearchValue);
    this.setState({
      highlightIndex: this.filteredCollaborators.length > 0 ? 0 : -1,
      searchValue: newSearchValue
    });
  };

  onCollaboratorClick = (collaborator) => {
    this.props.onCommit(collaborator);
  };

  getFilterCollaborator = () => {
    const { collaborators } = this.props;
    const searchValue = this.state.searchValue.toLowerCase();
    if (!searchValue) return collaborators;
    return searchCollaborators(collaborators, searchValue);
  };

  componentDidMount() {
    if (this.props.isInModal && this.parent) {
      if (this.parent.getBoundingClientRect().top > 330) {
        this.ref.style.top = '-200px';
      }
    }
    if (!this.props.isInModal && this.ref) {
      const { bottom } = this.ref.getBoundingClientRect();
      if (bottom > window.innerHeight) {
        this.ref.style.top = `${window.innerHeight - bottom}px`;
      }
    }
    if (this.container && this.collaboratorItem) {
      this.setState({
        maxItemNum: this.getMaxItemNum(),
        itemHeight: parseInt(getComputedStyle(this.collaboratorItem, null).height)
      });
    }
    document.addEventListener('keydown', this.onHotKey, true);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.isInModal && nextProps.value !== this.state.value && Array.isArray(nextProps.value)) {
      this.setState({ value: nextProps.value });
    }
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onHotKey, true);
  }

  getMaxItemNum = () => {
    let collaboratorContainerStyle = getComputedStyle(this.container, null);
    let collaboratorItemStyle = getComputedStyle(this.collaboratorItem, null);
    let maxContainerItemNum = Math.floor(parseInt(collaboratorContainerStyle.maxHeight) / parseInt(collaboratorItemStyle.height));
    return maxContainerItemNum - 1;
  };

  onHotKey = (e) => {
    if (e.keyCode === KeyCodes.Enter) {
      this.onEnter(e);
    } else if (e.keyCode === KeyCodes.UpArrow) {
      this.onUpArrow(e);
    } else if (e.keyCode === KeyCodes.DownArrow) {
      this.onDownArrow(e);
    } else if (e.keyCode === KeyCodes.Escape) {
      this.onEsc(e);
    } else if (e.keyCode === KeyCodes.Tab) {
      if (this.props.onPressTab) {
        this.props.onPressTab(e);
      }
    }
  };

  onEnter = (e) => {
    e.preventDefault();
    let collaborator;
    if (this.filteredCollaborators.length === 1) {
      collaborator = this.filteredCollaborators[0];
    } else if (this.state.highlightIndex > -1) {
      collaborator = this.filteredCollaborators[this.state.highlightIndex];
    }
    if (collaborator) {
      this.onCollaboratorClick(collaborator);
    }
  };

  onUpArrow = (e) => {
    e.preventDefault();
    e.stopPropagation();
    let { highlightIndex, maxItemNum, itemHeight } = this.state;
    if (highlightIndex > 0) {
      this.setState({ highlightIndex: highlightIndex - 1 }, () => {
        if (highlightIndex < this.filteredCollaborators.length - maxItemNum) {
          this.container.scrollTop -= itemHeight;
        }
      });
    } else {
      this.setState({ highlightIndex: this.filteredCollaborators.length - 1 }, () => {
        this.container.scrollTop = this.container.scrollHeight;
      });
    }
  };

  onDownArrow = (e) => {
    e.preventDefault();
    e.stopPropagation();
    let { highlightIndex, maxItemNum, itemHeight } = this.state;
    if (highlightIndex < this.filteredCollaborators.length - 1) {
      this.setState({ highlightIndex: highlightIndex + 1 }, () => {
        if (highlightIndex >= maxItemNum) {
          this.container.scrollTop += itemHeight;
        }
      });
    } else {
      this.setState({ highlightIndex: 0 }, () => {
        this.container.scrollTop = 0;
      });
    }
  };

  onEsc = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const { isInModal, value, onCommitCancel, onClose } = this.props;
    if (isInModal) {
      onClose && onClose();
      return;
    }
    if (ObjectUtils.isSameObject({ 'value': this.state.value }, { value })) {
      onCommitCancel && onCommitCancel();
      return;
    }
    this.onCommit();
  };

  onCommit = () => {
    const value = this.getValue();
    this.props.onCommit(value);
  };

  getValue = () => {
    return this.state.value;
  };

  onKeyDown = (e) => {
    if (e.keyCode === KeyCodes.LeftArrow || e.keyCode === KeyCodes.RightArrow) {
      e.stopPropagation();
    }
  };

  render() {
    const { searchValue, highlightIndex } = this.state;
    const { isInModal, value = [], target } = this.props;

    const dom = (
      <div className="dtable-ui-editor-container dtable-ui-collaborator-editor-container" ref={ref => this.ref = ref}>
        <div className="collaborator-search-container">
          <DTableSearchInput autoFocus={true} placeholder={getLocale('Search_collaborator')} value={searchValue} onChange={this.onValueChanged} onKeyDown={this.onKeyDown}/>
        </div>
        <div className="collaborator-list-container" ref={ref => this.container = ref}>
          {this.filteredCollaborators.length > 0 && (
            this.filteredCollaborators.map((collaborator, index) => {
              const isSelected = value.includes(collaborator.email);
              return (
                <div
                  key={collaborator.email}
                  className={classnames('collaborator-item-container', { 'collaborator-item-container-highlight': index === highlightIndex })}
                  ref={ref => this.collaboratorItem = ref}
                  onClick={this.onCollaboratorClick.bind(this, collaborator)}
                >
                  <CollaboratorItem collaborator={collaborator} />
                  <div className="collaborator-checked">
                    {isSelected && (<i className="dtable-font dtable-icon-check-mark"></i>)}
                  </div>
                </div>
              );
            })
          )}
          {this.filteredCollaborators.length === 0 && (<div className="dtable-ui-editor-no-search-result">{getLocale('No_collaborators_available')}</div>)}
        </div>
      </div>
    );

    if (isInModal) {
      return (
        <div ref={ref => this.parent = ref}>
          <Popover
            placement="bottom-start"
            isOpen={true}
            target={target}
            hideArrow={true}
            fade={false}
            className="dtable-ui dtable-ui-row-expand-select-editor-popover"
          >
            {dom}
          </Popover>
        </div>
      );
    }

    return dom;
  }
}

Large.propTypes = {
  isInModal: PropTypes.bool,
  value: PropTypes.array,
  collaborators: PropTypes.array.isRequired,
  parent: PropTypes.object,
  onCommit: PropTypes.func.isRequired,
  onClose: PropTypes.func,
  onCommitCancel: PropTypes.func,
  onPressTab: PropTypes.func,
};

export default Large;
