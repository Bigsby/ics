import { IC } from "./helpers.js";

const ics = [];

ics.push(new IC("74x17", "6x Buffer", "http://www.ti.com/lit/ds/symlink/sn7417.pdf",
    "1A/i,1Y/o,2A/i,2Y/o,3A/i,3Y/o,G,4Y/o,4A/i,5Y/o,5A/i,6Y/o,6A/i,V",
    function () {
        for (let index = 1; index <= 6; index++) {
            this.pin(index + "Y").state = this.pin(index + "A").state;
        }
    }
));

ics.push(new IC("74x541", "8x Buffer 3-State", "http://www.ti.com/lit/ds/symlink/sn54ls541.pdf",
    "-G1/i,A1/i,A2/i,A3/i,A4/i,A5/i,A6/i,A7/i,A8/i,G,Y8/o,Y7/o,Y6/o,Y5/o,Y4/o,Y3/o,Y2/o,Y1/o,-G2/i,V",
    function () {
        const enabled = !(this.pin("G1").state || this.pin("G2").state);
        for (let index = 1; index <= 8; index++) {
            this.pin("Y" + index).state = enabled && this.pin("A" + index).state;
        }
    }
));

export default ics;