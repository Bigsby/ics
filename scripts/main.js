import ics from "./ics/ics.js";

Vue.component("pin", {
    template: document.getElementById("pin-template"),
    props: ["pin", "side"],
    methods: {
        clicked() {
            if (this.pin.acceptInput()) {
                this.$emit("clicked", this.pin);
            }
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
            search: "",
            displayLegend: false
        };
    },
    watch: {
        search: function (newValue) {
            if (newValue) {
                const regEx = new RegExp(newValue.trim(), "i");
                this.ics = this.completeList.filter(ic => regEx.test(ic.id) || regEx.test(ic.name));
            } else {
                this.ics = this.completeList;
            }
        }
    },
    created() {
        this.completeList = ics;
        this.ics = this.completeList;
    },
    mounted() {
        this.search = window.location.hash ? window.location.hash.substr(1) : "";
        this.$refs.search.focus();
    }
});