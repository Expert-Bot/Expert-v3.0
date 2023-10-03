async function loadButtons(client) {
  const { loadFiles } = require("../../Structures/Functions/FileLoader/FileLoader.js");
  const ascii = require("ascii-table");
  const table = new ascii("Buttons List");

  const Files = await loadFiles("Buttons");

  Files.forEach((file) => {
    const button = require(file);
    if (!button.id) return;

    client.buttons.set(button.id, button);
    table.setHeading(`Button ID`, `Status`);
    table.addRow(`${button.id}`, "🟩 Success");
  });

  return console.log(table.toString())
}

module.exports = { loadButtons };