import { newIC, nandSet, andSet, norSet, orSet, xorSet, binaryToDecimal, decimalToBinary } from "./helpers.js";

const ics = [];

ics.push(newIC("74x00", "4x2i NAND",
    "1A/i,1B/i,1Y/o,2A/i,2B/i,2Y/o,G,3Y/o,3A/i,3B/i,4Y/o,4A/i,4B/i,V",
    "http://www.ti.com/lit/ds/symlink/sn74ls00.pdf",
    function () {
        for (let index = 1; index <= 4; index++) {
            nandSet(this.pin(index + "Y"), this.pin(index + "A"), this.pin(index + "B"));
        }
    }
));

ics.push(newIC("74x02", "4x2i NOR",
    "1Y/o,1A/i,1B/i,2Y/o,2A/i,2B/i,G,3A/i,3B/i,3Y/o,4A/i,4B/i,4Y/o,V",
    "http://www.ti.com/lit/ds/symlink/sn74ls02.pdf",
    function () {
        for (let index = 1; index <= 4; index++) {
            norSet(this.pin(index + "Y"), this.pin(index + "A"), this.pin(index + "B"));
        }
    }
));

ics.push(newIC("74x04", "6x1i INVERTER",
    "1A/i,1Y/o,2A/i,2Y/o,3A/i,3Y/o,G,4Y/o,4A/i,5Y/o,5A/i,6Y/o,6A/i,V",
    "http://www.ti.com/lit/ds/symlink/sn74ls04.pdf",
    function () {
        for (let index = 1; index <= 6; index++) {
            this.pin(index + "Y").state = !this.pin(index + "A").state;
        }
    }
));

ics.push(newIC("74x08", "4x2i AND",
    "1A/i,1B/i,1Y/o,2A/i,2B/i,2Y/o,G,3Y/o,3A/i,3B/i,4Y/o,4A/i,4B/i,V",
    "http://www.ti.com/lit/ds/symlink/sn74ls08.pdf",
    function () {
        for (let index = 1; index <= 4; index++) {
            andSet(this.pin(index + "Y"), this.pin(index + "A"), this.pin(index + "B"));
        }
    }
));

ics.push(newIC("74x10", "3x3i NAND",
    "1A/i,1B/i,2A/i,2B/i,2C/i,2Y/o,G,3Y/o,3A/i,3B/i,3C/i,1Y/o,1C/i,V",
    "http://www.ti.com/lit/ds/symlink/sn74ls10.pdf",
    function () {
        for (let index = 1; index <= 3; index++) {
            nandSet(this.pin(index + "Y"), this.pin(index + "A"), this.pin(index + "B"), this.pin(index + "C"));
        }
    }
));

ics.push(newIC("74x11", "3x3i AND",
    "1A/i,1B/i,2A/i,2B/i,2C/i,2Y/o,G,3Y/o,3A/i,3B/i,3C/i,1Y/o,1C/i,V",
    "http://www.ti.com/lit/ds/symlink/sn74ls11.pdf",
    function () {
        for (let index = 1; index <= 3; index++) {
            andSet(this.pin(index + "Y"), this.pin(index + "A"), this.pin(index + "B"), this.pin(index + "C"));
        }
    }
));

ics.push(newIC("74x18", "2x4i NAND",
    "1A/i,1B/i,N,1C/i,1D/i,1Y/o,G,2Y/o,2A/i,2B/i,N,2C/i,2D/i,V",
    "https://archive.org/stream/bitsavers_tidataBookVol2_45945352/1985_The_TTL_Data_Book_Vol_2#page/n149/mode/2up",
    function () {
        for (let index = 1; index <= 2; index++) {
            nandSet(this.pin(index + "Y"), this.pin(index + "A"), this.pin(index + "B"), this.pin(index + "C"), this.pin(index + "D"));
        }
    }
));

ics.push(newIC("74x21", "2x4i AND",
    "1A/i,1B/i,N,1C/i,1D/i,1Y/o,G,2Y/o,2A/i,2B/i,N,2C/i,2D/i,V",
    "http://www.ti.com/lit/ds/symlink/sn74ls21.pdf",
    function () {
        for (let index = 1; index <= 2; index++) {
            andSet(this.pin(index + "Y"), this.pin(index + "A"), this.pin(index + "B"), this.pin(index + "C"), this.pin(index + "D"));
        }
    }
));

ics.push(newIC("74x25", "2x4i NOR with Strobe",
    "1A/i,1B/i,1G/i,1C/i,1D/i,1Y/o,G,2Y/o,2A/i,2B/i,2G/i,2C/i,2D/i,V",
    "http://www.ti.com/lit/ds/symlink/sn5425.pdf",
    function () {
        for (let index = 1; index <= 2; index++) {
            if (!this.pin(index + "G").state) {
                this.pin(index + "Y").state = true;
            } else {
                norSet(this.pin(index + "Y"), this.pin(index + "A"), this.pin(index + "B"), this.pin(index + "C"), this.pin(index + "D"));
            }
        }
    }
));

ics.push(newIC("74x27", "3x3i NOR",
    "1A/i,1B/i,2A/i,2B/i,2C/i,2Y/o,G,3Y/o,3A/i,3B/i,3C/i,1Y/o,1C/i,V",
    "http://www.ti.com/lit/ds/symlink/sn74ls27.pdf",
    function () {
        for (let index = 1; index <= 3; index++) {
            norSet(this.pin(index + "Y"), this.pin(index + "A"), this.pin(index + "B"), this.pin(index + "C"));
        }
    }
));

ics.push(newIC("74x30", "1x8i NAND",
    "A/i,B/i,C/i,D/i,E/i,F/i,G,Y/o,N,N,G/i,H/i,N,V",
    "http://www.ti.com/lit/ds/symlink/sn74ls30.pdf",
    function () {
        nandSet(this.pin("Y"), this.pin("A"), this.pin("B"), this.pin("D"), this.pin("E"), this.pin("F"), this.pin("G"), this.pin("H"));
    }
));

ics.push(newIC("74x32", "4x2i OR",
    "1A/i,1B/i,1Y/o,2A/i,2B/i,2Y/o,G,3Y/o,3A/i,3B/i,4Y/o,4A/i,4B/i,V",
    "http://www.ti.com/lit/ds/symlink/sn74ls32.pdf",
    function () {
        for (let index = 1; index <= 4; index++) {
            orSet(this.pin(index + "Y"), this.pin(index + "A"), this.pin(index + "B"));
        }
    }
));

ics.push(newIC("74x36", "4x2i NOR",
    "1A/i,1B/i,1Y/o,2A/i,2B/i,2Y/o,G,3Y/o,3A/i,3B/i,4Y/o,4A/i,4B/i,V",
    "https://archive.org/stream/bitsavers_tidataBookogicDataBook_23574286/1984_High-speed_CMOS_Logic_Data_Book#page/n81/mode/2up",
    function () {
        for (let index = 1; index <= 4; index++) {
            norSet(this.pin(index + "Y"), this.pin(index + "A"), this.pin(index + "B"));
        }
    }
));

ics.push(newIC("74x86", "4x2i XOR",
    "1A/i,1B/i,1Y/o,2A/i,2B/i,2Y/o,G,3Y/o,3A/i,3B/i,4Y/o,4A/i,4B/i,V",
    "http://www.ti.com/lit/ds/symlink/sn74ls86a.pdf",
    function () {
        for (let index = 1; index <= 4; index++) {
            xorSet(this.pin(index + "Y"), this.pin(index + "A"), this.pin(index + "B"));
        }
    }
));

ics.push(newIC("74x64", "4-2-3-2 AND-OR-INVERT",
    "A/i,E/i,F/i,G/i,H/i,I/i,G,Y/o,J/i,K/i,B/i,C/i,D/i,V",
    "http://www.ti.com/lit/ds/symlink/sn54s64.pdf",
    function () {
        const A = this.A.state && this.B.state && this.C.state && this.D.state;
        const B = this.E.state && this.F.state;
        const C = this.G.state && this.H.state && this.I.state;
        const D = this.J.state && this.K.state;
        this.Y.state = !(A || B || C || D);
    }, {
        initialize() {
            this.A = this.pin("A");
            this.B = this.pin("B");
            this.C = this.pin("C");
            this.D = this.pin("D");
            this.E = this.pin("E");
            this.F = this.pin("F");
            this.G = this.pin("G");
            this.H = this.pin("H");
            this.I = this.pin("I");
            this.J = this.pin("J");
            this.K = this.pin("K");
            this.Y = this.pin("Y");
        }
    }
));

ics.push(newIC("74x283", "4bit Full Adder",
    "Σ2/o,B2/i,A2/i,Σ1/o,A1/i,B1/i,CI/i,G,CO/o,Σ4/o,B4/i,A4/i,Σ3/o,A3/i,B3/i,V",
    "http://www.ti.com/lit/ds/symlink/sn74ls283.pdf",
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

export default ics;