import { IC } from "./helpers.js";

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

export default ics;