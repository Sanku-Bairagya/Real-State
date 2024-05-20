import { combineReducers, configureStore } from '@reduxjs/toolkit'
import storage from 'redux-persist/lib/storage';
import  userReducer  from './user/userSlice';
import { persistReducer } from 'redux-persist';
import persistStore from 'redux-persist/es/persistStore';



const rootReducer = combineReducers({user:userReducer})

const persistConfig = {
  key:'root',
  storage,
  version:1
}

const persistedReducer = persistReducer(persistConfig,rootReducer)


export const store = configureStore({
  reducer:persistedReducer,
  middleware:(getDeafultMiddleware) => 
    getDeafultMiddleware({
        serializableCheck:false,
    }),
  
});

export const persistor = persistStore(store);





