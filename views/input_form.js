var inputForm = {
    props: {
        args: Object,
        attack_attributes: Object,
        state: String,
    },
    emits: ['run', 'load_class'],
    template:`
<weaponAttributeInputForm v-if="state=='weapon_attribute'"
    :args="args"
    :attack_attributes="attack_attributes"
    @run_with_predicates="(...args) => $emit('run_with_predicates', ...args)"
    @load_class="(...args) => $emit('load_class', ...args)"
/>
<classWeaponAttributeInputForm v-if="state=='class_weapon_attribute'"
    :args="args"
    :target_attributes="args.attributes"
    @run_with_predicates="(...args) => $emit('run_with_predicates', ...args)"
/>
<weaponAttributeDamageInputForm v-if="state=='damage_calc'"
    :args="args"
    :attack_attributes="attack_attributes"
    :target_attributes="args.attributes"
    @run="(...args) => $emit('run', ...args)"
/>`,
};

