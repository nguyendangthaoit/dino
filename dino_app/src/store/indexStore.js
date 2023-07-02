// import createHistory from 'history/createBrowserHistory';
import {  createStore } from 'redux';
import rootReducer from '../reducer/index';

// export const history = createHistory();

// export function configureStore() {
//     return createStore(rootReducer );
// }
export const configureStore= createStore(rootReducer );



