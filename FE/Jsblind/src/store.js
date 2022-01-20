import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from '@redux-saga/core';
import logger from 'redux-logger';
// import { rootReducer } from 'src/common/redux/reducers';
import { createBrowserHistory } from 'history';
import history from 'utils/history';
// import rootWatcher from 'src/common/redux/saga/rootSaga';
import { rootReducer } from 'redux/reducers/rootReducer';
import rootWatcher from 'redux/saga/rootSaga';

const sagaMiddleware = createSagaMiddleware({
  context: { history: history },
});
const initialState = {};

const store = configureStore({
  reducer: rootReducer,
  middleware: [sagaMiddleware, logger],
  devTools: true,
  preloadedState: initialState,
});

sagaMiddleware.run(rootWatcher);

export default store;
