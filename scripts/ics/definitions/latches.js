const _74x373state = [ false, false, false, false, false, false, false, false ];
ics.push(newIC("74x373", "8xD-Flip-Flop",
    "-OC/i,1Q/o,1D/i,2D/i,2Q/o,3Q/o,3D/i,4D/i,4Q/o,G,C/i,5Q/o,5D/i,6D/i,6Q/o,7Q/o,7D/i,8D/i,8Q/o,V",
    "http://www.ti.com/lit/ds/symlink/sn54ls373.pdf",
    function() {
        const enabled = !this.pin("OC").state;
        if (this.pin("C").state) {
            for (let index = 1; index <= 8; index++) {
                _74x373state[index - 1] = this.pin(index + "D").state;
            }
        }

        this.setStates(_74x373state.map((_, index) => (index + 1) + "Q"), _74x373state.map(value => value && enabled));
    }
));

const _62256state = [ ];
const _62256outputNames = [...Array(8).keys()].map(index => "IO" + index);
let _62256outputs;
const _62256addresses = [...Array(15).keys()].map(index => "A" + index);
// ics.push("62256", "32Kx8 Statis RAM",
//     "A14/i,A12/i,A7/i,A6/i,A5/i,A4/i,A3/i,A2/i,A1/i,A0/i,IO0/o,IO1/o,IO2/o,G,IO3/o,IO4/o,IO5/o,IO6/o,IO7/o,-CS/i,A10/i,-OE/i,A11/i,A9/i,A8/i,A13/i,-WE/i,V",
//     "http://pdf.datasheetcatalog.com/datasheets/166/177036_DS.pdf",
//     function(changedPin) {
//         if (!_62256outputs) {
//             _62256outputs = _62256outputNames.map(pinName => this.pin(pinName));
//         }
//         const outputs = [ false, false, false, false, false, false, false, false ];
//         if (!this.pin("CS").state || (this.pin("OE").state && this.pin("WE").state))  {
//             _62256outputs.forEach(pin => pin.type = PIN_TYPES.OUTPUT);
//             this.setStates(_62256outputs, outputs);
//         } else {
//             const address = binaryToDecimal(_62256addresses.map(name => this.pin(name)));
//             if (!this.pin("WE").state) {
//                 _62256outputs.forEach(pin => pin.type = PIN_TYPES.INPUT);
//                 _62256state[address] = _62256outputs.map(pin => pin.state);
//             } else if (!this.pin("OE").state) {
//                 _62256outputs.forEach(pinName => this.pin(pinName).type = PIN_TYPES.OUTPUT);

//             }
//         }
//     }
// );
