var WeaponAttributesOptimizer = {
    props: {
        args: Object,
        attack_attributes: Object,
    },
    methods: {
        calculate(minimum_attributes, free_attributes, constraints) {
            document.getElementById('output').innerHTML = 'Loading...';
            weapons = this.args.weapons;
            must_have_required_attributes = this.args.must_have_required_attributes;
            is_two_handing = this.args.is_two_handing;
            enemy = this.args.enemy;
            var result = optimize_weapon_and_attributes(this.attack_attributes, this.args.floatingPoints, this.constraints);
            console.log('done');
            document.getElementById('output').innerHTML = JSON.stringify(result, null, 2);
        },
        disjunction(a, b) {
            return function(x) { return a(x) || b(x) };
        },
    },
    computed: {
        constraints() {
            var constraints = [];
            if(this.args.weapon_types_selected.length && this.args.weapon_types_selected.length < this.args.weapon_types.length)
                constraints.push(this.args.weapon_types_selected.map(weapon_type => (x => x.weapon_type == weapon_type)).reduce(this.disjunction));
            if(this.args.affinities_selected.length && this.args.affinities_selected.length < this.args.affinities.length)
                constraints.push(this.args.affinities_selected.map(affinity => (x => x.affinity == affinity)).reduce(this.disjunction));
            if(this.args.is_dual_wieldable)
                constraints.push(weapon => weapon.dual_wieldable);
            return constraints;
        }
    },
    template:`
<select name="enemy" v-model="args.enemy">
    <option v-for="boss in args.bosses" :value="boss">
        {{ boss.Name }}
    </option>
</select>
<label for="enemy">:Enemy</label>
<br>
<select name="weaponTypes" v-model="args.weapon_types_selected" multiple>
    <option v-for="weapon_type in args.weapon_types">{{ weapon_type }}</option>
</select>
<label for="weaponTypes">:Weapon Types</label>
<br>
<select name="affinities" v-model="args.affinities_selected" multiple>
    <option v-for="affinity in args.affinities">{{ affinity }}</option>
</select>
<label for="affinities">:Affinities</label>
<br>
<input type="checkbox" name="isDualWieldable" v-model="args.is_dual_wieldable" :true-value=true :false-value=false>
<label for="isDualWieldable">:Is Dual Wieldable</label>
<br>
<input type="checkbox" name="isTwoHanding" v-model="args.is_two_handing" :true-value=true :false-value=false>
<label for="isTwoHanding">:Is Two Handing</label>
<br>
<input type="checkbox" name="meetsAttributeRequirements" v-model="must_have_required_attributes" :true-value=true :false-value=false>
<label for="meetsAttributeRequirements">:Meets Attribute Requirements</label>
<br>
<select v-model="args.clazz">
    <option v-for="[class_name, clazz] in Object.entries(args.class_stats)" :value="clazz">
        {{ class_name[0].toUpperCase() + class_name.slice(1) }}
    </option>
</select>
<button type="button" @click="$emit('load_class')">Load Class</button>
<br>
<input type="number" v-model.number="args.str" min="1" max="99">
<label for="str">:Strength</label>
<br>
<input type="number" v-model.number="args.dex" min="1" max="99">
<label for="dex">:Dexterity</label>
<br>
<input type="number" v-model.number="args.int" min="1" max="99">
<label for="int">:Intelligence</label>
<br>
<input type="number" v-model.number="args.fai" min="1" max="99">
<label for="fai">:Faith</label>
<br>
<input type="number" v-model.number="args.arc" min="1" max="99">
<label for="arc">:Arcane</label>
<br>
<input type="number" v-model.number="args.floatingPoints" min="0" max="445">
<label for="floatingPoints">:Floating Points</label>
<br>
<button @click="calculate">Calculate!</button>
`,
};

