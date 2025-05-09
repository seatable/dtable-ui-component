import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MobileFullScreenPage from '../../MobileFullScreenPage';
import SignatureBoard from '../signature-board';
import DigitalService from '../service';
import DigitalSignUtils from '../utils';
import { generateCurrentBaseImageUrl } from '../../utils/url';
import toaster from '../../toaster';
import { getLocale } from '../../lang';
import { getErrorMsg } from '../../utils/utils';

import './index.css';

const { Header, Body } = MobileFullScreenPage;

class MBDigitalSignEditor extends Component {

  constructor(props) {
    super(props);
    this.state = {
      saving: false,
    };
    const { uploadFile, config, value } = props;
    const { username } = config || {};
    this.value = value || {};
    this.digitalService = new DigitalService({ uploadFile, username });
    this.signatureBoard = null;
  }

  getValue = () => {
    const updated = {
      [this.props.column.key]: this.value,
    };
    return updated;
  };

  onToggle = () => {
    this.props.onCommitCancel();
  };

  onSave = () => {
    if (!this.signatureBoard || this.state.saving) return;
    if (!this.signatureBoard.checkHasChanged()) {
      this.onToggle();
      return;
    }
    this.signatureBoard.convert2BlobPNG((signBlob) => {
      if (!signBlob) {
        if (!this.props.value) {
          this.onToggle();
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
            this.props.onCommit(this.value);
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

  historyCallback = (event) => {
    if (this.state.saving) return;
    event.preventDefault();
    this.onToggle();
  };

  render() {
    const { value, config, column } = this.props;
    const { saving } = this.state;
    const signImageUrl = generateCurrentBaseImageUrl({ ...config, partUrl: DigitalSignUtils.getSignImageUrl(value) });
    return (
      <MobileFullScreenPage
        className="dtable-ui dtable-ui-mobile-digital-sign-editor"
        zIndex={101}
        historyCallback={this.historyCallback}
      >
        <Header onLeftClick={this.onToggle} onRightClick={this.onSave}>
          <>{getLocale('Cancel')}</>
          {column.name}
          <span style={{ color: '#f09f3f' }}>{getLocale('Submit')}</span>
        </Header>
        <Body>
          <div className="dtable-ui-digital-sign-panel position-relative">
            <div className="dtable-ui-digital-sign-editor-operations position-absolute">
              <div className="btn-clear-dtable-ui-digital-sign" onClick={this.clearSignature}>
                <span>{getLocale('Re-sign')}</span>
              </div>
            </div>
            <SignatureBoard ref={ref => this.signatureBoard = ref} signImageUrl={signImageUrl} />
          </div>
          {saving && (
            <div className="dtable-ui-digital-sign-panel-mask position-absolute">
              <div className="dtable-ui-digital-sign-panel-mask-container">
                {getLocale('Saving...')}
              </div>
            </div>
          )}
        </Body>
      </MobileFullScreenPage>
    );
  }
}

MBDigitalSignEditor.propTypes = {
  config: PropTypes.object,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  column: PropTypes.object,
  onCommitCancel: PropTypes.func.isRequired,
  onCommit: PropTypes.func,
};

export default MBDigitalSignEditor;
