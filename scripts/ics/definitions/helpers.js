export const PIN_TYPES = {
    INPUT: "input",
    OUTPUT: "output",
    INPUT_OUTPUT: "input_output",
    GND: "GND",
    VCC: "VCC",
    NC: "NC"
};

export const IC_TYPES = {
    BUFFER: "buffer",
    LOGIC: "logic",
    LATCH: "latch",
    SELECTORS: "selector",
    DECODER: "decoder",
    ARITHEMATIC: "arithmetic"
};

class Pin {
    constructor(number, name, type, inverted) {
        this.number = number;
        this.name = name;
        this.type = type;
        this.inverted = !!inverted;
        if (this.type === PIN_TYPES.INPUT) {
            this.state = this.inverted;
        }
    }
}

function parsePins(definitions) {
    const result = [];

    definitions.split(',').forEach((definition, index) => {
        const pin = definition.split('/');
        const number = index + 1;
        if (pin.length === 1) {
            switch (pin[0]) {
                case "N":
                    result.push(new Pin(number, "NC", PIN_TYPES.NC));
                    break;
                case "G":
                    result.push(new Pin(number, "GND", PIN_TYPES.GND));
                    break;
                case "V":
                    result.push(new Pin(number, "VCC", PIN_TYPES.VCC));
                    break;
            }
        } else if (pin.length === 2) {
            const inverted = pin[0][0] === "-";
            const pinName = inverted ? pin[0].substring(1) : pin[0];
            result.push(new Pin(number, pinName, pin[1] === "i" ? PIN_TYPES.INPUT : PIN_TYPES.OUTPUT, inverted));
        }
    });

    return result;
}

export class IC {
    constructor(id, name, type, datasheet, pins, update, optionals) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.datasheet = datasheet;
        this.pins = parsePins(pins);
        this.update = typeof update === "function" ? update : () => {};
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