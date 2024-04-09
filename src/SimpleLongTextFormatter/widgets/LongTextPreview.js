import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import DtableMarkdownViewer from './dtable-markdown-viewer';
import './longTextEditor.css';

const propTypes = {
  className: PropTypes.string,
  value: PropTypes.object,
  toggle: PropTypes.func,
  formatterStyle: PropTypes.object,
};

class LongTextPreview extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      height: 450,
      opacity: 0,
    };
  }

  componentDidMount() {
    setTimeout(() => {
      if (!this.ref) return;
      const domHeight = this.ref.offsetHeight;
      this.setState({
        height: domHeight,
        opacity: 1,
      });
    }, 0);
  }

  getStyle = () => {
    let { formatterStyle } = this.props;
    let { left, top } = formatterStyle;
    const width = 520;
    const height = this.state.height;
    const padding = 6;
    left = left - width > 0 ? left - width - 12 : 0;
    top = top - padding;
    if (top + height > window.innerHeight) {
      top = top - height > 0 ? top - height : 0;
    }
    return { left, top, opacity: this.state.opacity };
  };

  render() {
    const { className, value } = this.props;
    const markdownContent = value ? value.text : '';
    return (
      <div className={classnames('longtext-modal-dialog longtext-preview', className)} style={this.getStyle()} ref={ref => this.ref = ref}>
        <div className='longtext-container longtext-container-scroll'>
          <DtableMarkdownViewer markdownContent={markdownContent} showTOC={false} />
        </div>
      </div>
    );
  }
}

LongTextPreview.propTypes = propTypes;

export default LongTextPreview;
