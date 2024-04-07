import './App.css';
import React, { useState, useEffect } from 'react';
import AppointmentCard from './components/AppointmentCard';
import appointmentsData from './appointments.json'; // Import your JSON file (TEMP)


function App() {
  const [appts, setAppts] = useState([])
  useEffect(() => {
    setAppts(appointmentsData);
  }, [])

  const deleteFirstAppointment = () => {
    setAppts(prevAppts => prevAppts.slice(1));
  }

  return (
    <div className="px-12">
        <h2 className="font-bold text-4xl">Rosa - Turnos virtuales</h2>
        {appts.map((appt, index) => (
          <AppointmentCard
            chatId={appt.chatId}
            url={appt.url}
            keyv={index + 1}
            name={appt.name}
            id={appt.id}
            symptoms={appt.symptoms}
            pain={appt.pain}
            type={appt.type}
            deleteFirstAppointment={deleteFirstAppointment}
          />
        ))}
    </div>
  );
}

export default App;
