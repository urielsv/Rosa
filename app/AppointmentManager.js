const fs = require('fs');
const path = require('path');

class AppointmentManager {
  constructor() {
    this.appointments = [];
    this.loadAppointments();
  }

  loadAppointments() {
    const data = fs.readFileSync(path.resolve(__dirname, '../manager/src/appointments.json'));
    this.appointments = JSON.parse(data);
  }

  createAppointment(chatId, url, name, id, symptoms, pain, type) {
    const appointment = {
      chatId,
      url,
      name,
      id,
      symptoms,
      pain,
      type
    };
    this.appointments.push(appointment);
    this.saveAppointments();
  }

  sendAppointment(index) {
    const appointment = this.appointments[index];
    // Logic to send the appointment goes here
    // This could be an API call, an email, etc.
  }

  saveAppointments() {
    fs.writeFileSync(path.resolve(__dirname, '../manager/src/appointments.json'), JSON.stringify(this.appointments));
  }
}
module.exports = AppointmentManager; 