import { IC, decimalToBinary } from "./helpers.js";

const ics = [];

ics.push(new IC("74x93", "4bit Binary Counter", IC.TYPES.COUNTER, "http://www.ti.com/lit/ds/symlink/sn74ls93.pdf",
    "CKB/c,R0(1)/i,R0(2)/i,N,V,N,N,QC/o,QB/o,G,QD/o,QA/o,N,CKA/c",
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
export default ics;