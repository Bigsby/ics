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