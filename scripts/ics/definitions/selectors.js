import { IC, binaryToDecimal } from "./helpers.js";

const ics = [];

ics.push(new IC("74x151", "8 > 1 Selector", IC.TYPES.SELECTOR, "http://www.ti.com/lit/ds/sdls054/sdls054.pdf",
    "D3|i,D2|i,D1|i,D0|i,Y|o,W|o,-G|i,G,C|i,B|i,A|i,D7|i,D6|i,D5|i,D4|i,V",
    function (changedPin) {
        let value = false;
        if (!this.G.state) {
            const selected = binaryToDecimal(...this.inputs);
            value = this.pin("D" + selected).state;
        }

        this.Y.state = value;
        this.W.state = !value;
    },
    {
        initialize() {
            for (let index = 0; index < 8; index++) {
                this["D" + index] = this.pin("D" + index);
            }

            this.inputs = ["A", "B", "C"].map(name => this.pin(name));
            this.G = this.pin("G");
            this.W = this.pin("W");
            this.Y = this.pin("Y");
        },
        descriptions: {
            Y: "Value of seleced Dn",
            W: "Inverse of seleced Dn",
            A: "1st bit (LSBF) of input",
            B: "2nd bit (LSBF) of input",
            C: "3rd bit (LSBF) of input",
            D0: "Input when ABC = 0",
            D1: "Input when ABC = 1",
            D2: "Input when ABC = 2",
            D3: "Input when ABC = 3",
            D4: "Input when ABC = 4",
            D5: "Input when ABC = 5",
            D6: "Input when ABC = 6",
            D7: "Input when ABC = 7"
        }
    }
));

export default ics;