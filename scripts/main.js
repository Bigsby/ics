import ics from "./ics.js";
import drawIC from "./canvas-ui.js";

const container = document.getElementById("appContainer");

ics.forEach(ic => drawIC(ic, container));