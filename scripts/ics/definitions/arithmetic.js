import { IC, binaryToDecimal, decimalToBinary, notSet } from "./helpers.js";

const ics = [];

ics.push(new IC("74x283", "4bit Full Adder", IC.TYPES.ARITHEMATIC, "http://www.ti.com/lit/ds/symlink/sn74ls283.pdf",
    "Σ2|o,B2|i,A2|i,Σ1|o,A1|i,B1|i,CI|i,G,CO|o,Σ4|o,B4|i,A4|i,Σ3|o,A3|i,B3|i,V",
    function () {
        const A = binaryToDecimal(...this.As);
        const B = binaryToDecimal(...this.Bs);
        const CarryIn = this.CarryIn.state ? 1 : 0;
        const sum = A + B + CarryIn;
        const states = decimalToBinary(sum, 4).reverse();
        this.setStates(this.Sums, states);
        this.CarryOut.state = sum > 15;
    },
    {
        initialize() {
            const indexes = [...Array(4).keys()].map(index => index + 1);
            this.As = indexes.map(index => this.pin("A" + index));
            this.Bs = indexes.map(index => this.pin("B" + index));
            this.Sums = indexes.map(index => this.pin("Σ" + index));
            this.CarryIn = this.pin("CI");
            this.CarryOut = this.pin("CO");
        }
    }
));

function set(Fs, calc) {
    Fs.forEach((pin, index) => pin.state = calc(index));
}

function calculateAndSet(Fs, As, Bs, calc) {
    const A = binaryToDecimal(As);
    const B = binaryToDecimal(Bs);
    const value = calc(A, B);
    const result = decimalToBinary(value, 4, true);
    set(Fs, index => result[index]);
}

const _74x181functions = {

    // M,Cn,S3,S2,S1,S0

    // Logic mode
    b100000: function (Fs, As, Bs) { // F = !A
        set(Fs, index => !As[index].state);
    },
    b100001: function (Fs, As, Bs) { // F = !(A & B)
        set(Fs, index => !(As[index].state && Bs[index].state));
    },
    b100010: function (Fs, As, Bs) { // F = !A | B
        set(Fs, _index => !As[index].state || Bs[index].state);
    },
    b100011: function (Fs, As, Bs) { // F = 1
        const result = decimalToBinary(1, 4, true);
        set(Fs, index => result[index]);
    },
    b100100: function (Fs, As, Bs) { // F = !(A | B)
        set(Fs, index => !(As[index].state || Bs[index].state));
    },
    b100101: function (Fs, As, Bs) { // F = !B
        set(Fs, index => !Bs[index].state);
    },
    b100110: function (Fs, As, Bs) { // F = !(A ^ B)
        set(Fs, index => !((pin.state || Bs[index].state) && !(pin.state && Bs[index].state)));
    },
    b100111: function (Fs, As, Bs) { // F = A | !B
        set(Fs, index => As[index].state || !Bs[index].state);
    },
    b101000: function (Fs, As, Bs) { // F = !A & B
        set(Fs, index => !As[index].state && !Bs[index].state);
    },
    b101001: function (Fs, As, Bs) { // F = A ^ B
        set(Fs, index => (As[index].state || Bs[index].state) && !(As[index].state && Bs[index].state));
    },
    b101010: function (Fs, As, Bs) { // F = B
        set(Fs, index => Bs[index].state);
    },
    b101011: function (Fs, As, Bs) { // F = A | B
        set(Fs, index => As[index].state || Bs[index].state);
    },
    b101100: function (Fs, As, Bs) { // F = 0
        set(Fs, _ => false);
    },
    b101101: function (Fs, As, Bs) { // F = A & !B
        set(Fs, index => As[index].state && !Bs[index].state);
    },
    b101110: function (Fs, As, Bs) { // F = A & B
        set(Fs, index => As[index].state && Bs[index].state);
    },
    b101111: function (Fs, As, Bs) { // F = A
        set(Fs, index => As[index].state);
    },

    // Arithmetic mode
    b000000: function (...args) { // F = A - 1
        calculateAndSet(...args, (A, B) => A - 1);
    },
    b010000: function (Fs, As, Bs) { // F = A
        set(Fs, index => As[index].state);
    },
    b000001: function (...args) { // F = (A & B) - 1
        calculateAndSet(...args, (A, B) => (A & B) - 1);
    },
    b010001: function (...args) { // F = A & B
        calculateAndSet(...args, (A, B) => A & B);
    },
    b000010: function (...args) { // F = (A & !B) - 1
        calculateAndSet(...args, (A, B) => (A & ~B) - 1);
    },
    b010010: function (...args) { // F = A & !B
        calculateAndSet(...args, (A, B) => A & ~B);
    },
    b000011: function (Fs, As, Bs) { // F = - 1 (2' compliment)
        set(Fs, _ => true);
    },
    b010011: function (Fs, As, Bs) { // F = ZERO
        set(Fs, _ => false);
    },
    b000100: function (...args) { // F = A + (A | !B)
        calculateAndSet(...args, (A, B) => A + (A | ~B));
    },
    b010100: function (...args) { // F = A + (A | !B) + 1
        calculateAndSet(...args, (A, B) => A + (A | ~B) + 1, 4);
    },
    b000101: function (...args) { // F = (A & B) + (A | !B)
        calculateAndSet(...args, (A, B) => (A & B) + (A | ~B));
    },
    b010101: function (...args) { // F = (A & B) + (A | !B) + 1
        calculateAndSet(...args, (A, B) => (A & B) + (A | ~B) + 1);
    },
    b000110: function (...args) { // F = A - B - 1
        calculateAndSet(...args, (A, B) => A - B - 1);
    },
    b010110: function (...args) { // F = A - B
        calculateAndSet(...args, (A, B) => A - B);
    },
    b000111: function (Fs, As, Bs) { // F = A + !B
        set(Fs, index => As[index].state || !Bs[index].state);
    },
    b010111: function (...args) { // F = (A + !B) + 1
        calculateAndSet(...args, (A, B) => (A | ~B) + 1);
    },
    b001000: function (...args) { // F = A + (A | B)
        calculateAndSet(...args, (A, B) => A + (A | B));
    },
    b011000: function (...args) { // F = A + (A | B) + 1
        calculateAndSet(...args, (A, B) => A + (A | B) + 1);
    },
    b001001: function (...args) { // F = A + B
        calculateAndSet(...args, (A, B) => A + B);
    },
    b011001: function (...args) { // F = A + B + 1
        calculateAndSet(...args, (A, B) => A + B + 1);
    },
    b001010: function (...args) { // F = (A & !B) + (A | B)
        calculateAndSet(...args, (A, B) => (A & ~B) + (A | B));
    },
    b011010: function (...args) { // F = (A & !B) + (A | B) + 1
        calculateAndSet(...args, (A, B) => (A & ~B) + (A | B) + 1);
    },
    b001011: function (Fs, As, Bs) { // F = A | B
        set(Fs, index => As[index].state || Bs[index].state);
    },
    b011011: function (...args) { // F = (A | B) + 1
        calculateAndSet(...args, (A, B) => (A | B) + 1);
    },
    b001100: function (...args) { // F = A + A
        calculateAndSet(...args, (A, B) => A + A);
    },
    b011100: function (...args) { // F = A + A + 1
        calculateAndSet(...args, (A, B) => A + A + 1);
    },
    b001101: function (...args) { // F = (A & B) + A
        calculateAndSet(...args, (A, B) => (A & B) + A);
    },
    b011101: function (...args) { // F = (A & B) + A + 1
        calculateAndSet(...args, (A, B) => (A & B) + A + 1);
    },
    b001110: function (...args) { // F = (A & !B) + A
        calculateAndSet(...args, (A, B) => (A & ~B) + A);
    },
    b011110: function (...args) { // F = (A & !B) + A + 1
        calculateAndSet(...args, (A, B) => (A & ~B) + A + 1);
    },
    b001111: function (Fs, As, Bs) { // F = A
        set(Fs, index => As[index].state);
    },
    b011111: function (...args) { // F = A + 1
        calculateAndSet(...args, (A, B) => A + 1);
    },
};
// ics.push(new IC("74x181", "4bit ALU", IC.TYPES.ARITHEMATIC, "http://www.ti.com/lit/ds/symlink/sn54ls181.pdf",
//     "-B0|i,-A0|i,S3|i,S2|i,S1|i,S0|i,Cn|i,M|i,-F0|o,-F1|o,-F2|o,G,-F3|o,A=B|o,-P|o,Cn+4|o,-G|o,-B3|i,-A3|i,-B2|i,-A2|i,-B1|i,-A1|i,V",
//     function () {
//         const func = this.getFunction();
//         func(this.Fs, this.As, this.Bs);
//     },
//     {
//         initialize() {
//             const indexes = [...Array(4).keys()];
//             this.As = indexes.map(index => this.pin("A" + index));
//             this.Bs = indexes.map(index => this.pin("B" + index));
//             this.Fs = indexes.map(index => this.pin("F" + index));
//             this.Ss = indexes.map(index => this.pin("S" + index));
//             this.C = this.pin("Cn");
//             this.M = this.pin("M");
//             this.G = this.pin("G");
//             this.P = this.pin("P");
//             this.Cn4 = this.pin("Cn+4");
//             this.AeB = this.pin("A=B");
//         },
//         getFunction() {
//             let functionCode = "b";
//             functionCode += this.M.state ? "1" : "0";
//             if (this.M.state) {
//                 functionCode += "0";
//             } else {
//                 functionCode += this.C.state ? "0" : "1";
//             }
//             functionCode += this.Ss[3].state ? "1" : 0;
//             functionCode += this.Ss[2].state ? "1" : 0;
//             functionCode += this.Ss[1].state ? "1" : 0;
//             functionCode += this.Ss[0].state ? "1" : 0;

//             return _74x181functions[functionCode] || (() => { });
//         }
//     }
// ));

export default ics;