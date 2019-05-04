import { IC, PIN_TYPES } from "./helpers.js";

const ics = [];

ics.push(new IC("74x17", "6x Buffer", IC.TYPES.BUFFER, "http://www.ti.com/lit/ds/symlink/sn7417.pdf",
    "1A|i,1Y|o,2A|i,2Y|o,3A|i,3Y|o,G,4Y|o,4A|i,5Y|o,5A|i,6Y|o,6A|i,V",
    function () {
        for (let index = 1; index <= 6; index++) {
            this.pin(index + "Y").state = this.pin(index + "A").state;
        }
    },
    {
        descriptions: {
            "1A": "Operand for 1Y",
            "1Y": "Equal to 1A",
            "2A": "Operand for 2Y",
            "2Y": "Equal to 2A",
            "3A": "Operand for 3Y",
            "3Y": "Equal to 3A",
            "4A": "Operand for Y",
            "4Y": "Equal to A",
            "5A": "Operand for 5Y",
            "5Y": "Equal to 5A",
            "6A": "Operand for 6Y",
            "6Y": "Equal to 6A",
        }
    }
));

ics.push(new IC("74x541", "8x Buffer 3-State", IC.TYPES.BUFFER, "http://www.ti.com/lit/ds/symlink/sn54ls541.pdf",
    "-G1|i,A1|i,A2|i,A3|i,A4|i,A5|i,A6|i,A7|i,A8|i,G,Y8|o,Y7|o,Y6|o,Y5|o,Y4|o,Y3|o,Y2|o,Y1|o,-G2|i,V",
    function () {
        const enabled = !(this.pin("G1").state || this.pin("G2").state);
        for (let index = 1; index <= 8; index++) {
            this.pin("Y" + index).state = enabled && this.pin("A" + index).state;
        }
    },
    {
        descriptions: {
            A1: "Operand for Y1",
            Y1: "Equal to A1 when G1 NOR G2",
            A2: "Operand for Y1",
            Y2: "Equal to A2 when G1 NOR G2",
            A3: "Operand for Y1",
            Y3: "Equal to A3 when G1 NOR G2",
            A4: "Operand for Y1",
            Y4: "Equal to A4 when G1 NOR G2",
            A5: "Operand for Y1",
            Y5: "Equal to A5 when G1 NOR G2",
            A6: "Operand for Y1",
            Y6: "Equal to A6 when G1 NOR G2",
            A7: "Operand for Y1",
            Y7: "Equal to A7 when G1 NOR G2",
            A8: "Operand for Y1",
            Y8: "Equal to A8 when G1 NOR G2",
            G1: "NOR G2 strobe for Ys",
            G2: "NOR G1 strobe for Ys",
        }
    }
));

ics.push(new IC("74x245", "8x Bus Transceiver", IC.TYPES.BUFFER, "http://www.ti.com/lit/ds/symlink/sn54ls245-sp.pdf",
    "DIR|i,A1|o,A2|o,A3|o,A4|o,A5|o,A6|o,A7|o,A8|o,G,B8|i,B7|i,B6|i,B5|i,B4|i,B3|i,B2|i,B1|i,-OE|i,V",
    function (changedPin) {
        if (changedPin) {
            if (changedPin.is("DIR")) {
                if (changedPin.state) {
                    this.As.forEach(pin => pin.type = PIN_TYPES.INPUT);
                    this.Bs.forEach(pin => pin.type = PIN_TYPES.OUTPUT);
                } else {
                    this.As.forEach(pin => pin.type = PIN_TYPES.OUTPUT);
                    this.Bs.forEach(pin => pin.type = PIN_TYPES.INPUT);
                }
            }
            const inputs = this.DIR.state ? this.As : this.Bs;
            const outputs = this.DIR.state ? this.Bs : this.As;
            outputs.forEach((outputPin, index) => outputPin.state = inputs[index].state && !this.OE.state);
        } else {
            this.As.forEach(pin => pin.state = false);
            this.Bs.forEach(pin => pin.state = false);
        }
    },
    {
        initialize() {
            const indexes = [...Array(8).keys()].map(index => index + 1);
            this.As = indexes.map(index => this.pin("A" + index));
            this.Bs = indexes.map(index => this.pin("B" + index));
            this.DIR = this.pin("DIR");
            this.OE = this.pin("OE");
        },
        descriptions: {
            A1: "Input or output for B1",
            A2: "Input or output for B2",
            A3: "Input or output for B3",
            A4: "Input or output for B4",
            A5: "Input or output for B5",
            A6: "Input or output for B6",
            A7: "Input or output for B7",
            A8: "Input or output for B8",
            B1: "Input or output for A1",
            B2: "Input or output for A2",
            B3: "Input or output for A3",
            B4: "Input or output for A4",
            B5: "Input or output for A5",
            B6: "Input or output for A6",
            B7: "Input or output for A7",
            B8: "Input or output for A8",
            DIR: "Input/Output direction: LOW = B to A; HIGH = A to B",
            OE: "Active LOW Output enabled"
        }
    }
));

// ics.push(new IC("74x595", "8bit Shift Register", IC.TYPES.BUFFER, "http://www.ti.com/lit/ds/symlink/sn54ls595.pdf",
//     "QB|o,QC|o,QD|o,QE|o,QF|o,QG|o,QH|o,G,QH'|o,-SRCLR|i,SRCK|i,RCK|i,-G|i,SER|i,QA|o,V",
//     function (changedPin) {

//     },
//     {
//         initialize() {
//             this.Qs = [ "A", "B", "C", "D", "E", "F", "G", "H"].map(index => this.pin("Q" + index));
//             this.QH = this.pin("QH'");
//             this.SRCLR = this.pin("SRCLR");
//             this.SRCK = this.pin("SRCK");
//             this.RCK = this.pin("RCK");
//             this.G = this.pin("G");
//             this.SER = this.pin("SER");
//         },
//         descriptions: {

//         }
//     }
// ));

export default ics;