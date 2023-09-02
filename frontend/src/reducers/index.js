import { combineReducers } from 'redux';
import { userReducer } from './userReducer';

const rootReduder = combineReducers({
  user: userReducer,
});

export default rootReduder;
