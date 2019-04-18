import ics from "./ics.js";
import drawIC from "./ui.js";

// const container = document.getElementById("appContainer");

// ics.forEach(ic => drawIC(ic, container));
Vue.component("pin", {
    template: `
        <div class="pin">
        <div :class="['pin-number', side, pin.type, pin.state ? 'HIGH' : 'LOW']" @click="clicked">{{pin.number}}</div>
        <div :class="['pin-name', side, pin.type, {inverted: pin.inverted}]"><span>{{pin.name}}<span></span></div>
        </div>
    `,
    props: ["pin", "side"],
    methods: {
        clicked() {
            this.$emit("clicked", this.pin);
        }
    }
});

Vue.component("pin-strip", {
    template: `
        <div class="pin-strip">
            <pin v-for="pin in pins" :pin="pin" @clicked="pinClicked($event)" :side="side"></pin>
        </div>
    `,
    props: ["pins", "side"],
    methods: {
        pinClicked(pin) {
            this.$emit("pinClicked", pin);
        }
    }
});

Vue.component("pin-names", {
    template: `
        <div class="pin-names">
            <span :class="[{inverted: pin.inverted}, side]" v-for="pin in pins">{{pin.name}}</span>
        </div>
    `,
    props: ["pins", "side"]
});

Vue.component("ic-package", {
    template: `
        <div class="ic-box"></div>
    `,
    props: ["leftPins", "rightPins"]
});

Vue.component("ic", {
    template: `
        <div class="ic">
            <pin-strip @pinClicked="pinClicked($event)" :pins="leftPins" side="left"></pin-strip>
            <ic-package :leftPins="leftPins" :rightPins="rightPins"></ic-package>
            <pin-strip @pinClicked="pinClicked($event)" :pins="rightPins" side="right"></pin-strip>
        </div>
    `,
    props: ["pins"],
    methods: {
        getLeftPins() {
            return this.pins.slice(0, this.pins.length / 2);
        },
        getRightPins() {
            return this.pins.slice(this.pins.length / 2).reverse();
        },
        pinClicked(pin) {
            this.$emit("pinClicked", pin);
        }
    },
    created() {
        this.leftPins = this.getLeftPins();
        this.rightPins = this.getRightPins();
    }
});

Vue.component("ic-display", {
    template: `
        <div class="icContainer">
            <div class="header">
                <span class="id">{{ic.id}}  <a :href="ic.datasheet">DS</a></span>
                <span>{{ic.name}}</span>
            </div>
            <ic :pins="ic.pins" @pinClicked="update($event, ic)"></ic>
        </div>
    `,
    props: ["ic"],
    data() {
        return {
        }
    },
    methods: {
        update(pin, ic) {
            pin.state = !pin.state;
            ic.update(pin);
        }
    }
});

new Vue({
    el: 'div#appContainer',
    data() {
        return {
            ics: ics
        };
    },
    created() {
    }
});