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
            
            //add upgradable stats
            for(var weapon of weapons) {
                try{
                    var upgrade_level = this.args.optimize_weapon ?
                        Math.min(weapon.max_upgrade_level, weapon.affinity == 'Somber' ? this.args.somber_upgrade_cap : this.args.upgrade_cap) :
                        this.args.upgrade_level;
                
                    weapon.physical_attack_power *= this.args.reinforce[weapon.reinforce_id + upgrade_level].physical;
                    weapon.magic_attack_power *= this.args.reinforce[weapon.reinforce_id + upgrade_level].magic;
                    weapon.fire_attack_power *= this.args.reinforce[weapon.reinforce_id + upgrade_level].fire;
                    weapon.lightning_attack_power *= this.args.reinforce[weapon.reinforce_id + upgrade_level].lightning;
                    weapon.holy_attack_power *= this.args.reinforce[weapon.reinforce_id + upgrade_level].holy;
                    
                    weapon.str_scaling *= this.args.reinforce[weapon.reinforce_id + upgrade_level].str;
                    weapon.dex_scaling *= this.args.reinforce[weapon.reinforce_id + upgrade_level].dex;
                    weapon.int_scaling *= this.args.reinforce[weapon.reinforce_id + upgrade_level].int;
                    weapon.fai_scaling *= this.args.reinforce[weapon.reinforce_id + upgrade_level].fai;
                    weapon.arc_scaling *= this.args.reinforce[weapon.reinforce_id + upgrade_level].arc;
                    
                    var passive_offset
                    var passive_value
                    var passive_type
                    if('passive_id_1' in weapon) {
                        passive_offset = this.args.reinforce[weapon.reinforce_id + upgrade_level].passive_offset_1;
                        try{
                            passive_value = this.args.passives[weapon.passive_id_1 + passive_offset].value
                            passive_type = this.args.passives[weapon.passive_id_1 + passive_offset].type
                            weapon[passive_type] += passive_value
                        }catch(e){if(this.args.dev_mode)console.log('No defined passive for weapon:'+weapon.name+' id:'+weapon.passive_id_1+' offset:'+passive_offset)}
                    }
                    if('passive_id_2' in weapon) {
                        passive_offset = this.args.reinforce[weapon.reinforce_id + upgrade_level].passive_offset_2;
                        try{
                            passive_value = this.args.passives[weapon.passive_id_2 + passive_offset].value
                            passive_type = this.args.passives[weapon.passive_id_2 + passive_offset].type
                            weapon[passive_type] += passive_value
                        }catch(e){if(this.args.dev_mode)console.log('No defined passive for weapon:'+weapon.name+' id:'+weapon.passive_id_2+' offset:'+passive_offset)}
                    }
                    if('passive_id_3' in weapon) {
                        try{
                            passive_value = this.args.passives[weapon.passive_id_3].value
                            passive_type = this.args.passives[weapon.passive_id_3].type
                            weapon[passive_type] += passive_value
                        }catch(e){if(this.args.dev_mode)console.log('No defined passive for weapon:'+weapon.name+' id:'+weapon.passive_id_3)}
                    }
                    
                    if('bonus' in weapon) {
                        for(var passive of weapon.bonus.passives) {
                            try{
                                passive_value = this.args.passives[passive].value
                                passive_type = this.args.passives[passive].type
                                weapon[passive_type] += passive_value
                            }catch(e){if(this.args.dev_mode)console.log('No defined passive for weapon:'+weapon.name+' id:'+weapon.passive)}
                        }
                    }
                    
                    if('bonus' in weapon) {
                        weapon.physical_attack_power += weapon.bonus.physical_attack_power || 0;
                        weapon.magic_attack_power += weapon.bonus.magic_attack_power || 0;
                        weapon.fire_attack_power += weapon.bonus.fire_attack_power || 0;
                        weapon.lightning_attack_power += weapon.bonus.lightning_attack_power || 0;
                        weapon.holy_attack_power += weapon.bonus.holy_attack_power || 0;
                    }
                
                    //add moveset
                    weapon.moveset = this.args.motion_values[weapon.motion_name][this.moveset.moveset_name];
                }
                catch(e){
                    console.log(e);
                    console.log(weapon);
                }
            }
            
            
            
            return weapons;
        },
        extended_enemy() {
            return Object.assign({}, this.args.enemy, this.args.difficulty_scaling[this.args.enemy.difficulty_scaling_id]);
        },
    },
    computed: {
        constraints() {
            var constraints = [];
            if(this.args.weapon_types_selected.length && this.args.weapon_types_selected.length < this.args.weapon_types.length)
                constraints.push(this.args.weapon_types_selected.map(weapon_type => (weapon => weapon.weapon_type == weapon_type)).reduce(this.disjunction));
            if(this.args.affinities_selected.length && this.args.affinities_selected.length < this.args.affinities.length)
                constraints.push(this.args.affinities_selected.map(affinity => (weapon => weapon.affinity == affinity)).reduce(this.disjunction));
            if(this.args.ammo_types_selected.length && this.args.ammo_types_selected.length < this.args.ammo_types.length)
                constraints.push(this.args.ammo_types_selected.map(ammo => (weapon => weapon.ammo == ammo)).reduce(this.disjunction));
            if(this.args.options.must_have_required_attributes && !this.args.optimize_attributes) {
                constraints.push(weapon => this.is_two_handing ? weapon.str_requirement <= this.args.attributes.str * 1.5 : weapon.str_requirement <= this.args.attributes.str);
                constraints.push(weapon => weapon.dex_requirement <= this.args.attributes.dex);
                constraints.push(weapon => weapon.int_requirement <= this.args.attributes.int);
                constraints.push(weapon => weapon.fai_requirement <= this.args.attributes.fai);
                constraints.push(weapon => weapon.arc_requirement <= this.args.attributes.arc);
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
                this.args.upgrade_level,
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
        is_two_handing() {
            this.args.options['is_two_handing'] = this.moveset_is_two_handable && this.args.is_two_handing;
            return this.args.options['is_two_handing'];
        },
        moveset() {
            var formatted_moveset_modifer = this.has_valid_moveset_modifier ? '_' + this.args.moveset_modifier : '';
            var formatted_handedness;
            if(this.moveset_is_two_handable)
                formatted_handedness = this.is_two_handing ? '_2h' : '_1h';
            else
                formatted_handedness = '';
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
                if(!(this.args.optimize_class || this.args.optimize_attributes || this.args.optimize_weapon) && !this.args.disabled && this.args.weapon && this.args.upgrade_level <= parseInt(this.args.weapon.max_upgrade_level))
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
            <div class="select_header">
                <label for="ammo">Ammunition</label>
                <img src="assets/cancel.png" height="16" width="16" @click="args.ammo_types_selected=[]" :style="args.ammo_types_selected.length?{visibility:'visible',cursor:'pointer'}:{visibility:'hidden',cursor:'auto'}">
            </div>
            <select size="14" name="ammo" v-model="args.ammo_types_selected" multiple>
                <option v-for="ammo in args.ammo_types">{{ ammo }}</option>
            </select>
        </div>
        <div>
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
    <div>
        <div>
            <input type="checkbox" name="meetsAttributeRequirements" v-model="args.options.must_have_required_attributes" :true-value=true :false-value=false>
            <label for="meetsAttributeRequirements"> Required Attributes</label>
        </div>
    </div>
    <div v-if="args.optimize_weapon">
        <div>
            <label for="upgrade_cap">Upgrade Cap </label>
            <input type="number" v-model.number="args.upgrade_cap" min="0" max="25">
        </div>
        <div>
            <label for="somber_upgrade_cap">Somber Upgrade Cap </label>
            <input type="number" v-model.number="args.somber_upgrade_cap" min="0" max="10">
        </div>
    </div>
    <div v-else>
        <div>
            <label for="weapon">Weapon </label>
            <select name="weapon" v-model="args.weapon">
                <option v-for="weapon in filtered_weapons" :value="weapon">
                    {{ weapon.name }}
                </option>
            </select>
        </div>
        <div v-if="args.weapon">
            <label for="upgrade_level">Upgrade Level </label>
            <input type="number" v-model.number="args.upgrade_level" min="0" :max="args.weapon.max_upgrade_level">
        </div>
    </div>
    <div>
        <div>
            <label for="enemy">Enemy </label>
            <select name="enemy" v-model="args.enemy">
                <option v-for="boss in args.bosses" :value="boss">
                    {{ boss.name }}
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
    <button v-if="(args.optimize_class || args.optimize_attributes || args.optimize_weapon) && (args.optimize_weapon || (args.weapon && args.upgrade_level <= parseInt(args.weapon.max_upgrade_level)))" :disabled="args.disabled" @click="$emit('run', 'optimize', 'damage', args.attributes, args.optimize_class, args.optimize_attributes, args.target_level, args.floatingPoints, extended_weapons(), extended_enemy(), moveset.moveset_aggregate, moveset.hit_aggregate, args.modifiers, args.options)">Calculate!</button>
</div>`,
};