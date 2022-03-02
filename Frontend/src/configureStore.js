import { createStore } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import reducers from "./Redux_Store/reducers/index";

const persistConfig = {
    key: 'root',
    storage,
}

const persistedReducer = persistReducer(persistConfig, reducers)

const getStore=() => {
    let store = createStore(persistedReducer)
    let persistor = persistStore(store)
    return { store, persistor }
}
export default getStore