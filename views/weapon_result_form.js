var weaponResultForm = {
    props: {
        result: Object,
    },
    template:`
<div class="weapon_result elden_sheet">
    <div class="t0">
        <div style="font-size:20px;color:gold;">{{ result.weapon.name }}</div>
        <div class='stat_box'>
            <div><div>{{ result.weapon.weapon_type }}</div></div>
            <div><div>{{ result.weapon.physical_damage_types.join('/') }}</div></div>
            <div><div>{{ result.weapon.affinity }}</div></div>
            <div><div>{{ 'Is ' + (result.weapon.dual_wieldable ? '' : 'Not') + ' Dual Wieldable' }}</div></div>
            <div><div>Weight</div><div>{{ result.weapon.weight }}</div></div>
            <div><div>From</div><a style="color:cyan;" :href="'https://eldenring.wiki.fextralife.com/'+result.weapon.base_weapon_name.replaceAll(' ', '+')">{{ result.weapon.base_weapon_name }}</a></div>
        </div>
    </div>
    <div class="p0 damage_result">
        <div class="anim_fire">{{ result.damage }}</div>
    </div>
    <div class="t1">
        <div>Attack Power</div>
        <div class='stat_box'>
            <div>
                <div>Physical</div>
                <div>{{ result.weapon.base_attack_power.physical }}</div>
                <div>{{ result.weapon.bonus_attack_power.physical ? '+' : '' }}</div>
                <div>{{ result.weapon.bonus_attack_power.physical || '' }}</div>
                <div>=</div>
                <div>{{ result.weapon.attack_power.physical }}</div>
            </div>
            <div>
                <div>Magic</div>
                <div>{{ result.weapon.base_attack_power.magic }}</div>
                <div>{{ result.weapon.bonus_attack_power.magic ? '+' : '' }}</div>
                <div>{{ result.weapon.bonus_attack_power.magic || '' }}</div>
                <div>=</div>
                <div>{{ result.weapon.attack_power.magic }}</div>
            </div>
            <div>
                <div>Fire</div>
                <div>{{ result.weapon.base_attack_power.fire }}</div>
                <div>{{ result.weapon.bonus_attack_power.fire ? '+' : '' }}</div>
                <div>{{ result.weapon.bonus_attack_power.fire || '' }}</div>
                <div>=</div>
                <div>{{ result.weapon.attack_power.fire }}</div>
            </div>
            <div>
                <div>Lightning</div>
                <div>{{ result.weapon.base_attack_power.lightning }}</div>
                <div>{{ result.weapon.bonus_attack_power.lightning ? '+' : '' }}</div>
                <div>{{ result.weapon.bonus_attack_power.lightning || '' }}</div>
                <div>=</div>
                <div>{{ result.weapon.attack_power.lightning }}</div>
            </div>
            <div>
                <div>Holy</div>
                <div>{{ result.weapon.base_attack_power.holy }}</div>
                <div>{{ result.weapon.bonus_attack_power.holy ? '+' : '' }}</div>
                <div>{{ result.weapon.bonus_attack_power.holy || '' }}</div>
                <div>=</div>
                <div>{{ result.weapon.attack_power.holy }}</div>
            </div>
        </div>
    </div>
    <div class="t2">
        <div>Attribute Scaling</div>
        <div class='stat_box'>
            <div><div>Str</div><div>{{ result.weapon.str_scaling_grade }}</div><div></div><div></div><div>Dex</div><div>{{ result.weapon.dex_scaling_grade }}</div></div>
            <div><div>Int</div><div>{{ result.weapon.int_scaling_grade }}</div><div></div><div></div><div>Fai</div><div>{{ result.weapon.fai_scaling_grade }}</div></div>
            <div><div>Arc</div><div>{{ result.weapon.arc_scaling_grade }}</div><div></div><div></div><div></div><div></div></div>
        </div>
    </div>
    <div class="t3">
        <div>Attributes Required</div>
        <div class='stat_box'>
            <div><div>Str</div><div>{{ result.weapon.required_str }}</div><div></div><div></div><div>Dex</div><div>{{ result.weapon.required_dex }}</div></div>
            <div><div>Int</div><div>{{ result.weapon.required_int }}</div><div></div><div></div><div>Fai</div><div>{{ result.weapon.required_fai }}</div></div>
            <div><div>Arc</div><div>{{ result.weapon.required_arc }}</div><div></div><div></div><div></div><div></div></div>
        </div>
    </div>
    <div class="t4">
        <div>Passive Effects</div>
        <div class='stat_box'>
            <div><div>Poison</div><div>{{ result.weapon.poison || '-' }}</div><div></div><div></div><div>Scarlet&nbsp;Rot</div><div>{{ result.weapon.scarlet_rot || '-' }}</div></div>
            <div><div>Bleed</div><div>{{ result.weapon.bleed || '-' }}</div><div></div><div></div><div>Frostbite</div><div>{{ result.weapon.frostbite || '-' }}</div></div>
            <div><div>Sleep</div><div>{{ result.weapon.sleep || '-' }}</div><div></div><div></div><div>Madness</div><div>{{ result.weapon.madness || '-' }}</div></div>
        </div>
    </div>
</div>
`,
};