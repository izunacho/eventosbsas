#!/usr/bin/env node
// Elimina de data/events.json los eventos cuya fecha de fin (dateEnd) ya paso.
// Usa la misma regla que el front-end (relDate en index.html): un evento
// esta "Finalizado" cuando daysDiff(dateEnd) < 0.
const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '..', 'data', 'events.json');
const events = JSON.parse(fs.readFileSync(file, 'utf8'));

const today = new Date();
today.setHours(0, 0, 0, 0);

function daysDiff(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return Math.floor((d - today) / 86400000);
}

const kept = events.filter(ev => daysDiff(ev.dateEnd) >= 0);
const removed = events.filter(ev => daysDiff(ev.dateEnd) < 0);

if (removed.length > 0) {
  fs.writeFileSync(file, JSON.stringify(kept, null, 2) + '\n');
  console.log(`Eliminados ${removed.length} evento(s) finalizado(s):`);
  removed.forEach(ev => console.log(`  - [${ev.id}] ${ev.title} (hasta ${ev.dateEnd})`));
} else {
  console.log('No hay eventos finalizados para eliminar.');
}
