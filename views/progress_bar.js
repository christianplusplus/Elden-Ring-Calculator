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
    <img :style="{opacity:Math.min(Math.max((progress*7-0),0),1)}" :src="srcs[0]"/>
    <img :style="{opacity:Math.min(Math.max((progress*7-1),0),1)}" :src="srcs[1]"/>
    <img :style="{opacity:Math.min(Math.max((progress*7-2),0),1)}" :src="srcs[2]"/>
    <img :style="{opacity:Math.min(Math.max((progress*7-3),0),1)}" :src="srcs[3]"/>
    <img :style="{opacity:Math.min(Math.max((progress*7-4),0),1)}" :src="srcs[4]"/>
    <img :style="{opacity:Math.min(Math.max((progress*7-5),0),1)}" :src="srcs[5]"/>
    <img :style="{opacity:Math.min(Math.max((progress*7-6),0),1)}" :src="srcs[6]"/>
</div>
`,
};