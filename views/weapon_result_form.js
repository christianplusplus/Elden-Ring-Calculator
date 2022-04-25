var weaponResultForm = {
    props: {
        result: Object,
    },
    template:`
<div class="weapon_result elden_sheet">
    <div class="weapon_data">
        <div class="filler">
            <div style="font-size:20px;color:gold;">{{ result.weapon.name }}</div>
            <div class="col_2_flex">
                <div class="filler">
                    <div>{{ result.weapon.weapon_type }}</div>
                    <div class="filler"></div>
                </div>
                <div class="filler">
                    <div>{{ result.weapon.physical_damage_types.join('/') }}</div>
                    <div class="filler"></div>
                </div>
                <div class="filler">
                    <div>{{ result.weapon.affinity }}</div>
                    <div class="filler"></div>
                </div>
                <div class="filler">
                    <div>{{ 'Is ' + (result.weapon.dual_wieldable ? '' : 'Not') + ' Dual Wieldable' }}</div>
                    <div class="filler"></div>
                </div>
                <div class="filler">
                    <div>Weight</div>
                    <div>{{ result.weapon.weight }}</div>
                </div>
                <div class="filler">
                    <div>From</div>
                    <a style="color:cyan;" :href="'https://eldenring.wiki.fextralife.com/'+result.weapon.base_weapon_name.replaceAll(' ', '+')">{{ result.weapon.base_weapon_name }}</a>
                </div>
            </div>
        </div>
        <div class="damage_result">
            <div class="anim_fire">{{ result.weapon.damage }}</div>
        </div>
    </div>
    <div class="attack_power">
        <div>Attack Power</div>
        <div class="stat_box col_6">
        
            <div>Physical</div>
            <div>{{ result.weapon.base_attack_power.physical }}</div>
            <div>{{ result.weapon.bonus_attack_power.physical ? '+' : '' }}</div>
            <div>{{ result.weapon.bonus_attack_power.physical || '' }}</div>
            <div>=</div>
            <div>{{ result.weapon.attack_power.physical }}</div>
            
            <div>Magic</div>
            <div>{{ result.weapon.base_attack_power.magic }}</div>
            <div>{{ result.weapon.bonus_attack_power.magic ? '+' : '' }}</div>
            <div>{{ result.weapon.bonus_attack_power.magic || '' }}</div>
            <div>=</div>
            <div>{{ result.weapon.attack_power.magic }}</div>
            
            <div>Fire</div>
            <div>{{ result.weapon.base_attack_power.fire }}</div>
            <div>{{ result.weapon.bonus_attack_power.fire ? '+' : '' }}</div>
            <div>{{ result.weapon.bonus_attack_power.fire || '' }}</div>
            <div>=</div>
            <div>{{ result.weapon.attack_power.fire }}</div>
            
            <div>Lightning</div>
            <div>{{ result.weapon.base_attack_power.lightning }}</div>
            <div>{{ result.weapon.bonus_attack_power.lightning ? '+' : '' }}</div>
            <div>{{ result.weapon.bonus_attack_power.lightning || '' }}</div>
            <div>=</div>
            <div>{{ result.weapon.attack_power.lightning }}</div>
            
            <div>Holy</div>
            <div>{{ result.weapon.base_attack_power.holy }}</div>
            <div>{{ result.weapon.bonus_attack_power.holy ? '+' : '' }}</div>
            <div>{{ result.weapon.bonus_attack_power.holy || '' }}</div>
            <div>=</div>
            <div>{{ result.weapon.attack_power.holy }}</div>
            
        </div>
    </div>
    <div class="attribute_scaling">
        <div class="filler">
            <div>Attribute Scaling</div>
            <div class="stat_box col_4">
            
                <div>Str</div>
                <div>{{ result.weapon.str_scaling_grade }}</div>
                
                <div>Dex</div>
                <div>{{ result.weapon.dex_scaling_grade }}</div>
                
                <div>Int</div>
                <div>{{ result.weapon.int_scaling_grade }}</div>
                
                <div>Fai</div>
                <div>{{ result.weapon.fai_scaling_grade }}</div>
                
                <div>Arc</div>
                <div>{{ result.weapon.arc_scaling_grade }}</div>
                
            </div>
        </div>
        <div class="filler">
            <div>Attributes Required</div>
            <div class="stat_box col_4">
            
                <div>Str</div>
                <div>{{ result.weapon.required_str }}</div>
                
                <div>Dex</div>
                <div>{{ result.weapon.required_dex }}</div>
                
                <div>Int</div>
                <div>{{ result.weapon.required_int }}</div>
                
                <div>Fai</div>
                <div>{{ result.weapon.required_fai }}</div>
                
                <div>Arc</div>
                <div>{{ result.weapon.required_arc }}</div>
            
            </div>
        </div>
    </div>
    
    <div class="passive_effects">
        <div>Passive Effects</div>
        <div class="stat_box col_4">
        
            <div>Poison</div>
            <div>{{ result.weapon.poison || '-' }}</div>
            
            <div>Scarlet&nbsp;Rot</div>
            <div>{{ result.weapon.scarlet_rot || '-' }}</div>
            
            <div>Bleed</div>
            <div>{{ result.weapon.bleed || '-' }}</div>
            
            <div>Frostbite</div>
            <div>{{ result.weapon.frostbite || '-' }}</div>
            
            <div>Sleep</div>
            <div>{{ result.weapon.sleep || '-' }}</div>
            
            <div>Madness</div>
            <div>{{ result.weapon.madness || '-' }}</div>
            
        </div>
    </div>
</div>
`,
};