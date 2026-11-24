import React from 'react';
import UserRegistrationForm from './components/UserRegistrationForm';
import UserRegistrationFormWithValidation from './components/UserRegistrationFormWithValidation';
import ContactFormUncontrolled from './components/ContactFormUncontrolled';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Практическая работа №17: Формы в React</h1>
      </header>

      <main style={{ paddingBottom: '50px' }}>
        <UserRegistrationForm />
        <hr style={{ margin: '40px 0' }} />
        <UserRegistrationFormWithValidation />
        <hr style={{ margin: '40px 0' }} />
        <ContactFormUncontrolled />
      </main>
    </div>
  );
}

export default App;