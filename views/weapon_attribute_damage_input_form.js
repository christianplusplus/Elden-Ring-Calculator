var weaponAttributeDamageInputForm = {
    props: {
        args: Object,
        attack_attributes: Object,
    },
    data() {
        return {
            get_damage_pretty: get_damage_pretty,
            weapon: {},
        }
    },
    computed: {
        constraints() {
            var constraints = [];
            if(this.args.weapon_types_selected.length && this.args.weapon_types_selected.length < this.args.weapon_types.length)
                constraints.push(this.args.weapon_types_selected.map(weapon_type => (weapon => weapon.weapon_type == weapon_type)).reduce(this.disjunction));
            if(this.args.affinities_selected.length && this.args.affinities_selected.length < this.args.affinities.length)
                constraints.push(this.args.affinities_selected.map(affinity => (weapon => weapon.affinity == affinity)).reduce(this.disjunction));
            if(this.args.is_dual_wieldable)
                constraints.push(weapon => weapon.dual_wieldable);
            if(this.args.must_have_required_attributes) {
                constraints.push(weapon => weapon.required_str <= this.args.attributes.str);
                constraints.push(weapon => weapon.required_dex <= this.args.attributes.dex);
                constraints.push(weapon => weapon.required_int <= this.args.attributes.int);
                constraints.push(weapon => weapon.required_fai <= this.args.attributes.fai);
                constraints.push(weapon => weapon.required_arc <= this.args.attributes.arc);
            }
            return constraints;
        },
        filtered_weapons() {
            return this.args.weapons.filter(weapon => this.constraints.every(constraint => constraint(weapon)));
        },
    },
    methods: {
        disjunction(a, b) {
            return function(x) { return a(x) || b(x) };
        },
    },
    template:`
<div class="optimal_weapon_attribute_form elden_sheet">
    <div>
        <div>
            <label for="weaponTypes">Weapon Types</label>
            <br>
            <select size="14" name="weaponTypes" v-model="args.weapon_types_selected" multiple>
                <option v-for="weapon_type in args.weapon_types">{{ weapon_type }}</option>
            </select>
        </div>
        <div>
            <label for="affinities">Affinities</label>
            <br>
            <select class="selectNoScroll" size="14" name="affinities" v-model="args.affinities_selected" multiple>
                <option v-for="affinity in args.affinities">{{ affinity }}</option>
            </select>
        </div>
        <div>
            <input type="checkbox" name="isDualWieldable" v-model="args.is_dual_wieldable" :true-value=true :false-value=false>
            <label for="isDualWieldable"> Dual Wieldable</label>
            <br>
            <input type="checkbox" name="isTwoHanding" v-model="args.is_two_handing" :true-value=true :false-value=false>
            <label for="isTwoHanding"> Two Handing</label>
            <br>
            <input type="checkbox" name="meetsAttributeRequirements" v-model="args.must_have_required_attributes" :true-value=true :false-value=false>
            <label for="meetsAttributeRequirements"> Required Attributes</label>
        </div>
        <div>
            <button type="button" @click="$emit('load_class')">Load Class</button>
            <br>
            <select v-model="args.clazz">
                <option v-for="[class_name, clazz] in Object.entries(args.class_stats)" :value="clazz">
                    {{ class_name[0].toUpperCase() + class_name.slice(1) }}
                </option>
            </select>
        </div>
        <div>
            <table>
                <tr>
                    <td>
                        <input type="number" v-model.number="args.attributes.str" min="1" max="99">
                    </td>
                    <td>
                        <label for="str">STR</label>
                    </td>
                </tr>
                <tr>
                    <td>
                        <input type="number" v-model.number="args.attributes.dex" min="1" max="99">
                    </td>
                    <td>
                        <label for="dex">DEX</label>
                    </td>
                </tr>
                <tr>
                    <td>
                        <input type="number" v-model.number="args.attributes.int" min="1" max="99">
                    </td>
                    <td>
                        <label for="int">INT</label>
                    </td>
                </tr>
                <tr>
                    <td>
                        <input type="number" v-model.number="args.attributes.fai" min="1" max="99">
                    </td>
                    <td>
                        <label for="fai">FAI</label>
                    </td>
                </tr>
                <tr>
                    <td>
                        <input type="number" v-model.number="args.attributes.arc" min="1" max="99">
                    </td>
                    <td>
                        <label for="arc">ARC</label>
                    </td>
                </tr>
            </table>
        </div>
    </div>
    <div>
        <div>
            <label for="weapon">Weapon </label>
            <select name="weapon" v-model="weapon">
                <option v-for="weapon in filtered_weapons" :value="weapon">
                    {{ weapon.name }}
                </option>
            </select>
        </div>
    </div>
    <div>
        <div>
            <label for="enemy">Enemy </label>
            <select name="enemy" v-model="args.enemy">
                <option v-for="boss in args.bosses" :value="boss">
                    {{ boss.Name }}
                </option>
            </select>
        </div>
    </div>
    <button :disabled="args.disabled" @click="$emit('run', get_damage_pretty, weapon, attack_attributes)">Calculate!</button>
</div>`,
};

