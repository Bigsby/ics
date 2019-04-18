import configs from "./configs.js";
import {PIN_TYPES } from "./definitions.js";

function getPinBackground(pin) {
    if (pin.type === PIN_TYPES.VCC) {
        return configs.canvas.pin_VCC_background;
    } else if (pin.type === PIN_TYPES.GND) {
        return configs.canvas.pin_GND_background;
    } else if (pin.type === PIN_TYPES.NC) {
        return configs.canvas.pin_NC_background;
    } else {
        return pin.state ? configs.canvas.pin_HIGH_bakcground : configs.canvas.pin_LOW_bakcground;
    }
}

function drawPin(ctx, pins, rowIndex, isRight, textY, nameHorizontalMargin, pinNumberCenter, x, y, canvasWidth) {
    const pin = pins[isRight ? pins.length - rowIndex - 1 : rowIndex];
    const pinNumber = isRight ? pins.length - rowIndex : rowIndex + 1;
    const pinPos = [
        x, y,
        configs.canvas.pin_width,
        configs.canvas.pin_height
    ];

    ctx.fillStyle = getPinBackground(pin);
    ctx.fillRect(...pinPos);
    ctx.lineWidth = pin.type === PIN_TYPES.INPUT ? configs.canvas.pin_INPUT_lineWidth : configs.canvas.pin_other_lineWidth;
    ctx.setLineDash(pin.type === PIN_TYPES.VCC || pin.type === PIN_TYPES.GND ? configs.canvas.pin_power_dash : configs.canvas.pin_other_dash);
    ctx.strokeRect(...pinPos);

    ctx.fillStyle = "#000";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(pinNumber, isRight ? canvasWidth - pinNumberCenter : pinNumberCenter, textY);
    
    ctx.textAlign = isRight ? "end" : "start";
    ctx.font = pin.type === PIN_TYPES.INPUT ? configs.canvas.pin_INPUT_font : configs.canvas.pin_other_font;
    const pinName = pin.name || pin.type;
    const textX = isRight ? canvasWidth - nameHorizontalMargin : nameHorizontalMargin;
    ctx.fillText(pinName, textX, textY);
    if (pin.inverted) {
        const dashWidth = ctx.measureText(pinName).width;
        const dashY = textY - configs.canvas.pin_inverted_dash_offset;
        ctx.beginPath();
        ctx.moveTo(textX, dashY);
        ctx.lineTo(textX + dashWidth, dashY);
        ctx.stroke();
    }
    

    pin.pos = {
        x,
        y,
        h: configs.canvas.pin_width,
        w: configs.canvas.pin_height
    };
}

function drawICPins(pins, ctx, canvasWidth, canvasHeight, pinTotalHeight) {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    const horizontalMargin = configs.canvas.pin_width + configs.canvas.margin_horizontal;

    ctx.fillStyle = configs.canvas.ic_background;
    const icRect = [
        horizontalMargin,
        configs.canvas.margin_vertical,
        canvasWidth - 2 * horizontalMargin,
        canvasHeight - 2 * configs.canvas.margin_vertical
    ];
    ctx.fillRect(...icRect);
    ctx.strokeRect(...icRect);

    let pinVerticalStart = configs.canvas.pin_vertical_margin + configs.canvas.margin_vertical; //{ configs.canvas.margin_horizontal };
    let nameHorizontalMargin = configs.canvas.margin_horizontal + configs.canvas.pin_width + configs.canvas.pin_text_margin_horizontal;
    const pinNumberCenter = configs.canvas.margin_horizontal + configs.canvas.pin_width / 2;
    for (let pinIndex = 0; pinIndex < pins.length / 2; pinIndex++) {
        const textY = pinVerticalStart + configs.canvas.pin_height / 2;

        drawPin(ctx, pins, pinIndex, false, textY, nameHorizontalMargin, pinNumberCenter,
            configs.canvas.margin_horizontal,
            pinVerticalStart, canvasWidth);


        drawPin(ctx, pins, pinIndex, true, textY, nameHorizontalMargin, pinNumberCenter,
            canvasWidth - configs.canvas.margin_horizontal - configs.canvas.pin_width,
            pinVerticalStart, canvasWidth);

        pinVerticalStart += pinTotalHeight;
    }
}

function drawIC(definition, targetElement) {
    const pins = definition.pins;
    if (!pins || !pins.length || pins.length % 2) {
        console.log("Pin count not devidable by 2, " + JSON.stringify(pins));
        return;
    }

    const icContainer = document.createElement("div");
    icContainer.className = "icContainer";
    
    const header = document.createElement("div");
    header.className = "header";
    const id = document.createElement("span");
    id.className = "id";
    id.innerText = definition.id + "   ";
    header.appendChild(id);
    const link = document.createElement("a");
    link.href = definition.datasheet;
    link.innerText = "DS";
    link.target = "_blank";
    header.appendChild(link);
    header.appendChild(document.createElement("br"));
    const name = document.createElement("span");
    name.innerText = definition.name;
    header.appendChild(name);
    icContainer.appendChild(header);

    const canvas = document.createElement("canvas");
    const pinTotalHeight = configs.canvas.pin_height + (2 * configs.canvas.pin_vertical_margin);
    const canvasHeight = (pins.length / 2) * pinTotalHeight + 2 * configs.canvas.margin_vertical;
    const canvasWidth = configs.canvas.ic_width + 2 * (configs.canvas.margin_horizontal + configs.canvas.pin_width);
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    canvas.style.background = configs.canvas.background;
    icContainer.appendChild(canvas);

    targetElement.appendChild(icContainer);

    const ctx = canvas.getContext("2d");

    drawICPins(pins, ctx, canvasWidth, canvasHeight, pinTotalHeight);

    const canvasLeft = canvas.offsetLeft;
    const canvasTop = canvas.offsetTop;

    canvas.onclick = function (event) {
        let x = event.pageX - canvasLeft,
            y = event.pageY - canvasTop;
        
        let updatedPin;

        pins.forEach(function (pin) {
            if (pin.type !== PIN_TYPES.INPUT) {
                return;
            }
            if (y > pin.pos.y && y < pin.pos.y + pin.pos.h && x > pin.pos.x && x < pin.pos.x + pin.pos.w) {
                pin.state = !pin.state;
                updatedPin = pin;
            }
        });
        definition.update(updatedPin);
        drawICPins(definition.pins, ctx, canvasWidth, canvasHeight, pinTotalHeight);
    };
}

export default drawIC;