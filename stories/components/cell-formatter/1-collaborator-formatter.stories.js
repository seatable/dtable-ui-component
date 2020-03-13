import React from 'react';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import ShowCode from '../../utils/show-code';
import { CollaboratorFormatter } from '../../../src/components/cell-formatter';

const collaborators = [
  {name: '山水人家', email: 'shanshuirenjia@seafile.com', contact_email: 'shanshuirenjia@seafile.com', avatar_url: 'http://c.hiphotos.baidu.com/zhidao/pic/item/d009b3de9c82d1587e249850820a19d8bd3e42a9.jpg'},
  {name: '小强', email: 'xiaoqiang@seafile.com', contact_email: 'xiaoqiang@seafile.com', avatar_url: 'http://a.hiphotos.baidu.com/zhidao/pic/item/5366d0160924ab1857f1cbae35fae6cd7a890b47.jpg'},
  {name: '小红', email: 'xiaohong@seafile.com', contact_email: 'xiaohong@seafile.com', avatar_url: 'http://i2.w.yun.hjfile.cn/doc/201303/54c809bf-1eb2-400b-827f-6f024d7d599b_01.jpg'},
];

const onDeleteCollaborator = function(collaborator) {
  alert('click delete button');
};

storiesOf('forms|collaborator-formatter', module)
  .addDecorator(withInfo)
  .add('collaborator-collaborator使用文档', () => (
    <div>
      <h1>类型一</h1>
      <ShowCode sub={"协作人中不包含删除按钮-单个用户"}>
        <CollaboratorFormatter value={'山水人家'} containerClassName={''} collaborators={collaborators} />
      </ShowCode>
      <ShowCode sub={"协作人中不包含删除按钮-多个用户"}>
        <CollaboratorFormatter value={['shanshuirenjia@seafile.com', 'xiaoqiang@seafile.com']} containerClassName={''} collaborators={collaborators} />
      </ShowCode>
      <h1>类型二</h1>
      <ShowCode sub={"协作人中包含删除按钮-单个协作人"}>
        <CollaboratorFormatter 
          value={'山水人家'} 
          containerClassName={''} 
          collaborators={collaborators}
          enableDeleteCollaborator={true}
          onDeleteCollaborator={(collaborator) => {onDeleteCollaborator(collaborator)}}
        />
      </ShowCode>
      <ShowCode sub={"协作人中包含删除按钮-多个协作人"}>
        <CollaboratorFormatter 
          value={['shanshuirenjia@seafile.com', 'xiaoqiang@seafile.com']} 
          containerClassName={''} 
          collaborators={collaborators}
          enableDeleteCollaborator={true}
          onDeleteCollaborator={(collaborator) => {onDeleteCollaborator(collaborator)}}
        />
      </ShowCode>
    </div>
  ), {
    info: {
      text: 'API',
      inline: true,
      source: false
    }
  })






