import buffers from "./definitions/buffers.js";
import decoders from "./definitions/decoders.js";
import latches from "./definitions/latches.js";
import logic from  "./definitions/logic.js";
import selectors from "./definitions/selectors.js";

const ics = [].concat(buffers, decoders, latches, logic, selectors);

ics.sort((a, b) => {
    if (a.id < b.id)
        return -1;
    if (a.id > b.id)
        return 1;
    return 0;
});
export default ics;