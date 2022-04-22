var progressBar = {
    props: {
        progress: Number,
    },
    methods: {
    },
    template:`
<div class="runes">
    <img :style="{opacity:Math.min(Math.max((progress*7-0),0),1)}" src="assets/godricks-rune.png"/>
    <img :style="{opacity:Math.min(Math.max((progress*7-1),0),1)}" src="assets/unborn-rune.png"/>
    <img :style="{opacity:Math.min(Math.max((progress*7-2),0),1)}" src="assets/radahns-rune.png"/>
    <img :style="{opacity:Math.min(Math.max((progress*7-3),0),1)}" src="assets/morgotts-rune.png"/>
    <img :style="{opacity:Math.min(Math.max((progress*7-4),0),1)}" src="assets/rykards-rune.png"/>
    <img :style="{opacity:Math.min(Math.max((progress*7-5),0),1)}" src="assets/mohgs-rune.png"/>
    <img :style="{opacity:Math.min(Math.max((progress*7-6),0),1)}" src="assets/malenias-rune.png"/>
</div>
`,
};