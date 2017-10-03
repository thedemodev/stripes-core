import { reducer as form } from 'redux-form';
import okapiReducer from './okapiReducer';
import { discoveryReducer } from './discoverServices';
import stripesReducer from './stripesReducer';

export default {
  // TODO: here's where you'd pull in a reducer to handle Okapi actions like auth
  okapi: okapiReducer,
  discovery: discoveryReducer,
  stripes: stripesReducer,
  form,
};
