import { PIN_TYPES } from "./definitions.js";

function parsePins(definitions) {
    const result = [];

    definitions.split(',').forEach((definition, index) => {
        const pin = definition.split('/');
        const number = index + 1;
        if (pin.length === 1) {
            switch (pin[0]) {
                case "N":
                    result.push({
                        number: number,
                        name: "NC",
                        type: PIN_TYPES.NC
                    });
                    break;
                case "G":
                    result.push({
                        number: number,
                        name: "GND",
                        type: PIN_TYPES.GND
                    });
                    break;
                case "V":
                    result.push({
                        number: number,
                        name: "VCC",
                        type: PIN_TYPES.VCC
                    });
                    break;
            }
        } else if (pin.length === 2) {
            const inverted = pin[0][0] === "-";
            const pinName = inverted ? pin[0].substring(1) : pin[0];
            result.push({
                name: pinName,
                number: index + 1,
                type: pin[1] === "i" ? PIN_TYPES.INPUT : PIN_TYPES.OUTPUT,
                inverted: inverted
            });
        }
    });

    return result;
}

function newIC(id, name, pinDefinitions, datasheet, update, aliases) {
    const result = {
        id,
        name,
        aliases,
        pins: parsePins(pinDefinitions),
        pin(name) {
            return this.pins.find(pin => pin.name === name);
        },
        setStates(pins, states) {
            if (pins.length !== states.length) return;

            for (let index = 0; index < pins.length; index++) {
                this.pin(pins[index]).state = states[index];
            }
        },
        datasheet,
        update
    };
    result.pins.forEach(pin => { if (pin.type === PIN_TYPES.INPUT) pin.state = false; });
    result.update(result.pins);
    return result;
}

function nandSet(y, ...inputs) {
    let result = true;
    inputs.forEach(input => result = result && input.state);
    y.state = !(result);
}

function andSet(y, ...inputs) {
    let result = true;
    inputs.forEach(input => result = result && input.state);
    y.state = result;
}

function norSet(y, ...inputs) {
    let result = false;
    inputs.forEach(input => result = result || input.state);
    y.state = !(result);
}

function orSet(y, ...inputs) {
    let result = false;
    inputs.forEach(input => result = result || input.state);
    y.state = result;
}

function xorSet(y, a, b) {
    y.state = (a.state || b.state) && !(a.state && b.state);
}

function binaryToDecimal(...inputs) {
    let result = 0;
    inputs.forEach((pin, index) => result += Math.pow(2, index) * (pin.state ? 1 : 0));
    return result;
}

const ics = [];

ics.push(newIC("74x00", "4x2i NAND",
    "1A/i,1B/i,1Y/o,2A/i,2B/i,2Y/o,G,3Y/o,3A/i,3B/i,4Y/o,4A/i,4B/i,V",
    "http://www.ti.com/lit/ds/symlink/sn74ls00.pdf",
    function () {
        for (let index = 1; index <= 4; index++) {
            nandSet(this.pin(index + "Y"), this.pin(index + "A"), this.pin(index + "B"));
        }
    }
));

ics.push(newIC("74x02", "4x2i NOR",
    "1Y/o,1A/i,1B/i,2Y/o,2A/i,2B/i,G,3A/i,3B/i,3Y/o,4A/i,4B/i,4Y/o,V",
    "http://www.ti.com/lit/ds/symlink/sn74ls02.pdf",
    function () {
        for (let index = 1; index <= 4; index++) {
            norSet(this.pin(index + "Y"), this.pin(index + "A"), this.pin(index + "B"));
        }
    }
));

ics.push(newIC("74x04", "6x1i INVERTER",
    "1A/i,1Y/o,2A/i,2Y/o,3A/i,3Y/o,G,4Y/o,4A/i,5Y/o,5A/i,6Y/o,6A/i,V",
    "http://www.ti.com/lit/ds/symlink/sn74ls04.pdf",
    function () {
        for (let index = 1; index <= 6; index++) {
            this.pin(index + "Y").state = !this.pin(index + "A").state;
        }
    }
));

ics.push(newIC("74x08", "4x2i AND",
    "1A/i,1B/i,1Y/o,2A/i,2B/i,2Y/o,G,3Y/o,3A/i,3B/i,4Y/o,4A/i,4B/i,V",
    "http://www.ti.com/lit/ds/symlink/sn74ls08.pdf",
    function () {
        for (let index = 1; index <= 4; index++) {
            andSet(this.pin(index + "Y"), this.pin(index + "A"), this.pin(index + "B"));
        }
    }
));

ics.push(newIC("74x10", "3x3i NAND",
    "1A/i,1B/i,2A/i,2B/i,2C/i,2Y/o,G,3Y/o,3A/i,3B/i,3C/i,1Y/o,1C/i,V",
    "http://www.ti.com/lit/ds/symlink/sn74ls10.pdf",
    function () {
        for (let index = 1; index <= 3; index++) {
            nandSet(this.pin(index + "Y"), this.pin(index + "A"), this.pin(index + "B"), this.pin(index + "C"));
        }
    }
));

ics.push(newIC("74x11", "3x3i AND",
    "1A/i,1B/i,2A/i,2B/i,2C/i,2Y/o,G,3Y/o,3A/i,3B/i,3C/i,1Y/o,1C/i,V",
    "http://www.ti.com/lit/ds/symlink/sn74ls11.pdf",
    function () {
        for (let index = 1; index <= 3; index++) {
            andSet(this.pin(index + "Y"), this.pin(index + "A"), this.pin(index + "B"), this.pin(index + "C"));
        }
    }
));

ics.push(newIC("74x17", "6x Buffer",
    "1A/i,1Y/o,2A/i,2Y/o,3A/i,3Y/o,G,4Y/o,4A/i,5Y/o,5A/i,6Y/o,6A/i,V",
    "http://www.ti.com/lit/ds/symlink/sn7417.pdf",
    function () {
        for (let index = 1; index <= 6; index++) {
            this.pin(index + "Y").state = this.pin(index + "A").state;
        }
    }
));

ics.push(newIC("74x18", "2x4i NAND",
    "1A/i,1B/i,N,1C/i,1D/i,1Y/o,G,2Y/o,2A/i,2B/i,N,2C/i,2D/i,V",
    "https://archive.org/stream/bitsavers_tidataBookVol2_45945352/1985_The_TTL_Data_Book_Vol_2#page/n149/mode/2up",
    function () {
        for (let index = 1; index <= 2; index++) {
            nandSet(this.pin(index + "Y"), this.pin(index + "A"), this.pin(index + "B"), this.pin(index + "C"), this.pin(index + "D"));
        }
    }
));

ics.push(newIC("74x21", "2x4i AND",
    "1A/i,1B/i,N,1C/i,1D/i,1Y/o,G,2Y/o,2A/i,2B/i,N,2C/i,2D/i,V",
    "http://www.ti.com/lit/ds/symlink/sn74ls21.pdf",
    function () {
        for (let index = 1; index <= 2; index++) {
            andSet(this.pin(index + "Y"), this.pin(index + "A"), this.pin(index + "B"), this.pin(index + "C"), this.pin(index + "D"));
        }
    }
));

ics.push(newIC("74x25", "2x4i NOR with Strobe",
    "1A/i,1B/i,1G/i,1C/i,1D/i,1Y/o,G,2Y/o,2A/i,2B/i,2G/i,2C/i,2D/i,V",
    "http://www.ti.com/lit/ds/symlink/sn5425.pdf",
    function () {
        for (let index = 1; index <= 2; index++) {
            if (!this.pin(index + "G").state) {
                this.pin(index + "Y").state = true;
            } else {
                norSet(this.pin(index + "Y"), this.pin(index + "A"), this.pin(index + "B"), this.pin(index + "C"), this.pin(index + "D"));
            }
        }
    }
));

ics.push(newIC("74x27", "3x3i NOR",
    "1A/i,1B/i,2A/i,2B/i,2C/i,2Y/o,G,3Y/o,3A/i,3B/i,3C/i,1Y/o,1C/i,V",
    "http://www.ti.com/lit/ds/symlink/sn74ls27.pdf",
    function () {
        for (let index = 1; index <= 3; index++) {
            norSet(this.pin(index + "Y"), this.pin(index + "A"), this.pin(index + "B"), this.pin(index + "C"));
        }
    }
));

ics.push(newIC("74x30", "1x8i NAND",
    "A/i,B/i,C/i,D/i,E/i,F/i,G,Y/o,N,N,G/i,H/i,N,V",
    "http://www.ti.com/lit/ds/symlink/sn74ls30.pdf",
    function () {
        nandSet(this.pin("Y"), this.pin("A"), this.pin("B"), this.pin("D"), this.pin("E"), this.pin("F"), this.pin("G"), this.pin("H"));
    }
));

ics.push(newIC("74x32", "4x2i OR",
    "1A/i,1B/i,1Y/o,2A/i,2B/i,2Y/o,G,3Y/o,3A/i,3B/i,4Y/o,4A/i,4B/i,V",
    "http://www.ti.com/lit/ds/symlink/sn74ls32.pdf",
    function () {
        for (let index = 1; index <= 4; index++) {
            orSet(this.pin(index + "Y"), this.pin(index + "A"), this.pin(index + "B"));
        }
    }
));

ics.push(newIC("74x36", "4x2i NOR",
    "1A/i,1B/i,1Y/o,2A/i,2B/i,2Y/o,G,3Y/o,3A/i,3B/i,4Y/o,4A/i,4B/i,V",
    "https://archive.org/stream/bitsavers_tidataBookogicDataBook_23574286/1984_High-speed_CMOS_Logic_Data_Book#page/n81/mode/2up",
    function () {
        for (let index = 1; index <= 4; index++) {
            norSet(this.pin(index + "Y"), this.pin(index + "A"), this.pin(index + "B"));
        }
    }
));

const _74x42data = [
    [false, true, true, true, true, true, true, true, true, true],
    [true, false, true, true, true, true, true, true, true, true],
    [true, true, false, true, true, true, true, true, true, true],
    [true, true, true, false, true, true, true, true, true, true],
    [true, true, true, true, false, true, true, true, true, true],
    [true, true, true, true, true, false, true, true, true, true],
    [true, true, true, true, true, true, false, true, true, true],
    [true, true, true, true, true, true, true, false, true, true],
    [true, true, true, true, true, true, true, true, false, true],
    [true, true, true, true, true, true, true, true, true, false],
    [true, true, true, true, true, true, true, true, true, true],
    [true, true, true, true, true, true, true, true, true, true],
    [true, true, true, true, true, true, true, true, true, true],
    [true, true, true, true, true, true, true, true, true, true],
    [true, true, true, true, true, true, true, true, true, true],
    [true, true, true, true, true, true, true, true, true, true]
];

ics.push(newIC("74x42", "BCD>Decimal Decoder",
    "0/o,1/o,2/o,3/o,4/o,5/o,6/o,G,7/o,8/o,9/o,D/i,C/i,B/i,A/i,V",
    "http://www.ti.com/lit/ds/symlink/sn74ls32.pdf",
    function () {
        const decimalValue = binaryToDecimal(this.pin("A"), this.pin("B"), this.pin("C"), this.pin("D"));
        const outputs = _74x42data[decimalValue];
        outputs.forEach((value, index) => this.pin(index.toString()).state = value);
    }
));

const _7SegDecoderData = [
    [true, true, true, true, true, true, false], // 0
    [false, true, true, false, false, false, false], // 1
    [true, true, false, true, true, false, true], // 2
    [true, true, true, true, false, false, true], // 3
    [false, true, true, false, false, true, true], // 4
    [true, false, true, true, false, true, true], // 5
    [false, false, true, true, true, true, true], // 6
    [true, true, true, false, false, false, false], // 7
    [true, true, true, true, true, true, true], // 8
    [true, true, true, false, false, true, true], // 9
    [false, false, false, true, true, false, true], // 10
    [false, false, true, true, false, false, true], // 11
    [false, true, false, false, false, true, true], // 12
    [true, false, false, true, false, true, true], // 13
    [false, false, false, true, true, true, true], // 14
    [false, false, false, false, false, false, false], // 15
    [true, true, true, true, true, true, true], // Lamp test
];

ics.push(newIC("74x49", "BCD>7Seg Decoder",
    "B/i,C/i,-BI/i,D/i,A/i,e/o,G,d/o,c/o,b/o,a/o,g/o,f/o,V",
    "http://www.ti.com/lit/ds/symlink/sn74ls47.pdf",
    function () {
        const decimalValue = this.pin("BI").state ? 15 : binaryToDecimal(this.pin("A"), this.pin("B"), this.pin("C"), this.pin("D"));
        const outputs = _7SegDecoderData[decimalValue];
        this.setStates(["a", "b", "c", "d", "e", "f", "g"], outputs);
    }
));

ics.push(newIC("74x48", "BCD>7Seg Decoder",
    "B/i,C/i,-LT/i,-BI/i,-RBI/i,D/i,A/i,G,e/o,d/o,c/o,b/o,a/o,g/o,f/o,V",
    "http://www.ti.com/lit/ds/symlink/sn74ls47.pdf",
    function () {
        let decimalValue = 15;
        if (!this.pin("BI").state) {
            decimalValue = !this.pin("LT").state ? 16 :  binaryToDecimal(this.pin("A"), this.pin("B"), this.pin("C"), this.pin("D"));
        }
        const outputs = _7SegDecoderData[decimalValue];
        this.setStates(["a", "b", "c", "d", "e", "f", "g"], outputs);
    }
));

ics.push(newIC("74x86", "4x2i XOR",
    "1A/i,1B/i,1Y/o,2A/i,2B/i,2Y/o,G,3Y/o,3A/i,3B/i,4Y/o,4A/i,4B/i,V",
    "http://www.ti.com/lit/ds/symlink/sn74ls86a.pdf",
    function() {
        for (let index = 1; index <= 4; index++) {
            xorSet(this.pin(index + "Y"), this.pin(index + "A"), this.pin(index + "B"));
        }
    }
));

ics.push(newIC("74x64", "4-2-3-2 AND-OR-INVERT",
    "A/i,E/i,F/i,G/i,H/i,I/i,G,Y/o,J/i,K/i,B/i,C/i,D/i,V",
    "http://www.ti.com/lit/ds/symlink/sn54s64.pdf",
    function() {
        const _A = this.pin("A").state && this.pin("B").state && this.pin("C").state && this.pin("D").state;
        const _B = this.pin("E").state && this.pin("F").state;
        const _C = this.pin("G").state && this.pin("H").state && this.pin("I").state;
        const _D = this.pin("J").state && this.pin("K").state;
        this.pin("Y").state = !(_A || _B || _C || _D);
    }
));

ics.push(newIC("74x541", "8x Buffer 3-State",
    "-G1/i,A1/i,A2/i,A3/i,A4/i,A5/i,A6/i,A7/i,A8/i,G,Y8/o,Y7/o,Y6/o,Y5/o,Y4/o,Y3/o,Y2/o,Y1/o,-G2/i,V",
    "http://www.ti.com/lit/ds/symlink/sn54ls541.pdf",
    function() {
        const enabled = !(this.pin("G1").state || this.pin("G2").state);
        for (let index = 1; index <= 8; index++) {
            this.pin("Y" + index).state = enabled && this.pin("A" + index).state;
        }
    }
));

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

// const _74x151Ydata = [
//     [ true, false, false, false, false, false, false, false ], // 0
//     [ false, true, false, false, false, false, false, false ], // 1
//     [ false, false, true, false, false, false, false, false ], // 2
//     [ false, false, false, true, false, false, false, false ], // 3
//     [ false, false, false, false, true, false, false, false ], // 4
//     [ false, false, false, false, false, true, false, false ], // 5
//     [ false, false, false, false, false, false, true, false ], // 6
//     [ false, false, false, false, false, false, false, true ], // 7
//     [ false, false, false, false, false, false, false, false ] // all off - strobe
// ];
// ics.push(newIC("74x151", "8>1 Selector",
//     "D3/o,D2/o,D1/o,D0/o,Y/i,W/i,-G/i,G,C/i,B/i,A/i,D7/o,D6/o,D5/o,D4/o,V",
//     "http://www.ti.com/lit/ds/symlink/sn74ls151.pdf",
//     function() {
//         let decimalValue = 8;
//         if (!this.pin("G").state) {
//             decimalValue = binaryToDecimal(this.pin("A"), this.pin("B"), this.pin("C"));
//         }


//     }
// ));



ics.sort((a, b) => {
    if (a.id < b.id)
        return -1;
    if (a.id > b.id)
        return 1;
    return 0;
});
export default ics;