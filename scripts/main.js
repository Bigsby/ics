import ics from "./ics.js";

Vue.component("pin", {
    template: document.getElementById("pin-template"),
    props: ["pin", "side"],
    methods: {
        clicked() {
            this.$emit("clicked", this.pin);
        }
    }
});

Vue.component("pin-strip", {
    template: document.getElementById("pin-strip-template"),
    props: ["pins", "side"],
    methods: {
        pinClicked(pin) {
            this.$emit("pinClicked", pin);
        }
    }
});

Vue.component("pin-names", {
    template: document.getElementById("pin-names-template"),
    props: ["pins", "side"]
});

Vue.component("ic-package", {
    template: document.getElementById("ic-package-template"),
    props: ["leftPins", "rightPins"]
});

Vue.component("ic", {
    template: document.getElementById("ic-template"),
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
    template: document.getElementById("ic-display-template"),
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
            ics: [],
            search: ""
        };
    },
    watch: {
        search: function(newValue) {
            if (newValue) {
                const regEx = new RegExp(newValue, "i");
                this.ics = this.completeList.filter(ic => regEx.test(ic.id) || regEx.test(ic.name));
            } else {
                this.ics = this.completeList;
            }
        }
    },
    created() {
        this.completeList = ics;
        this.ics = this.completeList;
    }
});