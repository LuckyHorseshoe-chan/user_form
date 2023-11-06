import React from 'react';
import { ChakraProvider } from '@chakra-ui/react'
import { Provider } from 'react-redux'
import Form from './components/Form';
import { store } from './store'
import './App.css';

function App() {
  return (
    <ChakraProvider>
      <Provider store={store}>
        <div className="App">
          <Form/>
        </div>
      </Provider>
    </ChakraProvider>
  );
}

export default App;
