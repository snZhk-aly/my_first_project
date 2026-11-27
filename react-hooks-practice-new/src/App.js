import React from 'react';
import './App.css';
import BasicHooks from './components/BasicHooks';
import AdvancedHooks from './components/AdvancedHooks';
import CustomHooks from './components/CustomHooks';
import HooksTests from './components/HooksTests';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Практическая работа №16: Хуки в React</h1>
      </header>

      <main className="App-main">
        <BasicHooks />
        <AdvancedHooks />
        <CustomHooks />
        <HooksTests />
      </main>
    </div>
  );
}

export default App;