// src/App.tsx
import React from 'react';
import { ApolloProvider } from '@apollo/client';
import client from './graphql/client';
import TaskBoard from './components/TaskBoard';
import './App.css';

function App() {
  return (
    <ApolloProvider client={client}>
      <div className="App">
        <TaskBoard />
      </div>
    </ApolloProvider>
  );
}

export default App;