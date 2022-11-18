import React from 'react';
import logo from './logo.svg';
import './App.css';
import { ttt } from '@models';

function App() {
  const t: ttt = {
    ttt: 'ffqqf',
    fff: 'fff'
  }

  console.log(t)

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React 333333333
        </a>
      </header>
    </div>
  );
}

export default App;
