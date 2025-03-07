import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SignatureTool from './signature-tool';
import Loading from '../../Loading';
import { getLocale } from '../../lang';

import './index.css';

class SignatureBoard extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isEmpty: !props.signImageUrl,
      signImageUrl: props.signImageUrl,
      loadingSignImage: !!props.signImageUrl,
    };
    this.hasChanged = false;
  }

  componentDidMount() {
    this.initSignTool();
  }

  componentWillUnmount() {
    this.setState = () => {};
  }

  initSignTool = () => {
    let signatureBoardCanvas = document.querySelector('#signature_board_canvas');
    if (!this.signatureBoard || !signatureBoardCanvas) return;
    signatureBoardCanvas.style.width = `${this.signatureBoard.offsetWidth}px`;
    signatureBoardCanvas.style.height = `${this.signatureBoard.offsetHeight}px`;
    this.signatureTool = new SignatureTool(signatureBoardCanvas, {
      minLineWidth: 2,
      maxLineWidth: 4,
      onStart: this.onStartSign,
    });
  };

  onStartSign = () => {
    this.hasChanged = true;
    this.setState({ isEmpty: false, signImageUrl: null });
  };

  checkHasChanged = () => {
    return this.hasChanged;
  };

  clear = () => {
    this.hasChanged = true;
    this.signatureTool.clear();
    this.setState({ isEmpty: true, signImageUrl: null });
  };

  getPNG = () => {
    if (this.signatureTool.isEmpty()) return null;
    return this.signatureTool.getPNG();
  };

  getJPG = (quality) => {
    if (this.signatureTool.isEmpty()) return null;
    return this.signatureTool.getJPG(quality);
  };

  convert2BlobPNG = (callback) => {
    if (this.signatureTool.isEmpty()) {
      callback && callback(null);
      return;
    }
    this.signatureTool.convert2BlobPNG(callback);
  };

  convert2BlobJPG = (callback) => {
    if (this.signatureTool.isEmpty()) {
      callback && callback(null);
      return;
    }
    this.signatureTool.convert2BlobJPG(callback);
  };

  onClickSignImage = () => {
    if (this.props.onClickSignImage) {
      this.props.onClickSignImage();
    }
  };

  renderTips = () => {
    const { isEmpty } = this.state;
    if (!isEmpty) return null;
    return <div className="signature-board-tips">{getLocale('Please_sign_on_this_panel')}</div>;
  };

  renderSignImage = () => {
    const { isEmpty, signImageUrl, loadingSignImage } = this.state;
    if (isEmpty || !signImageUrl) return null;
    let img = new Image();
    img.src = signImageUrl;
    img.onload = () => {
      this.setState({ loadingSignImage: false });
    };
    img.onerror = () => {
      this.setState({ loadingSignImage: false });
    };
    return (
      <div
        className="signature-board-image-wrapper"
        style={{ zIndex: 2 }}
        onClick={this.onClickSignImage}
      >
        {loadingSignImage ?
          <Loading /> :
          <img src={signImageUrl} alt='' draggable={false} />
        }
      </div>
    );
  };

  render() {
    return (
      <div
        className='signature-board'
        ref={ref => this.signatureBoard = ref}
      >
        <canvas id='signature_board_canvas' />
        {this.renderTips()}
        {this.renderSignImage()}
      </div>
    );
  }
}

SignatureBoard.propTypes = {
  signImageUrl: PropTypes.string,
  onClickSignImage: PropTypes.func,
};

export default SignatureBoard;
