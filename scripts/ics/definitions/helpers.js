export const PIN_TYPES = {
    INPUT: "input",
    OUTPUT: "output",
    INPUT_OUTPUT: "input_output",
    CLOCK: "clock",
    CLOCK_R: "clock-raising",
    CLOCK_F: "clock-falling",
    GND: "GND",
    VCC: "VCC",
    NC: "NC",
    UNK: "UNK"
};

export const IC_TYPES = {
    BUFFER: "buffer",
    LOGIC: "logic",
    LATCH: "latch",
    SELECTOR: "selector",
    DECODER: "decoder",
    ARITHEMATIC: "arithmetic",
    COUNTER: "counter"
};

const INPUT_PIN_TYPES = [
    PIN_TYPES.INPUT,
    PIN_TYPES.INPUT_OUTPUT,
    PIN_TYPES.CLOCK,
    PIN_TYPES.CLOCK_F,
    PIN_TYPES.CLOCK_R
];

// pin standard shortcut definitions:
// V = VCC|v
// G = GND|g
// N = NC|n

// nomal definition: name|type
// types:
// i = input
// o = outpu
// io = input and output
// cr = clock on raising-edge
// cf = clock on falling-edge
// g = ground
// v = Voltage common collector
// n = not connected

class Pin {
    constructor(number, name, type, inverted, definition, description) {
        this.number = number;
        this.name = name;
        this.type = type;
        this.definition = definition;
        this.inverted = !!inverted;
        this.state = false;
        this.description = description;
        if (this.type === PIN_TYPES.INPUT) {
            this.state = this.inverted;
        }
    }

    

    acceptInput() {
        return INPUT_PIN_TYPES.includes(this.type);
    }

    is(name) {
        return this.name === name;
    }
}

function parsePinType(type) {
    switch (type) {
        case "i": return PIN_TYPES.INPUT;
        case "o": return PIN_TYPES.OUTPUT;
        case "io": return PIN_TYPES.INPUT_OUTPUT;
        case "cr": return PIN_TYPES.CLOCK_R;
        case "cf": return PIN_TYPES.CLOCK_F;
        case "g": return PIN_TYPES.GND;
        case "v": return PIN_TYPES.VCC;
        case "n": return PIN_TYPES.NC;
    }
}

function parsePin(definition, number) {
    const values = definition.split("|");
    if (values.length === 1) { // standard pins
        switch (values[0]) {
            case "N": return new Pin(number, "NC", PIN_TYPES.NC, false, definition, "Not connected");
            case "G": return new Pin(number, "GND", PIN_TYPES.GND, false, definition, "Ground (0v)");
            case "V": return new Pin(number, "VCC", PIN_TYPES.VCC, false, definition, "Voltage Common Collector");
        }
    } else if (values.length === 2) {
        const inverted = values[0][0] === "-";
        const pinName = inverted ? values[0].substring(1) : values[0];
        return new Pin(number, pinName, parsePinType(values[1]), inverted, definition);
    } else {
        return new Pin(number, "UNK", PIN_TYPES.UNK, false, definition);
    }
}

function parsePins(definitions) {
    return definitions.split(',').map((definition, index) => parsePin(definition, index + 1));
}

export class IC {
    constructor(id, name, type, datasheet, pins, update, optionals) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.datasheet = datasheet;
        this.pins = parsePins(pins);
        this.pinCount = this.pins.length;
        this.update = typeof update === "function" ? update : () => { };
        Object.assign(this, optionals);
        if (this.descriptions) {
            for (const pinName in this.descriptions) {
                const pin = this.pin(pinName);
                if (pin) {
                    pin.description = this.descriptions[pinName];
                } else {
                    console.error("unable to find pin for descriptinos " + pinName + " for " + id);
                }
            }
        }
        if (typeof this.initialize === "function") {
            this.initialize();
        }
        this.update();
    }

    static get TYPES() { return IC_TYPES; }

    pin(name) {
        return this.pins.find(pin => pin.name === name);
    }

    setStates(pins, states) {
        if (pins.length !== states.length) return;

        for (let index = 0; index < pins.length; index++) {
            pins[index].state = states[index];
        }
    }

    setStatesByName(pins, states) {
        if (pins.length !== states.length) return;

        for (let index = 0; index < pins.length; index++) {
            this.pin(pins[index]).state = states[index];
        }
    }
}

export function nandSet(y, ...inputs) {
    let result = true;
    inputs.forEach(input => result = result && input.state);
    y.state = !(result);
}

export function andSet(y, ...inputs) {
    let result = true;
    inputs.forEach(input => result = result && input.state);
    y.state = result;
}

export function norSet(y, ...inputs) {
    let result = false;
    inputs.forEach(input => result = result || input.state);
    y.state = !(result);
}

export function orSet(y, ...inputs) {
    let result = false;
    inputs.forEach(input => result = result || input.state);
    y.state = result;
}

export function xorSet(y, a, b) {
    y.state = (a.state || b.state) && !(a.state && b.state);
}

export function not(...inputs) {
    return inputs.map(pin => !pin.state);
}

export function notSet(outputs, inputs) {
    if (outputs.length !== inputs.length) {
        return;
    }
    for (let index = 0; index < outputs.length; index++) {
        outputs[index].state = !inputs[index].state;
    }
}

export function binaryToDecimal(...inputs) {
    let result = 0;
    inputs.forEach((pin, index) => result += Math.pow(2, index) * (pin.state ? 1 : 0));
    return result;
}

export function decimalToBinary(value, bitCount, lsb) {
    const result = [];
    for (let bit = 0; bit < bitCount; bit++) {
        const bitValue = value & 1 === 1;
        if (lsb) {
            result.push(bitValue);
        } else {
            result.unshift(bitValue);
        }

        value = value >> 1;
    }
    return result;
}