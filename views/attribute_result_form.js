var attributeResultForm = {
    props: {
        args: Object,
        result: Object,
    },
    methods: {
        mixWhiteBlueRed(value) {
            var red, green, blue, color;
            if(value > 0) {
                blue = Math.max(Math.min(value, 1), 0.5);
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
        percentModified(attribute) {
            var freePoints = this.args.target_level + 79;
            for(var [attr_name, attr_value] of Object.entries(this.args.attributes))
                freePoints -= Math.max(attr_value, this.args.class_stats[this.result.class][attr_name]);
            
            return (this.result.attributes[attribute] - Math.max(this.args.attributes[attribute], this.args.class_stats[this.result.class][attribute])) / freePoints;
        }
    },
    template:`
<div class="attribute_result elden_sheet" v-if="result.class==null">
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
<div class="attribute_result elden_sheet" v-else>
    <div>
        <div>STR</div><div :style="{'color': mixWhiteBlueRed(percentModified('str'))}">{{ result.attributes.str }}</div>
    </div>
    <div>
        <div>DEX</div><div :style="{'color': mixWhiteBlueRed(percentModified('dex'))}">{{ result.attributes.dex }}</div>
    </div>
    <div>
        <div>INT</div><div :style="{'color': mixWhiteBlueRed(percentModified('int'))}">{{ result.attributes.int }}</div>
    </div>
    <div>
        <div>FAI</div><div :style="{'color': mixWhiteBlueRed(percentModified('fai'))}">{{ result.attributes.fai }}</div>
    </div>
    <div>
        <div>ARC</div><div :style="{'color': mixWhiteBlueRed(percentModified('arc'))}">{{ result.attributes.arc }}</div>
    </div>
</div>
`,
};