import React from 'react';
import { action } from '@storybook/addon-actions';
import CollaboratorEditor from '../../../src/CollaboratorEditor';

const collaborators = [
  {
    'avatar_url': 'https://dev.seatable.cn/image-view/avatars/7/b/1a8d0bfab57f4db3cc2e44f4c71ddb/resized/80/e9d4953412684d3eccf7eaed805541f1_D2dozlu.png',
    'contact_email': '',
    'email': '53cb8cbf7e5840e881809bf60ce6b69f@auth.local',
    'name': '彭婵',
    'name_pinyin': 'pengchan',
    'id': 'W-00041'
  },
  {
    'avatar_url': 'https://dev.seatable.cn/media/avatars/default.png',
    'contact_email': '',
    'email': '6228afe0ccc945788fe891fdcb6fbb7c@auth.local',
    'name': 'Christoph',
    'name_pinyin': 'Christoph',
    'id': ''
  },
  {
    'avatar_url': 'https://dev.seatable.cn/media/avatars/default.png',
    'contact_email': '',
    'email': 'ad9aacccb4384b6aacef3817ec14ccee@auth.local',
    'name': 'Ralf',
    'name_pinyin': 'Ralf',
    'id': ''
  },
  {
    'avatar_url': 'https://dev.seatable.cn/image-view/avatars/7/0/37bc75140bc2fffcc8400e5ea518e6/resized/80/e9d4953412684d3eccf7eaed805541f1_ocJCsAP.png',
    'contact_email': '',
    'email': 'f1690214fb354581ba0d3550b372d667@auth.local',
    'name': '周潼',
    'name_pinyin': 'zhoutong',
    'id': 'W-00033'
  },
  {
    'avatar_url': 'https://dev.seatable.cn/media/avatars/default.png',
    'contact_email': '',
    'email': 'heran.yang@seafile.com',
    'name': '杨赫然',
    'name_pinyin': 'yangheran',
    'id': 'W-00020'
  }
];

const value1_1 = [];
const column1_1 = {
  key: '0000',
  type: 'collaborator',
  name: 'state',
};

const value1_2 = ['53cb8cbf7e5840e881809bf60ce6b69f@auth.local', 'heran.yang@seafile.com'];

const value2_1 = [];
const column2_1 = {
  key: '256713',
  type: 'collaborator',
  name: 'state'
};

const value2_2 = ['heran.yang@seafile.com', 'f1690214fb354581ba0d3550b372d667@auth.local'];

const meta = {
  title: 'Editors/collaborator-editor',
  component: CollaboratorEditor,
  tags: ['autodocs'],
  decorators: [
    (Story, context) => {
      return (
        <div>
          {context.parameters.title && <h1>{context.parameters.title}</h1>}
          {context.parameters.subTitle && <p className='storybook-sub'>{context.parameters.subTitle}</p>}
          <Story />
        </div>
      );
    }
  ],
  parameters: {
    title: '',
    subTitle: '',
  }
};

export default meta;

// TODO: There is a bug with modal-wrapper, this component need root dom 'modal-wrapper', but now we don't have in storybook
export const Demo1 = {
  args: {
    isReadOnly: false,
    value: value1_1,
    column: column1_1,
    collaborators: collaborators,
    onCommit: (updated) => { action('onCommit')(updated); },
  },
  parameters: {
    subTitle: ''
  }
};

export const Demo2 = {
  args: {
    isReadOnly: false,
    value: value2_1,
    column: column2_1,
    collaborators: collaborators,
    onCommit: (updated) => { action('onCommit')(updated); },
  },
  parameters: {
    subTitle: '',
  }
};

export const Demo3 = {
  args: {
    isReadOnly: true,
    value: value1_2,
    column: column1_1,
    collaborators: collaborators,
    onCommit: (updated) => { action('onCommit')(updated); },
  },
  parameters: {
    subTitle: ''
  }
};

export const Demo4 = {
  args: {
    isReadOnly: true,
    value: value2_2,
    column: column2_1,
    collaborators: collaborators,
    onCommit: (updated) => { action('onCommit')(updated); },
  },
  parameters: {
    subTitle: '',
  }
};
