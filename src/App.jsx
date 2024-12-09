// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import BookingCalendar from './components/BookingCalendar';
import PatientSearch from './components/PatientSearch';
import AppointmentConfirmation from './components/AppointementsConfirmation';  

import PatientForm from './components/PatientForm';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/booking" element={<BookingCalendar />} />
        <Route path="/patient-search" element={<PatientSearch />} />
        <Route path="/confirmation" element={<AppointmentConfirmation/>} />  

        <Route path="/patient-form" element={<PatientForm />} />
      </Routes>
    </Router>
  );
}

export default App;