// log.js
let actionLog = [];

function logAction(type, value, row, col) {
  actionLog.unshift({
    type: type,
    value: value,
    row: row,
    col: col,
    timestamp: new Date(),
  });
}

function updateActionLog() {
  const logElem = document.querySelector("#action-log ul");
  if (logElem) {
    // Limpia la lista actual
    logElem.innerHTML = "";

    // Crea un nuevo elemento de lista para cada acción en el registro
    let totalActions = actionLog.length;

    for (let action of actionLog) {
      const li = document.createElement("li");
      li.textContent = `Mov. ${totalActions--} - ${action.type}: ${
        action.value
      } en ${action.row + 1}x${action.col + 1}`;
      logElem.appendChild(li);
    }
  }
}
