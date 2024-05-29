import React from 'react';
import PropTypes from 'prop-types';

import './index.css';

class DTableRadioGroup extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      activeOption: props.activeOption,
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.activeOption !== prevProps.activeOption) {
      this.setState({ activeOption: this.props.activeOption });
    }
  }

  onSelectChanged = (event) => {
    const { option } = event.target.dataset;
    if (option === this.state.activeOption) return;
    this.setState({ activeOption: option });
    this.props.onSelectChanged(option);
  };

  render() {
    const { options, optionsDisplay } = this.props;
    const { activeOption } = this.state;

    return (
      <div className="radio-group-wrapper">
        <div className="radio-group-options">
          {options.map(option => {
            const isActive = activeOption === option ? true : false;
            const displayOption = (optionsDisplay && optionsDisplay[option]) || '';
            return (
              <div
                key={option}
                className={`radio-group-button ${isActive ? 'btn-primary' : ''}`}
                data-option={option}
                onClick={this.onSelectChanged}
              >
                {displayOption}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

DTableRadioGroup.propTypes = {
  activeOption: PropTypes.string,
  options: PropTypes.array.isRequired,
  optionsDisplay: PropTypes.object,
  onSelectChanged: PropTypes.func.isRequired,
};

export default DTableRadioGroup;
