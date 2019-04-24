export const PIN_TYPES = {
    INPUT: "input",
    OUTPUT: "output",
    INPUT_OUTPUT: "input_output",
    GND: "GND",
    VCC: "VCC",
    NC: "NC"
};

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

export function newIC(id, name, pinDefinitions, datasheet, update, optionals) {
    const result = {
        id,
        name,
        pins: parsePins(pinDefinitions),
        pin(name) {
            return this.pins.find(pin => pin.name === name);
        },
        setStates(pins, states) {
            if (pins.length !== states.length) return;

            for (let index = 0; index < pins.length; index++) {
                pins[index].state = states[index];
            }
        },
        setStatesByName(pins, states) {
            if (pins.length !== states.length) return;

            for (let index = 0; index < pins.length; index++) {
                this.pin(pins[index]).state = states[index];
            }
        },
        datasheet,
        update
    };
    Object.assign(result, optionals);
    if (typeof result.initialize === "function") {
        result.initialize();
    } 
    result.pins.forEach(pin => { if (pin.type === PIN_TYPES.INPUT) pin.state = false; });
    result.update(result.pins);
    return result;
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

export function binaryToDecimal(...inputs) {
    let result = 0;
    inputs.forEach((pin, index) => result += Math.pow(2, index) * (pin.state ? 1 : 0));
    return result;
}

export function decimalToBinary(value, bitCount) {
    const result = [];
    for (let bit = 0; bit < bitCount; bit++) {
        result.unshift(value & 1 === 1);
        value = value >> 1;
    }
    return result;
}