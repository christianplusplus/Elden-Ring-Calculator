var tweakButton = {
    props: {
        args: Object,
        result: Object,
    },
    methods: {
        tweak() {
            if('attributes' in this.result) {
                this.args.attributes.str = this.result.attributes.str;
                this.args.attributes.dex = this.result.attributes.dex;
                this.args.attributes.int = this.result.attributes.int;
                this.args.attributes.fai = this.result.attributes.fai;
                this.args.attributes.arc = this.result.attributes.arc;
            }
            this.args.optimize_class = false;
            this.args.optimize_weapon = false;
            this.args.optimize_attributes = false;
            this.args.weapon = this.args.weapons.find(weapon => weapon.name == this.result.weapon.name);
            this.args.upgrade_level = this.args.weapon.max_upgrade_level == '25' ? this.args.upgrade_cap : this.args.somber_upgrade_cap;
        },
    },
    template:`
<div class="div_button elden_sheet" @click="tweak">
    <h1>TWEAK RESULT</h1>
</div>
`,
};