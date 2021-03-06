var classResultForm = {
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
        percentModified(attribute) {
            var currentStats = Object.assign({}, this.result.attributes, {vig:this.args.attributes.vig,min:this.args.attributes.min,end:this.args.attributes.end});
            var totalPoints = Object.entries(currentStats).map(([name,value]) => Math.max(value, this.result.class.class_stats[name])).reduce((a,b)=>a+b);
            var spentPoints = totalPoints - Object.values(this.result.class.class_stats).reduce((a,b)=>a+b);
            
            if(this.result.attributes.hasOwnProperty(attribute))
                return (this.result.attributes[attribute] - this.result.class.class_stats[attribute]) / spentPoints;
            return (Math.max(this.args.attributes[attribute] - this.result.class.class_stats[attribute], 0)) / spentPoints;
        },
    },
    template:`
<div class="class_result elden_sheet">
    <div class="attribute_result elden_sheet">
        <div>
            <div>VIG</div><div :style="{'color': mixWhiteBlueRed(percentModified('vig'))}">{{ Math.max(args.attributes.vig, result.class.class_stats.vig) }}</div>
        </div>
        <div>
            <div>MIN</div><div :style="{'color': mixWhiteBlueRed(percentModified('min'))}">{{ Math.max(args.attributes.min, result.class.class_stats.min) }}</div>
        </div>
        <div>
            <div>END</div><div :style="{'color': mixWhiteBlueRed(percentModified('end'))}">{{ Math.max(args.attributes.end, result.class.class_stats.end) }}</div>
        </div>
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
    <img :src="'https://eldenring.wiki.fextralife.com/file/Elden-Ring/' + result.class.class_name + '_class_elden_ring_wiki_guide_270px.png'"/>
</div>
`,
};