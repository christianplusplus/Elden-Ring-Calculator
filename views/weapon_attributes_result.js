var WeaponAttributesResult = {
    props: {
        state: String,
        progress: Number,
        result: Object,
        args: Object,
    },
    methods: {
        mixWhiteBlue(blue) {
            blue = Math.max(Math.min(blue, 1), 0);
            blue = Math.floor(blue * 255);
            var red = (255 - blue).toString(16);
            var green = (255 - blue).toString(16);
            var color = `#${red}${green}ff`;
            return color;
        },
    },
    template:`
    <div class="weapon_result elden_sheet" v-if="state=='output'">
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
                <div><div>Poison</div><div>{{ result.weapon.poison || '-' }}</div><div></div><div></div><div>Scarlet Rot</div><div>{{ result.weapon.scarlet_rot || '-' }}</div></div>
                <div><div>Bleed</div><div>{{ result.weapon.bleed || '-' }}</div><div></div><div></div><div>Frostbite</div><div>{{ result.weapon.frostbite || '-' }}</div></div>
                <div><div>Sleep</div><div>{{ result.weapon.sleep || '-' }}</div><div></div><div></div><div>Madness</div><div>{{ result.weapon.madness || '-' }}</div></div>
            </div>
        </div>
    </div>
    <div v-if="state=='output'" class="attribute_result elden_sheet">
        <div>
            <div>STR</div><div :style="{'color': mixWhiteBlue((result.attributes.str-10)/10)}">{{ result.attributes.str }}</div>
        </div>
        <div>
            <div>DEX</div><div :style="{'color': mixWhiteBlue((result.attributes.dex-10)/10)}">{{ result.attributes.dex }}</div>
        </div>
        <div>
            <div>INT</div><div :style="{'color': mixWhiteBlue((result.attributes.int-10)/10)}">{{ result.attributes.int }}</div>
        </div>
        <div>
            <div>FAI</div><div :style="{'color': mixWhiteBlue((result.attributes.fai-10)/10)}">{{ result.attributes.fai }}</div>
        </div>
        <div>
            <div>ARC</div><div :style="{'color': mixWhiteBlue((result.attributes.arc-10)/10)}">{{ result.attributes.arc }}</div>
        </div>
    </div>
    <div v-if="state=='update'" class="runes">
        <img :style="{'opacity':Math.min(Math.max((progress*7-0),0),1)}" src="assets/godricks-rune.png"/>
        <img :style="{'opacity':Math.min(Math.max((progress*7-1),0),1)}" src="assets/unborn-rune.png"/>
        <img :style="{'opacity':Math.min(Math.max((progress*7-2),0),1)}" src="assets/radahns-rune.png"/>
        <img :style="{'opacity':Math.min(Math.max((progress*7-3),0),1)}" src="assets/morgotts-rune.png"/>
        <img :style="{'opacity':Math.min(Math.max((progress*7-4),0),1)}" src="assets/rykards-rune.png"/>
        <img :style="{'opacity':Math.min(Math.max((progress*7-5),0),1)}" src="assets/mohgs-rune.png"/>
        <img :style="{'opacity':Math.min(Math.max((progress*7-6),0),1)}" src="assets/malenias-rune.png"/>
    </div>
`,
};