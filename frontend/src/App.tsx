import React from 'react';
import { ChakraProvider } from '@chakra-ui/react'
import Form from './components/Form';
import './App.css';

function App() {
  return (
    <ChakraProvider>
      <div className="App">
        <Form/>
      </div>
    </ChakraProvider>
  );
}

export default App;
