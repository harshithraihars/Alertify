const Agenda=require("agenda")
const agenda = new Agenda({
  db: { address: process.env.MONGO_URI, collection: "agendaJobs" },
  processEvery: "30 seconds",
  maxConcurrency: 3,
  defaultConcurrency: 1 // 🧠 only one "check product price" at a time
});

module.exports = agenda;