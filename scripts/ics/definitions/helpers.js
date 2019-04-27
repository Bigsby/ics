export const PIN_TYPES = {
    INPUT: "input",
    OUTPUT: "output",
    INPUT_OUTPUT: "input_output",
    CLOCK: "clock",
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

class Pin {
    constructor(number, name, type, inverted, definition) {
        this.number = number;
        this.name = name;
        this.type = type;
        this.definition = definition;
        this.inverted = !!inverted;
        if (this.type === PIN_TYPES.INPUT) {
            this.state = this.inverted;
        } else {
            this.state = false;
        }
    }

    acceptInput() {
        return this.type === PIN_TYPES.INPUT || this.type === PIN_TYPES.INPUT_OUTPUT || this.type === PIN_TYPES.CLOCK;
    }
}

function parsePinType(type) {
    switch (type) {
        case "i": return PIN_TYPES.INPUT;
        case "o": return PIN_TYPES.OUTPUT;
        case "io": return PIN_TYPES.INPUT_OUTPUT;
        case "c": return PIN_TYPES.CLOCK;
        case "g": return PIN_TYPES.GND;
        case "v": return PIN_TYPES.VCC;
        case "n": return PIN_TYPES.NC;
    }
}

function parsePin(definition, number) {
    const values = definition.split("/");
    if (values.length === 1) { // standard pins
        switch (values[0]) {
            case "C": return new Pin(number, "CLK", PIN_TYPES.CLOCK, false, definition);
            case "N": return new Pin(number, "NC", PIN_TYPES.NC, false, definition);
            case "G": return new Pin(number, "GND", PIN_TYPES.GND, false, definition);
            case "V": return new Pin(number, "VCC", PIN_TYPES.VCC, false, definition);
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
        if (typeof this.initialize === "function") {
            this.initialize();
        }
        this.update();
    }

    static TYPES = IC_TYPES;

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