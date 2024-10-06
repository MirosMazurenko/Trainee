import React from 'react';
import ContactForm from './components/ContactForm';
import ContactTable from './components/ContactTable';

const App = () => {
  return (
    <div>
      <h1>Contact Manager</h1>
      <ContactForm />
      <ContactTable />
    </div>
  );
};

export default App;