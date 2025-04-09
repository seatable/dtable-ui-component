import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';
import DTableCustomFooter from '../DTableCustomFooter';
import SignatureBoard from './signature-board';
import DigitalService from './service';
import DigitalSignUtils from './utils';
import { generateCurrentBaseImageUrl } from '../utils/url';
import toaster from '../toaster';
import { getLocale } from '../lang';
import { getErrorMsg } from '../utils/utils';

import './index.css';

class DigitalSignEditor extends Component {

  constructor(props) {
    super(props);
    this.state = {
      editorPosition: {},
      saving: false,
    };
    const { uploadFile, config, value } = props;
    const { username } = config || {};
    this.value = value || {};
    this.digitalService = new DigitalService({ uploadFile, username });
  }

  componentDidMount() {
    this.setPosition();
  }

  setPosition = () => {
    if (!this.editor) return;
    const { offsetLeft, offsetTop } = this.editor.parentNode;
    const { offsetWidth: editorWidth, offsetHeight: editorHeight } = this.editor;
    let editorLeft = offsetLeft - editorWidth;
    let editorTop = offsetTop;
    if (this.props.isInModal) {
      const innerHeight = window.innerHeight;
      const offsetTop = this.editor.parentNode.getBoundingClientRect().y;
      editorTop = offsetTop;
      editorTop = editorHeight + editorTop > innerHeight ? innerHeight - editorHeight - 30 : editorTop;
      editorLeft = -30;
    } else {
      if (offsetLeft < editorWidth) {
        editorLeft = offsetLeft + this.props.column.width;
      }
      if (editorLeft + editorWidth > window.innerWidth) {
        editorLeft = window.innerWidth - editorWidth;
      }
      if (offsetTop + editorHeight > window.innerHeight) {
        editorTop = window.innerHeight - editorHeight - 10;
      }
    }
    this.setState({
      editorPosition: {
        top: editorTop, left: editorLeft,
      }
    });
  };

  getValue = () => {
    const updated = {
      [this.props.column.key]: this.value,
    };
    return updated;
  };

  saveSignature = () => {
    if (!this.signatureBoard || this.state.saving) return;
    if (!this.signatureBoard.checkHasChanged()) {
      this.props.onCommitCancel();
      return;
    }
    this.signatureBoard.convert2BlobPNG((signBlob) => {
      if (!signBlob) {
        if (!this.props.value) {
          this.props.onCommitCancel();
          return;
        }

        // clear the old dtable-ui-digital-sign
        this.value = null;
        this.props.onCommit(this.value);
        return;
      }
      this.setState({ saving: true });
      this.digitalService.uploadSignImage(signBlob, {
        successCallback: (signature) => {
          this.value = signature;
          this.setState({ saving: false }, () => {
            this.props.onCommit(Object.assign({}, this.value));
          });
        },
        failedCallback: (error) => {
          const errMsg = getErrorMsg(error, true);
          if (!error.response || error.response.status !== 403) {
            toaster.danger(getLocale(errMsg));
          }
          this.setState({ saving: false });
        },
      });
    });
  };

  clearSignature = () => {
    this.signatureBoard.clear();
  };

  render() {
    const { value, config } = this.props;
    const { editorPosition, saving } = this.state;
    const signImageUrl = generateCurrentBaseImageUrl({ ...config, partUrl: DigitalSignUtils.getSignImageUrl(value) });
    return (
      <div
        className="dtable-ui-digital-sign-editor-container"
        ref={ref => this.editor = ref}
        style={{ ...editorPosition, zIndex: 1000 }}
      >
        <div className='dtable-ui-digital-sign-editor-header'>
          <div className='dtable-ui-digital-sign-editor-logo'>
            <i className='dtable-font dtable-icon-handwritten-signature'></i>
            <span className='ml-2 dtable-ui-digital-sign-editor-title'>{getLocale('Digital_signature')}</span>
          </div>
          <div className='dtable-ui-digital-sign-editor-operations'>
            <div className='btn-clear-dtable-ui-digital-sign' onClick={this.clearSignature}>
              <i className='dtable-font dtable-icon-clear-format'></i>
              <span>{getLocale('Re-sign')}</span>
            </div>
          </div>
        </div>
        <div className="dtable-ui-digital-sign-panel">
          <SignatureBoard ref={ref => this.signatureBoard = ref} signImageUrl={signImageUrl} />
        </div>
        <DTableCustomFooter>
          <Button onClick={this.props.onCommitCancel} color='secondary'>
            {getLocale('Cancel')}
          </Button>
          <Button onClick={this.saveSignature} color='primary' disabled={saving}>
            {getLocale(saving ? 'Saving' : 'Save')}
          </Button>
        </DTableCustomFooter>
      </div>
    );
  }
}

DigitalSignEditor.propTypes = {
  isInModal: PropTypes.bool,
  config: PropTypes.object,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  column: PropTypes.object,
  onCommitCancel: PropTypes.func.isRequired,
  onCommit: PropTypes.func,
};

export default DigitalSignEditor;
