import { PIN_TYPES } from "./definitions.js";

function parsePins(definitions) {
    const result = [];

    definitions.split(',').forEach(definition => {
        const pin = definition.split('/');
        if (pin.length === 1) {
            switch (pin[0]) {
                case "N":
                    result.push({
                        name: "NC",
                        type: PIN_TYPES.NC
                    });
                    break;
                case "G":
                    result.push({
                        name: "GND",
                        type: PIN_TYPES.GND
                    });
                    break;
                case "V":
                    result.push({
                        name: "VCC",
                        type: PIN_TYPES.VCC
                    });
                    break;
            }
        } else if (pin.length === 2) {
            result.push({
                name: pin[0],
                type: pin[1] === "i" ? PIN_TYPES.INPUT : PIN_TYPES.OUTPUT
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
        datasheet,
        update
    };
    result.pins.forEach(pin => { if (pin.type === PIN_TYPES.INPUT) pin.state = false; });
    result.update(result.pins);
    return result;
}

function nand(y, ...inputs) {
    let result = true;
    inputs.forEach(input => result = result && input.state);
    y.state = !(result);
}

function and(y, ...inputs) {
    let result = true;
    inputs.forEach(input => result = result && input.state);
    y.state = result;
}

function nor(y, ...inputs) {
    let result = false;
    inputs.forEach(input => result = result || input.state);
    y.state = !(result);
}

function or(y, ...inputs) {
    let result = false;
    inputs.forEach(input => result = result || input.state);
    y.state = result;
}

function xor(y, a, b) {
    y.state = (a.state || b.state) && !(a.state && b.state);
}

const ics = [];

ics.push(newIC("74x00", "4x2i NAND",
    "1A/i,1B/i,1Y/o,2A/i,2B/i,2Y/o,G,3Y/o,3A/i,3B/i,4Y/o,4A/i,4B/i,V",
    "http://www.ti.com/lit/ds/symlink/sn74ls00.pdf",
    function () {
        for (let index = 1; index <= 4; index++) {
            nand(this.pin(index + "Y"), this.pin(index + "A"), this.pin(index + "B"));
        }
    }
));

ics.push(newIC("74x02", "4x2i NOR",
    "1Y/o,1A/i,1B/i,2Y/o,2A/i,2B/i,G,3A/i,3B/i,3Y/o,4A/i,4B/i,4Y/o,V",
    "http://www.ti.com/lit/ds/symlink/sn74ls02.pdf",
    function () {
        for (let index = 1; index <= 4; index++) {
            nor(this.pin(index + "Y"), this.pin(index + "A"), this.pin(index + "B"));
        }
    }
));

ics.push(newIC("74x04", "6x1i NOT",
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
            and(this.pin(index + "Y"), this.pin(index + "A"), this.pin(index + "B"));
        }
    }
));

ics.push(newIC("74x10", "3x3i NAND",
    "1A/i,1B/i,2A/i,2B/i,2C/i,2Y/o,G,3Y/o,3A/i,3B/i,3C/i,1Y/o,1C/i,V",
    "http://www.ti.com/lit/ds/symlink/sn74ls10.pdf",
    function () {
        for (let index = 1; index <= 3; index++) {
            nand(this.pin(index + "Y"), this.pin(index + "A"), this.pin(index + "B"), this.pin(index + "C"));
        }
    }
));

ics.push(newIC("74x11", "3x3i AND",
    "1A/i,1B/i,2A/i,2B/i,2C/i,2Y/o,G,3Y/o,3A/i,3B/i,3C/i,1Y/o,1C/i,V",
    "http://www.ti.com/lit/ds/symlink/sn74ls11.pdf",
    function () {
        for (let index = 1; index <= 3; index++) {
            and(this.pin(index + "Y"), this.pin(index + "A"), this.pin(index + "B"), this.pin(index + "C"));
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
            nand(this.pin(index + "Y"), this.pin(index + "A"), this.pin(index + "B"), this.pin(index + "C"), this.pin(index + "D"));
        }
    }
));

ics.push(newIC("74x21", "2x4i AND",
    "1A/i,1B/i,N,1C/i,1D/i,1Y/o,G,2Y/o,2A/i,2B/i,N,2C/i,2D/i,V",
    "http://www.ti.com/lit/ds/symlink/sn74ls21.pdf",
    function () {
        for (let index = 1; index <= 2; index++) {
            and(this.pin(index + "Y"), this.pin(index + "A"), this.pin(index + "B"), this.pin(index + "C"), this.pin(index + "D"));
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
                nor(this.pin(index + "Y"), this.pin(index + "A"), this.pin(index + "B"), this.pin(index + "C"), this.pin(index + "D"));
            }
        }
    }
));

ics.push(newIC("74x27", "3x3i NOR",
    "1A/i,1B/i,2A/i,2B/i,2C/i,2Y/o,G,3Y/o,3A/i,3B/i,3C/i,1Y/o,1C/i,V",
    "http://www.ti.com/lit/ds/symlink/sn74ls27.pdf",
    function () {
        for (let index = 1; index <= 3; index++) {
            nor(this.pin(index + "Y"), this.pin(index + "A"), this.pin(index + "B"), this.pin(index + "C"));
        }
    }
));

ics.push(newIC("74x30", "1x8i NAND",
    "A/i,B/i,C/i,D/i,E/i,F/i,G,Y/o,N,N,G/i,H/i,N,V",
    "http://www.ti.com/lit/ds/symlink/sn74ls30.pdf",
    function () {
        nand(this.pin("Y"), this.pin("A"), this.pin("B"), this.pin("D"), this.pin("E"), this.pin("F"), this.pin("G"), this.pin("H"));
    }
));

export default ics;