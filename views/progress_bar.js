var progressBar = {
    props: {
        progress: Number,
    },
    data() {
        return {
            srcs: [
                "assets/godricks-rune.png",
                "assets/unborn-rune.png",
                "assets/radahns-rune.png",
                "assets/morgotts-rune.png",
                "assets/rykards-rune.png",
                "assets/mohgs-rune.png",
                "assets/malenias-rune.png",
                "assets/mending-rune-of-death.png",
                "assets/mending-rune-of-perfect-order.png",
            ],
        };
    },
    mounted() {
        for (var i = this.srcs.length - 1; i > 0; i--) {
            var rand = Math.floor(Math.random() * (i + 1));
            [this.srcs[i], this.srcs[rand]] = [this.srcs[rand], this.srcs[i]]
        }
    },
    template:`
<div class="runes">
    <img v-for="i in srcs.length" :style="{opacity:Math.min(Math.max((progress*srcs.length-i+1),0),1)}" :src="srcs[i-1]"/>
</div>
`,
};