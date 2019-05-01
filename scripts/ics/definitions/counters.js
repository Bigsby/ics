import { IC, decimalToBinary, binaryToDecimal } from "./helpers.js";

const ics = [];

ics.push(new IC("74x93", "4bit Binary Counter", IC.TYPES.COUNTER, "http://www.ti.com/lit/ds/symlink/sn74ls93.pdf",
    "CKB/cf,R0(1)/i,R0(2)/i,N,V,N,N,QC/o,QB/o,G,QD/o,QA/o,N,CKA/cf",
    function (changedPin) {
        if (!changedPin || (this.R1.state && this.R2.state)) {
            this.Bstate = 0;
            this.Astate = false;
        } else if (!changedPin.state) {
            if (changedPin.name === "CKA") {
                this.Astate = !this.Astate;
            } else if (changedPin.name === "CKB") {
                this.Bstate++;
            }
        }
        this.QA.state = this.Astate;
        this.setStates(this.QBs, decimalToBinary(this.Bstate, 3));
    },
    {
        initialize() {
            this.CKA = this.pin("CKA");
            this.CKB = this.pin("CKB");
            this.R1 = this.pin("R0(1)");
            this.R2 = this.pin("R0(2)");
            this.QA = this.pin("QA");
            this.QBs = ["D", "C", "B"].map(index => this.pin("Q" + index));
            this.Bstate = 0;
            this.Astate = false;
        }
    }
));

ics.push(new IC("74x193", "4bit Up/Down Counter", IC.TYPES.COUNTER, "http://www.ti.com/lit/ds/symlink/sn74ls193.pdf",
    "B/i,QB/o,QA/o,DOWN/cr,UP/cr,QC/o,QD/o,G,D/i,C/i,-LOAD/i,-CO/o,-BO/o,CLR/i,A/i,V",
    function (changedPin) {
        if (!this.Load.state) {
            this.count = binaryToDecimal(...this.inputs);
        } else {
            if (this.CLR.state) {
                this.count = 0;
            } else if (changedPin) {
                if (changedPin.is("UP") && this.Down.state) {
                    if (this.Up.state) {
                        this.count = this.count === 15 ? 0 : this.count + 1;
                        this.CO.state = true;
                    } else {
                        this.CO.state = this.count != 15;
                    }
                } else if (changedPin.is("DOWN") && this.Up.state) {
                    if (this.Down.state) {
                        this.count = this.count === 0 ? 15 : this.count - 1;
                        this.BO.state = true;
                    } else {
                        this.BO.state = this.count != 0;
                    }
                }
            }
        }
        this.setStates(this.outputs, decimalToBinary(this.count, 4, true));
    },
    {
        initialize() {
            const names = ["A", "B", "C", "D"];
            this.inputs = names.map(name => this.pin(name));
            this.outputs = names.map(name => this.pin("Q" + name));
            this.Down = this.pin("DOWN");
            this.Up = this.pin("UP");
            this.Load = this.pin("LOAD");
            this.CO = this.pin("CO");
            this.BO = this.pin("BO");
            this.CLR = this.pin("CLR");
            this.count = 0;

            this.CO.state = true;
            this.BO.state = true;
        }
    }
));

// ics.push(new IC("74x191", "4bit Up/Down Counter", IC.TYPES.COUNTER, "http://www.ti.com/lit/ds/symlink/sn74ls90.pdf",
//     "B/i,QB/o,QA/o,-CTEN/i,D|-U/i,QC/o,QD/o,G,D/i,C/i,-LOAD/i,MAX|MIN/o,-RCO/o,CLK/cr,A/i,V",
//     function(changedPin) {},
//     {
//         initialize() {
//             const names = ["A", "B", "C", "D"];
//             this.inputs = names.map(name => this.pin(name));
//             this.outputs = names.map(name => this.pin("Q" + name));
//             this.Load = this.pin("LOAD");
//             this.DownUp = this.pin("D|-U");
//             this.CountEnable = this.pin("CTEN");
//         }
//     }
// ));

ics.push(new IC("74x90", "Decade Coutner", IC.TYPES.COUNTER, "http://www.ti.com/lit/ds/symlink/sn74ls90.pdf",
    "CKB/cf,R0(1)/i,R0(2)/i,N,V,R9(1)/i,R9(2)/i,QC/o,QB/o,G,QD/o,QA/o,N,CKA/cf",
    function (changedPin) {
        const controlState = binaryToDecimal(...this.controlPins);
        if (controlState >= 12) {
            this.QA.state = true;
            this.Bs = 4;
        } else if ((controlState & 3) === 3) {
            this.QA.state = false;
            this.Bs = 0;
        } else if (changedPin) {
            if (changedPin.is("CKA") && !changedPin.state) {
                this.QA.state = !this.QA.state;
            } else if (changedPin.is("CKB") && !changedPin.state) {
                this.Bs = this.Bs == 5 ? 0 : this.Bs + 1;
            }
        }
        this.setStates(this.Boutputs, decimalToBinary(this.Bs, 3, true));
    },
    {
        initialize() {
            const names = ["B", "C", "D"];
            this.QA = this.pin("QA");
            this.Boutputs = names.map(name => this.pin("Q" + name));
            this.controlPins = [
                this.pin("R0(1)"), // 1
                this.pin("R0(2)"), // 2
                this.pin("R9(1)"), // 4
                this.pin("R9(2)")  // 8
            ];
            this.CKA = this.pin("CKA");
            this.CKA = this.pin("CKB");
            this.QA.state = false;
            this.Bs = 0;
        }
    }
));

export default ics;