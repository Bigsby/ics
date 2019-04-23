const ics = [];

// const _74x151Ydata = [
//     [ true, false, false, false, false, false, false, false ], // 0
//     [ false, true, false, false, false, false, false, false ], // 1
//     [ false, false, true, false, false, false, false, false ], // 2
//     [ false, false, false, true, false, false, false, false ], // 3
//     [ false, false, false, false, true, false, false, false ], // 4
//     [ false, false, false, false, false, true, false, false ], // 5
//     [ false, false, false, false, false, false, true, false ], // 6
//     [ false, false, false, false, false, false, false, true ], // 7
//     [ false, false, false, false, false, false, false, false ] // all off - strobe
// ];
// ics.push(newIC("74x151", "8>1 Selector",
//     "D3/o,D2/o,D1/o,D0/o,Y/i,W/i,-G/i,G,C/i,B/i,A/i,D7/o,D6/o,D5/o,D4/o,V",
//     "http://www.ti.com/lit/ds/symlink/sn74ls151.pdf",
//     function() {
//         let decimalValue = 8;
//         if (!this.pin("G").state) {
//             decimalValue = binaryToDecimal(this.pin("A"), this.pin("B"), this.pin("C"));
//         }


//     }
// ));

export default ics;