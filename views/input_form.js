var inputForm = {
    props: {
        args: Object,
    },
    data() { 
        return {
            attack_types: [
                'physical',
                'magic',
                'fire',
                'lightning',
                'holy',
            ],
            attack_sources: [
                'str',
                'dex',
                'int',
                'fai',
                'arc',
            ],
        }
    },
    methods: {
        disjunction(a, b) {
            return function(x) { return a(x) || b(x) };
        },
        extended_weapons() {
            //copy the weapons
            var weapons = JSON.parse(JSON.stringify(
                this.args.optimize_weapon ?
                    this.filtered_weapons :
                    [this.args.weapon]
                    
            ));
            
            //add element scaling
            for(var weapon of weapons) {
                for(var attack_type of this.args.attack_types) {
                    for(var attack_source of this.args.attack_sources) {
                        var field = attack_type + '_' + attack_source + '_element_scaling';
                        weapon[field] = this.args.attack_element_scaling[weapon['attack_element_scaling_id']][field];
                    }
                }
            }
            
            //add moveset
            for(var weapon of weapons) {
                try{
                    weapon.moveset = this.args.motion_values[weapon.base_weapon_name][this.moveset.moveset_name];
                }catch{console.log(weapon)}
            }
            
            
            return weapons;
        },
        extended_enemy() {
            return Object.assign({}, this.args.enemy, this.args.difficulty_scaling[this.args.enemy['SpEffect ID']]);
        },
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
            if(this.args.options.must_have_required_attributes && !this.args.optimize_attributes) {
                constraints.push(weapon => weapon.required_str <= this.args.attributes.str);
                constraints.push(weapon => weapon.required_dex <= this.args.attributes.dex);
                constraints.push(weapon => weapon.required_int <= this.args.attributes.int);
                constraints.push(weapon => weapon.required_fai <= this.args.attributes.fai);
                constraints.push(weapon => weapon.required_arc <= this.args.attributes.arc);
            }
            return constraints;
        },
        filtered_weapons() {
            var filtered_weapons = this.args.weapons.filter(weapon => this.constraints.every(constraint => constraint(weapon)));
            this.args.weapon = filtered_weapons.find(weapon => weapon === this.args.weapon);
            return filtered_weapons;
        },
        formEvent() {
            return [
                this.args.attributes,
                this.args.enemy,
                this.args.modifiers,
                this.args.options,
                this.args.weapon,
                this.args.optimize_class,
                this.args.optimize_attributes,
                this.args.optimize_weapon,
                this.args.disabled,
                this.args.moveset_aggregate,
                this.args.moveset_category,
                this.args.moveset_modifier,
                this.args.is_two_handing,
                this.args.hit_aggregate,
            ];
        },
        has_moveset_modifiers() {
            return 'modifiers' in this.args.movesets[this.args.moveset_category];
        },
        moveset_modifiers() {
            if(this.has_moveset_modifiers)
                return this.args.movesets[this.args.moveset_category].modifiers;
            return {};
        },
        has_valid_moveset_modifier() {
            if(this.has_moveset_modifiers) {
                if(!(this.args.moveset_modifier in this.moveset_modifiers))
                    this.args.moveset_modifier = Object.keys(this.moveset_modifiers)[0];
                return true;
            }
            return false;
        },
        moveset_is_two_handable() {
            if(this.has_valid_moveset_modifier)
                return this.args.movesets[this.args.moveset_category].modifiers[this.args.moveset_modifier].is_two_handable;
            if('is_two_handable' in this.args.movesets[this.args.moveset_category])
                return this.args.movesets[this.args.moveset_category].is_two_handable;
            return false;
        },
        moveset() {
            var formatted_moveset_modifer = this.has_valid_moveset_modifier ? '_' + this.args.moveset_modifier : '';
            var formatted_handedness;
            if(this.moveset_is_two_handable) {
                this.args.options['is_two_handing'] = this.args.is_two_handing;
                formatted_handedness = this.args.is_two_handing ? '_2h' : '_1h';
            }
            else {
                this.args.options['is_two_handing'] = false;
                formatted_handedness = '';
            }
            return {moveset_aggregate: this.args.moveset_aggregate, moveset_name: this.args.moveset_category + formatted_moveset_modifer + formatted_handedness, hit_aggregate: this.args.hit_aggregate};
        },
        has_multi_movesets() {
            if(this.has_moveset_modifiers)
                return this.args.movesets[this.args.moveset_category].modifiers[this.args.moveset_modifier].has_multiple_inputs;
            return this.args.movesets[this.args.moveset_category].has_multiple_inputs;
        },
    },
    watch: {
        formEvent: {
            handler() {
                if(!(this.args.optimize_class || this.args.optimize_attributes || this.args.optimize_weapon) && !this.args.disabled && this.args.weapon)
                    this.$emit('quick_run', 'optimize', 'damage', this.args.attributes, this.args.optimize_class, this.args.optimize_attributes, this.args.target_level, this.args.floatingPoints, this.extended_weapons(), this.extended_enemy(), this.moveset.moveset_aggregate, this.moveset.hit_aggregate, this.args.modifiers, this.args.options);
            },
            deep: true,
            flush: 'post',
        },
    },
    template:`
<div class="optimal_weapon_attribute_form elden_sheet">
    <div>
        <div>
            <input name="optimizeClass" type="checkbox" v-model="args.optimize_class" :true-value=true :false-value=false>
            <label for="optimizeClass"> Optimize Class</label>
        </div>
        <div>
            <input name="optimizeWeapon" type="checkbox" v-model="args.optimize_weapon" :true-value=true :false-value=false>
            <label for="optimizeWeapon"> Optimize Weapon</label>
        </div>
        <div>
            <input name="optimizeAttributes" type="checkbox" v-model="args.optimize_attributes" :true-value=true :false-value=false>
            <label for="optimizeAttributes"> Optimize Attributes</label>
        </div>
    </div>
    <div>
        <div>
            <div class="select_header">
                <label for="weaponTypes">Weapon Types</label>
                <img src="assets/cancel.png" height="16" width="16" @click="args.weapon_types_selected=[]" :style="args.weapon_types_selected.length?{visibility:'visible',cursor:'pointer'}:{visibility:'hidden',cursor:'auto'}">
            </div>
            <select size="14" name="weaponTypes" v-model="args.weapon_types_selected" multiple>
                <option v-for="weapon_type in args.weapon_types">{{ weapon_type }}</option>
            </select>
        </div>
        <div>
            <div class="select_header">
                <label for="affinities">Affinities</label>
                <img src="assets/cancel.png" height="16" width="16" @click="args.affinities_selected=[]" :style="args.affinities_selected.length?{visibility:'visible',cursor:'pointer'}:{visibility:'hidden',cursor:'auto'}">
            </div>
            <select class="selectNoScroll" size="14" name="affinities" v-model="args.affinities_selected" multiple>
                <option v-for="affinity in args.affinities">{{ affinity }}</option>
            </select>
        </div>
        <div>
            <input type="checkbox" name="isDualWieldable" v-model="args.options.is_dual_wieldable" :true-value=true :false-value=false>
            <label for="isDualWieldable"> Dual Wieldable</label>
            <br>
            <input type="checkbox" name="meetsAttributeRequirements" v-model="args.options.must_have_required_attributes" :true-value=true :false-value=false>
            <label for="meetsAttributeRequirements"> Required Attributes</label>
        </div>
        <div>
            <button type="button" @click="$emit('blank_slate')">Blank Slate</button>
            <br>
            <br>
            <button type="button" @click="$emit('load_class')">Load Class</button>
            <br>
            <select v-model="args.clazz">
                <option v-for="[class_name, clazz] in Object.entries(args.class_stats)" :value="clazz">
                    {{ class_name[0].toUpperCase() + class_name.slice(1) }}
                </option>
            </select>
            <div v-if="args.optimize_class && args.optimize_attributes">
                <br>
                <label for="lvl">Target Level</label>
                <br>
                <input type="number" v-model.number="args.target_level" min="1" max="713" style="width:40px">
            </div>
            <div v-if="!args.optimize_class && args.optimize_attributes">
                <br>
                <label for="floatingPoints">Float Points</label>
                <br>
                <input type="number" v-model.number="args.floatingPoints" min="0" max="445" style="width:40px"> 
            </div>
        </div>
        <div>
            <div style="font-size:12px">
                <span v-if="args.optimize_attributes || args.optimize_class">Min. </span>Attributes
            </div>
            <table>
                <tr v-if="args.optimize_class">
                    <td>
                        <input type="number" v-model.number="args.attributes.vig" min="1" max="99">
                    </td>
                    <td>
                        <label for="vig">VIG</label>
                    </td>
                </tr>
                <tr v-if="args.optimize_class">
                    <td>
                        <input type="number" v-model.number="args.attributes.min" min="1" max="99">
                    </td>
                    <td>
                        <label for="min">MIN</label>
                    </td>
                </tr>
                <tr v-if="args.optimize_class">
                    <td>
                        <input type="number" v-model.number="args.attributes.end" min="1" max="99">
                    </td>
                    <td>
                        <label for="end">END</label>
                    </td>
                </tr>
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
    <div v-if="!args.optimize_weapon">
        <div>
            <label for="weapon">Weapon </label>
            <select name="weapon" v-model="args.weapon">
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
    <div>
        <div>
            <label for="moveset">Motion</label><br>
            <select name="moveset" v-model="args.moveset_category">
                <option v-for="move in Object.keys(args.movesets)" :value="move">
                    {{ args.movesets[move].display_name }}
                </option>
            </select>
        </div>
        <div v-if="has_moveset_modifiers">
            <label for="input">Input Type</label><br>
            <select name="input" v-model="args.moveset_modifier">
                <option v-for="modifier in Object.keys(moveset_modifiers)" :value="modifier">
                    {{ modifier.charAt(0).toUpperCase() + modifier.slice(1) }}
                </option>
            </select>
        </div>
        <div v-if="moveset_is_two_handable">
            <label for="grip">Grip</label><br>
            <select name="grip" v-model="args.is_two_handing">
                <option v-for="is_two_handing in [false, true]" :value="is_two_handing">
                    {{ (is_two_handing ? 'Two Handing' : 'One Handing') }}
                </option>
            </select>
        </div>
        <div v-if="has_multi_movesets">
            <label for="aggregate">Input Aggregate</label><br>
            <select name="aggregate" v-model="args.moveset_aggregate">
                <option v-for="aggregate in args.aggregates" :value="aggregate">
                    {{ aggregate.charAt(0).toUpperCase() + aggregate.slice(1) }}
                </option>
            </select>
        </div>
        <div>
            <label for="hit">Hit Aggregate</label><br>
            <select name="hit" v-model="args.hit_aggregate">
                <option v-for="aggregate in args.aggregates" :value="aggregate">
                    {{ aggregate.charAt(0).toUpperCase() + aggregate.slice(1) }}
                </option>
            </select>
        </div>
    </div>
    <button v-if="(args.optimize_class || args.optimize_attributes || args.optimize_weapon) && (args.optimize_weapon || args.weapon)" :disabled="args.disabled" @click="$emit('run', 'optimize', 'damage', args.attributes, args.optimize_class, args.optimize_attributes, args.target_level, args.floatingPoints, extended_weapons(), extended_enemy(), moveset.moveset_aggregate, moveset.hit_aggregate, args.modifiers, args.options)">Calculate!</button>
</div>`,
};