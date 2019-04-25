import { IC, binaryToDecimal } from "./helpers.js";

const ics = [];

const _74x42data = [
    [false, true, true, true, true, true, true, true, true, true],
    [true, false, true, true, true, true, true, true, true, true],
    [true, true, false, true, true, true, true, true, true, true],
    [true, true, true, false, true, true, true, true, true, true],
    [true, true, true, true, false, true, true, true, true, true],
    [true, true, true, true, true, false, true, true, true, true],
    [true, true, true, true, true, true, false, true, true, true],
    [true, true, true, true, true, true, true, false, true, true],
    [true, true, true, true, true, true, true, true, false, true],
    [true, true, true, true, true, true, true, true, true, false],
    [true, true, true, true, true, true, true, true, true, true],
    [true, true, true, true, true, true, true, true, true, true],
    [true, true, true, true, true, true, true, true, true, true],
    [true, true, true, true, true, true, true, true, true, true],
    [true, true, true, true, true, true, true, true, true, true],
    [true, true, true, true, true, true, true, true, true, true]
];

ics.push(new IC("74x42", "BCD>Decimal Decoder", "http://www.ti.com/lit/ds/symlink/sn74ls32.pdf",
    "-0/o,-1/o,-2/o,-3/o,-4/o,-5/o,-6/o,G,-7/o,-8/o,-9/o,D/i,C/i,B/i,A/i,V",
    function () {
        const decimalValue = binaryToDecimal(...this.BCDpins);
        const outputs = _74x42data[decimalValue];
        outputs.forEach((value, index) => this.pin(index.toString()).state = value);
    },
    {
        initialize() {
            this.BCDpins = [ "A", "B", "C", "D" ].map(name => this.pin(name));
        }
    }
));

const _7SegDecoderData = [
    [true, true, true, true, true, true, false], // 0
    [false, true, true, false, false, false, false], // 1
    [true, true, false, true, true, false, true], // 2
    [true, true, true, true, false, false, true], // 3
    [false, true, true, false, false, true, true], // 4
    [true, false, true, true, false, true, true], // 5
    [false, false, true, true, true, true, true], // 6
    [true, true, true, false, false, false, false], // 7
    [true, true, true, true, true, true, true], // 8
    [true, true, true, false, false, true, true], // 9
    [false, false, false, true, true, false, true], // 10
    [false, false, true, true, false, false, true], // 11
    [false, true, false, false, false, true, true], // 12
    [true, false, false, true, false, true, true], // 13
    [false, false, false, true, true, true, true], // 14
    [false, false, false, false, false, false, false], // 15
    [true, true, true, true, true, true, true], // Lamp test
];

ics.push(new IC("74x49", "BCD>7Seg Decoder", "http://www.ti.com/lit/ds/symlink/sn74ls47.pdf",
    "B/i,C/i,-BI/i,D/i,A/i,e/o,G,d/o,c/o,b/o,a/o,g/o,f/o,V",
    function () {
        const decimalValue = this.pin("BI").state ? 15 : binaryToDecimal(this.pin("A"), this.pin("B"), this.pin("C"), this.pin("D"));
        const outputs = _7SegDecoderData[decimalValue];
        this.setStates(this.segmentPins, outputs);
    },
    {
        initialize() {
            this.segmentPins = ["a", "b", "c", "d", "e", "f", "g"].map(name => this.pin(name));
        }
    }
));

ics.push(new IC("74x48", "BCD>7Seg Decoder", "http://www.ti.com/lit/ds/symlink/sn74ls47.pdf",
    "B/i,C/i,-LT/i,-BI/i,-RBI/i,D/i,A/i,G,e/o,d/o,c/o,b/o,a/o,g/o,f/o,V",
    function () {
        let decimalValue = 15;
        if (!this.pin("BI").state) {
            decimalValue = !this.pin("LT").state ? 16 :  binaryToDecimal(this.pin("A"), this.pin("B"), this.pin("C"), this.pin("D"));
        }
        const outputs = _7SegDecoderData[decimalValue];
        this.setStates(this.segmentPins, outputs);
    },
    {
        initialize() {
            this.segmentPins = ["a", "b", "c", "d", "e", "f", "g"].map(name => this.pin(name));
        }
    }
));

export default ics;