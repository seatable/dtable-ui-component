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

  componentDidMount() {
    if (!this.btn) return;
    const { width } = this.btn.getBoundingClientRect();
    this.slider.style.width = `${width}px`;
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
                ref={ref => this.btn = ref}
                className={`radio-group-button ${isActive ? 'active' : ''}`}
                data-option={option}
                onClick={this.onSelectChanged}
              >
                {displayOption}
              </div>
            );
          })}
          <span className='radio-group-slider btn-primary' ref={ref => this.slider = ref}></span>
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
