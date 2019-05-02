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

ics.push(new IC("74x42", "BCD>Decimal Decoder", IC.TYPES.DECODER, "http://www.ti.com/lit/ds/symlink/sn74ls32.pdf",
    "-0|o,-1|o,-2|o,-3|o,-4|o,-5|o,-6|o,G,-7|o,-8|o,-9|o,D|i,C|i,B|i,A|i,V",
    function () {
        const decimalValue = binaryToDecimal(...this.BCDpins);
        const outputs = _74x42data[decimalValue];
        outputs.forEach((value, index) => this.pin(index.toString()).state = value);
    },
    {
        initialize() {
            this.BCDpins = [ "A", "B", "C", "D" ].map(name => this.pin(name));
        },
        descriptions: {
            A: "1st bit (LSBF) of BCD (0 to 9)",
            B: "2nd bit (LSBF) of BCD (0 to 9)",
            C: "3rd bit (LSBF) of BCD (0 to 9)",
            D: "4th bit (LSBF) of BCD (0 to 9)",
            "0": "LOW when BCD equals 0",
            "1": "LOW when BCD equals 1",
            "2": "LOW when BCD equals 2",
            "3": "LOW when BCD equals 3",
            "4": "LOW when BCD equals 4",
            "5": "LOW when BCD equals 5",
            "6": "LOW when BCD equals 6",
            "7": "LOW when BCD equals 7",
            "8": "LOW when BCD equals 8",
            "9": "LOW when BCD equals 9"
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

ics.push(new IC("74x49", "BCD>7Seg Decoder", IC.TYPES.DECODER, "http://www.ti.com/lit/ds/symlink/sn74ls47.pdf",
    "B|i,C|i,-BI|i,D|i,A|i,e|o,G,d|o,c|o,b|o,a|o,g|o,f|o,V",
    function () {
        const decimalValue = this.pin("BI").state ? 15 : binaryToDecimal(...this.inputPins);
        const outputs = _7SegDecoderData[decimalValue];
        this.setStates(this.segmentPins, outputs);
    },
    {
        initialize() {
            this.inputPins = [ "A", "B", "C", "D" ].map(name => this.pin(name));
            this.segmentPins = ["a", "b", "c", "d", "e", "f", "g"].map(name => this.pin(name));
        },
        descriptions: {
            A: "1st bit (LSBF) of BCD (0 to 9)",
            B: "2nd bit (LSBF) of BCD (0 to 9)",
            C: "3rd bit (LSBF) of BCD (0 to 9)",
            D: "4th bit (LSBF) of BCD (0 to 9)",
            a: "Output for top horizontal segment",
            b: "Output for top vertical right segment",
            c: "Output for bottom vertical right segment",
            d: "Output for bottom horizontal segment",
            e: "Output for bottom vertical left segment",
            f: "Output for top vertical left segment",
            g: "Output for middle horizontal segment",
            BI: "Active LOW strobe"
        }
    }
));

ics.push(new IC("74x48", "BCD>7Seg Decoder", IC.TYPES.DECODER, "http://www.ti.com/lit/ds/symlink/sn74ls47.pdf",
    "B|i,C|i,-LT|i,-BI/RBO|i,-RBI|i,D|i,A|i,G,e|o,d|o,c|o,b|o,a|o,g|o,f|o,V",
    function () {
        let decimalValue = 15;
        if (!this.pin("BI/RBO").state) {
            decimalValue = !this.pin("LT").state ? 16 :  binaryToDecimal(...this.inputPins);
        }
        const outputs = _7SegDecoderData[decimalValue];
        this.setStates(this.segmentPins, outputs);
    },
    {
        initialize() {
            this.inputPins = [ "A", "B", "C", "D" ].map(name => this.pin(name));
            this.segmentPins = ["a", "b", "c", "d", "e", "f", "g"].map(name => this.pin(name));
        },
        descriptions: {
            A: "1st bit (LSBF) of BCD (0 to 9)",
            B: "2nd bit (LSBF) of BCD (0 to 9)",
            C: "3rd bit (LSBF) of BCD (0 to 9)",
            D: "4th bit (LSBF) of BCD (0 to 9)",
            a: "Output for top horizontal segment",
            b: "Output for top vertical right segment",
            c: "Output for bottom vertical right segment",
            d: "Output for bottom horizontal segment",
            e: "Output for bottom vertical left segment",
            f: "Output for top vertical left segment",
            g: "Output for middle horizontal segment",
            LT: "Light Test turns on all segments",
            "BI/RBO": "Active LOW strobe",
            "RBI": "All outputs LOW"
        }
    }
));

export default ics;