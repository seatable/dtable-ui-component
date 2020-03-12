import React from 'react';
import { CollaboratorFormatter } from './components/cell-formatter';
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
              value={['123', '4567']} 
              collaborators={collaborators} 
              enableDeleteCollaborator={true} 
              onDeleteCollaborator={this.onDeleteCollaborator}
            />
          </div>

        </div>
      </div>
    );
  }
}

export default App;
