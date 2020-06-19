import DTableWebAPI from 'dtable-web-api';


const config = {
  username: 'xuejin.zhang@seafile.com',
  password: '123456',
  server: 'https://dev.seafile.com/dtable-web',
}

const { server, username, password, APIToken } = config;
const dtableWebAPI = new DTableWebAPI();
dtableWebAPI.init({ server, username, password, token: APIToken });

dtableWebAPI.login();

export default dtableWebAPI;