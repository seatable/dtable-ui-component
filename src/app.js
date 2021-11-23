import React from 'react';
import { CollaboratorFormatter, SingleSelectFormatter } from './index';

import './app.css';

class App extends React.Component {


  onDeleteCollaborator = () => {
    //
  }

  render() {
    let collaborators = [
      {
        name: '小强',
        email: '214402@qq.com',
        avatar_url: '你好饿',
        contact_email: 'adbd'
      }
    ];

    let options = [
      {
        id: '1111',
        name: '未开始',
        color: '#e3f9f6',
      },
      {
        id: '2222',
        name: '进行中',
        color: '#ff7500',
      },
      {
        id: '3333',
        name: '待评审',
        color: '#eaff56',
      },
      {
        id: '4444',
        name: '已评审',
        color: '#faff72',
      },
      {
        id: '5555',
        name: '完成',
        color: '#00e500',
      },
    ];
    return (
      <div className="app">
        <header className="app-header">
          <h1 className="text-center">{'seatable ui component test'}</h1>
        </header>
        <div className="app-body">
          <div>
            <h2>collaborators测试</h2>
            <div>单个collaborators测试</div>
            <CollaboratorFormatter value={'123'} collaborators={collaborators} />
            <div>多个collaborators测试</div>
            <CollaboratorFormatter value={['123', '4567']} collaborators={collaborators} />
            <div>带删除按钮测试</div>
            <CollaboratorFormatter 
              containerClassName='collaborator-container'
              value={['123', '4567']} 
              collaborators={collaborators} 
              enableDeleteCollaborator={true} 
              onDeleteCollaborator={this.onDeleteCollaborator}
            />
          </div>
          <div>
            <h2>single-select测试</h2>
            <SingleSelectFormatter value={'3333'} options={options}/>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
