var classWeaponAttributeInputForm = {
    props: {
        args: Object,
        target_attributes: Object,
    },
    methods: {
        disjunction(a, b) {
            return function(x) { return a(x) || b(x) };
        },
    },
    computed: {
        text_constraints() {
            var constraints = [];
            if(this.args.weapon_types_selected.length && this.args.weapon_types_selected.length < this.args.weapon_types.length)
                constraints.push(this.args.weapon_types_selected.map(weapon_type=>`weapon.weapon_type=='${weapon_type}'`).reduce((a,b)=>a+'||'+b));
            if(this.args.affinities_selected.length && this.args.affinities_selected.length < this.args.affinities.length)
                constraints.push(this.args.affinities_selected.map(affinity=>`weapon.affinity=='${affinity}'`).reduce((a,b)=>a+'||'+b));
            if(this.args.is_dual_wieldable)
                constraints.push('weapon.dual_wieldable');
            return constraints;
        }
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
            <table>
                <tr>
                    <td>
                        <input type="number" v-model.number="args.attributes.vig" min="0" max="99">
                    </td>
                    <td>
                        <label for="vig">VIG</label>
                    </td>
                </tr>
                <tr>
                    <td>
                        <input type="number" v-model.number="args.attributes.min" min="0" max="99">
                    </td>
                    <td>
                        <label for="min">MIN</label>
                    </td>
                </tr>
                <tr>
                    <td>
                        <input type="number" v-model.number="args.attributes.end" min="0" max="99">
                    </td>
                    <td>
                        <label for="end">END</label>
                    </td>
                </tr>
                <tr>
                    <td>
                        <input type="number" v-model.number="args.attributes.str" min="0" max="99">
                    </td>
                    <td>
                        <label for="str">STR</label>
                    </td>
                </tr>
                <tr>
                    <td>
                        <input type="number" v-model.number="args.attributes.dex" min="0" max="99">
                    </td>
                    <td>
                        <label for="dex">DEX</label>
                    </td>
                </tr>
                <tr>
                    <td>
                        <input type="number" v-model.number="args.attributes.int" min="0" max="99">
                    </td>
                    <td>
                        <label for="int">INT</label>
                    </td>
                </tr>
                <tr>
                    <td>
                        <input type="number" v-model.number="args.attributes.fai" min="0" max="99">
                    </td>
                    <td>
                        <label for="fai">FAI</label>
                    </td>
                </tr>
                <tr>
                    <td>
                        <input type="number" v-model.number="args.attributes.arc" min="0" max="99">
                    </td>
                    <td>
                        <label for="arc">ARC</label>
                    </td>
                </tr>
                <tr>
                    <td>
                        <input type="number" v-model.number="args.target_level" min="0" max="713">
                    </td>
                    <td>
                        <label for="lvl">Target Level</label>
                    </td>
                </tr>
                <tr>
                    <td colspan="2">
                        <button type="button" @click="$emit('blank_slate')">Blank Slate</button>
                    </td>
                </tr>
            </table>
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
    <button :disabled="args.disabled" @click="$emit('run_with_predicates', optimize_class_weapon_and_attributes, text_constraints, args.attributes, args.target_level)">Calculate!</button>
</div>`,
};

