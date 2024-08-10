import React from 'react';
import PropTypes from 'prop-types';

import './index.css';

const SLIDER_TRANSITION = '150ms cubic-bezier(.4, 0, .2, 1)';

class DTableRadioGroup extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      activeOption: props.activeOption,
    };
    this.setTransitionTimer = null;
  }

  componentDidMount() {
    const { options } = this.props;
    if (!this.btn || !this.slider || !Array.isArray(options)) return;
    this.slider.style.width = `${100 / options.length}%`;
    this.setSliderTransition();
  }

  componentDidUpdate(prevProps) {
    const { activeOption } = this.props;
    if (activeOption !== prevProps.activeOption && activeOption !== this.state.activeOption) {
      this.setState({ activeOption });
    }
  }

  componentWillUnmount() {
    this.clearTransitionTimer();
  }

  setSliderTransition = () => {
    this.setTransitionTimer = setTimeout(() => {
      this.slider.style.transition = SLIDER_TRANSITION;
      this.clearTransitionTimer();
    }, 1);
  };

  removeSliderTransition = () => {
    if (!this.slider) return;
    this.slider.style.transition = 'none';
  };

  clearTransitionTimer = () => {
    if (!this.setTransitionTimer) return;
    clearTimeout(this.setTransitionTimer);
    this.setTransitionTimer = null;
  };

  onSelectChanged = (event) => {
    const { option } = event.target.dataset;
    if (option === this.state.activeOption) return;
    this.setState({ activeOption: option });

    if (this.props.onSelectChanged) {
      this.props.onSelectChanged(option);
    }
  };

  render() {
    const { options, optionsDisplay, readOnly } = this.props;
    const { activeOption } = this.state;

    return (
      <div className="radio-group-wrapper">
        <div className={`radio-group-options ${readOnly ? 'read-only' : ''}`}>
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
  readOnly: PropTypes.bool,
  activeOption: PropTypes.string,
  options: PropTypes.array.isRequired,
  optionsDisplay: PropTypes.object,
  onSelectChanged: PropTypes.func.isRequired,
};

export default DTableRadioGroup;
