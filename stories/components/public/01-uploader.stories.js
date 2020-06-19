import React from 'react';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import { action } from '@storybook/addon-actions';
import ShowCode from '../../utils/show-code';
import Description from '../../utils/description';
import FileUploader from '../../../src/components/file-uploader';
import { setLocale } from '../../../src/lang';
import '../../css/file-uploader.css';
import dtableWebAPI from '../dtable-web-api';

// setLocale('zh-cn');

const info = {
  text: '<h1>API</h1>',
  inline: true,
  source: false,
  propTablesExclude: [ShowCode, Description],
  styles: {
    header: {
      h1: {
        'marginBottom': '8px'
      }
    }
  }
};

storiesOf('Public|uploader-component', module)
  .addDecorator(withInfo)
  .add('uploader component', () => {
    return (
      <div>
        <h1>Scene One: editor permission is readonly</h1>
        <ShowCode sub={"uploader component: upload image"}>
          <FileUploader
            uploadType="image"
            className="uploader-container"
            dtableWebAPI={dtableWebAPI}
            fileName={'test2'}
            workspaceID={4}
            onFileUploadSuccess={(updated) => action('uploadSuccess')(updated)}
            server="https://dev.seafile.com/dtable-web"
            onFileUploadProgress={(updated) => action('uploadProgress')(updated)}
            onFileUploadFailed={(updated) => action('uploadFailed')(updated)}
          >
            <span>{'Start Upload'}</span>
          </FileUploader>
        </ShowCode>
        <ShowCode sub={"uploader component: upload file"}>
          <FileUploader
            server="https://dev.seafile.com/dtable-web"
            uploadType="file"
            className="uploader-container"
            dtableWebAPI={dtableWebAPI}
            fileName={'test2'}
            workspaceID={4}
            onFileUploadSuccess={(updated) => action('uploadSuccess')(updated)}
            onFileUploadProgress={(updated) => action('uploadProgress')(updated)}
            onFileUploadFailed={(updated) => action('uploadFailed')(updated)}
          >
            <span>Start Upload</span>
          </FileUploader>
        </ShowCode>

        <ShowCode sub={"uploader component: upload file and dragDrop file"}>
          <FileUploader
            server="https://dev.seafile.com/dtable-web"
            uploadType="file"
            className="uploader-container"
            dtableWebAPI={dtableWebAPI}
            fileName={'test2'}
            workspaceID={4}
            onFileUploadSuccess={(updated) => action('uploadSuccess')(updated)}
            onFileUploadProgress={(updated) => action('uploadProgress')(updated)}
            onFileUploadFailed={(updated) => action('uploadFailed')(updated)}
            isSupportDragDrop={true}
            updateUploadFileList={(updated) => action('uploadFailed')(updated)}
          >
            <span>Start Upload</span>
          </FileUploader>
        </ShowCode>
      </div>
    )
  }, {info})






