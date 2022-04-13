import groovy.json.*

def slurper = new JsonSlurper()

def weaponData = slurper.parse(new File('source/Extra_Data.json'))
def attack = slurper.parse(new File('source/Attack.json'))
def calculationIds = slurper.parse(new File('source/CalcCorrectGraph_ID.json'))
def parameterScaling = slurper.parse(new File('source/AttackElementCorrectParam.json'))
def passiveEffects = slurper.parse(new File('source/Passive.json'))
def scaling = slurper.parse(new File('source/Scaling.json'))

passiveEffects['Dagger']['Type 1']

def weapons = weaponData.collectEntries{ key, entry ->
    try{
        [key.toLowerCase(),
            [
                'name': key,
                'affinity': entry['Affinity'],
                'max_upgrade_level': entry['Max Upgrade'],
                'weight': entry['Weight'],
                'poise': entry['Poise'],
                'weapon_type': entry['Weapon Type'],
                'dual_wieldable': entry['2H Dual-Wield']=='Yes',
                'required_str': entry['Required (Str)'],
                'required_dex': entry['Required (Dex)'],
                'required_int': entry['Required (Int)'],
                'required_fai': entry['Required (Fai)'],
                'required_arc': entry['Required (Arc)'],
                'max_str_scaling': scaling[(key)]['Str +' + entry['Max Upgrade']],
                'max_dex_scaling': scaling[(key)]['Dex +' + entry['Max Upgrade']],
                'max_int_scaling': scaling[(key)]['Int +' + entry['Max Upgrade']],
                'max_fai_scaling': scaling[(key)]['Fai +' + entry['Max Upgrade']],
                'max_arc_scaling': scaling[(key)]['Arc +' + entry['Max Upgrade']],
                'physical_damage_types': entry['Physical Damage Type'].split('/'),
                'passive_type_1': passiveEffects[(key)]['Type 1'],
                'passive_type_2': passiveEffects[(key)]['Type 2'],
                'max_base_physical_attack_power': attack[(key)]['Phys +' + entry['Max Upgrade']],
                'max_base_magic_attack_power': attack[(key)]['Mag +' + entry['Max Upgrade']],
                'max_base_fire_attack_power': attack[(key)]['Fire +' + entry['Max Upgrade']],
                'max_base_lighting_attack_power': attack[(key)]['Ligh +' + entry['Max Upgrade']],
                'max_base_holy_attack_power': attack[(key)]['Holy +' + entry['Max Upgrade']],
                'max_base_stamina_attack_power': attack[(key)]['Stam +' + entry['Max Upgrade']],
                'max_base_scarlet_rot': passiveEffects[(key)]['Scarlet Rot +0'],
                'max_base_madness': passiveEffects[(key)]['Madness +0'],
                'max_base_sleep': passiveEffects[(key)]['Sleep +0'],
                'max_base_frostbite': passiveEffects[(key)]['Frost +' + entry['Max Upgrade']],
                'max_base_poison': passiveEffects[(key)]['Poison +' + entry['Max Upgrade']],
                'max_base_bleed': passiveEffects[(key)]['Blood +' + entry['Max Upgrade']],
                'physical_damage_calculation_id': calculationIds[(key)]['Physical'],
                'magic_damage_calculation_id': calculationIds[(key)]['Magic'],
                'fire_damage_calculation_id': calculationIds[(key)]['Fire'],
                'lightning_damage_calculation_id': calculationIds[(key)]['Lightning'],
                'holy_damage_calculation_id': calculationIds[(key)]['Holy'],
                'attack_element_scaling_id': calculationIds[(key)]['AttackElementCorrect ID'],
            ]
        ]
    }catch(e){
        println key
        println entry
        println e
        throw e
    }
}

new File('data/weapons.json').write(JsonOutput.toJson(weapons))