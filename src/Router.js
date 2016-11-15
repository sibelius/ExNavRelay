// @flow

import {
  createRouter,
} from '@exponent/ex-navigation';

import UserList from './UserList';
import UserDetail from './UserDetail';

const Router = createRouter(() => ({
  userList: () => UserList,
  userDetail: () => UserDetail,
}));

export default Router;
