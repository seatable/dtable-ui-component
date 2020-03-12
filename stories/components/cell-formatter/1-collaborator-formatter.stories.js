import React from 'react';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import ShowCode from '../../utils/show-code';
import { CollaboratorFormatter } from '../../../src/components/cell-formatter';

export default {
  title: 'collaborator-formatter',
  component: CollaboratorFormatter
};

const collaborators = [
  {name: '', email: '', contact_email: '', avatar_url: ''}
];

storiesOf('forms|Collaborator-formatter', module)
  .addDecorator(withInfo)
  .add('collaborator-collaborator使用文档', () => (
    <div>
      <ShowCode title='基本样式' sub='显示collaborator信息'>
        <CollaboratorFormatter value={'山水人家'} containerClassName={''} collaborators={collaborators} />
      </ShowCode>
    </div>
  ), {
    info: {
      text: 'API',
      inline: true,
      source: false
    }
  })






