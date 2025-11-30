import { RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store/store';
import router from './routes';
import { UIProvider } from './components/providers/UIProvider';

function App() {
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <UIProvider>
                    <RouterProvider router={router} />
                </UIProvider>
            </PersistGate>
        </Provider>
    );
}

export default App;
