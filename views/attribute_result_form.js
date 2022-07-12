var attributeResultForm = {
    props: {
        args: Object,
        result: Object,
    },
    methods: {
        mixWhiteBlueRed(value) {
            var red, green, blue, color;
            if(value > 0) {
                blue = Math.max(Math.min(value, 1), 0.3);
                blue = Math.floor(blue * 255);
                red = (255 - blue).toString(16).padStart(2, '0');
                green = (255 - blue).toString(16).padStart(2, '0');
                color = `#${red}${green}ff`;
            }
            else if(value < 0) {
                red = -value;
                red = Math.max(Math.min(red, 1), 0.5);
                red = Math.floor(red * 255);
                blue = (255 - red).toString(16).padStart(2, '0');
                green = (255 - red).toString(16).padStart(2, '0');
                color = `#ff${green}${blue}`;
            }
            else {
                color = '#ffffff';
            }
            return color;
        },
    },
    template:`
<div class="attribute_result elden_sheet">
    <div>
        <div>STR</div><div :style="{'color': mixWhiteBlueRed((result.attributes.str-args.attributes.str)/args.floatingPoints)}">{{ result.attributes.str }}</div>
    </div>
    <div>
        <div>DEX</div><div :style="{'color': mixWhiteBlueRed((result.attributes.dex-args.attributes.dex)/args.floatingPoints)}">{{ result.attributes.dex }}</div>
    </div>
    <div>
        <div>INT</div><div :style="{'color': mixWhiteBlueRed((result.attributes.int-args.attributes.int)/args.floatingPoints)}">{{ result.attributes.int }}</div>
    </div>
    <div>
        <div>FAI</div><div :style="{'color': mixWhiteBlueRed((result.attributes.fai-args.attributes.fai)/args.floatingPoints)}">{{ result.attributes.fai }}</div>
    </div>
    <div>
        <div>ARC</div><div :style="{'color': mixWhiteBlueRed((result.attributes.arc-args.attributes.arc)/args.floatingPoints)}">{{ result.attributes.arc }}</div>
    </div>
</div>
`,
};