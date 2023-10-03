async function loadModals(client) {
  const { loadFiles } = require("../Functions/fileLoader");
  const ascii = require("ascii-table");
  const table = new ascii("Modals List");
  
  const Files = await loadFiles("Modals");
  
  Files.forEach((file) => {
    const modal = require(file);
    if (!modal.id) return;

    client.modals.set(modal.id, modal);
    table.setHeading(`Modal ID`, `Status`);
    table.addRow(`${modal.id}`, "🟩 Success");
  });
  
  return console.log(table.toString())
}
  
module.exports = { loadModals };
