const Agenda=require("agenda")
const agenda = new Agenda({
  db: { address: process.env.MONGO_URI, collection: "agendaJobs" },
  processEvery: "30 seconds", // polling interval
  maxConcurrency: 3, // how many jobs run at the same time
});

module.exports = agenda;