import React from 'react';
import { ChakraProvider } from '@chakra-ui/react'
import { Provider } from 'react-redux'
import Form from './components/Form';
import MobileForm from './components/MobileForm';
import { store } from './store'
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';
import './App.css';

function App() {
  return (
    <ChakraProvider>
      <Provider store={store}>
        <Router>
          <Routes>
            <Route path="/" element={<Form/>} />
            <Route path="/mobile" element={<MobileForm/>} />
          </Routes>
        </Router>
      </Provider>
    </ChakraProvider>
  );
}

export default App;
