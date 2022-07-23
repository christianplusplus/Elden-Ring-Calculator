import groovy.json.*

def sourceDirectory = '../src_data'
def targetDirectory = '../data'

def csvSplitterExpression = /,(?=(?:[^"]*"[^"]*")*[^"]*$)/
def csvOuterQuoteExpression = /^"|"$/
def getLineList = { String line ->
    line.split(csvSplitterExpression).collect{it.replaceAll(csvOuterQuoteExpression, '')}
}
def ranged_weapon_types = ['Light Bow', 'Bow', 'Greatbow', 'Crossbow', 'Ballista']
def damage_types = ['physical', 'magic', 'fire', 'lightning', 'holy']
def sources = ['str', 'dex', 'int', 'fai', 'arc']
def weapon_type_map = [
    '1': 'Dagger',
    '3': 'Straight Sword',
    '9': 'Curved Sword',
    '5': 'Greatsword',
    '7': 'Colossal Sword',
    '15': 'Thrusting Sword',
    '16': 'Heavy Thrusting Sword',
    '11': 'Curved Greatsword',
    '13': 'Katana',
    '14': 'Twinblade',
    '21': 'Hammer',
    '23': 'Great Hammer',
    '24': 'Flail',
    '17': 'Axe',
    '19': 'Greataxe',
    '25': 'Spear',
    '28': 'Greate Spear',
    '29': 'Halberd',
    '31': 'Reaper',
    '39': 'Whip',
    '35': 'Fist',
    '37': 'Claw',
    '41': 'Colossal Weapon',
    '87': 'Torch',
    '65': 'Small Shield',
    '67': 'Medium Shield',
    '69': 'Greateshield',
    '57': 'Glintstone Staff',
    '61': 'Sacred Seal',
    '50': 'Light Bow',
    '51': 'Bow',
    '53': 'Greatbow',
    '55': 'Crossbow',
    '56': 'Ballista',
]

def weapon_affinity_map = [
    '0': 'Standard',
    '1900': 'Standard',
    '3100': 'Standard',
    '8000': 'Standard',
    '8100': 'Standard',
    '8200': 'Standard',
    
    '100': 'Heavy',
    '6000': 'Heavy',
    
    '200': 'Keen',
    '5000': 'Keen',
    
    '300': 'Quality',
    
    '400': 'Fire',
    
    '500': 'Flame Art',
    
    '600': 'Lightning',
    
    '700': 'Sacred',
    
    '800': 'Magic',
    
    '900': 'Cold',
    
    '1000': 'Poison',
    
    '1100': 'Blood',
    
    '1200': 'Occult',
    
    '2200': 'Somber',
    '2400': 'Somber',
    '3200': 'Somber',
    '3300': 'Somber',
    '8300': 'Somber',
    '8500': 'Somber',
    
    '3000': 'Somber',//'Unupgradable',
]

List.metaClass.collectWithIndex = { yield ->
    def collected = []
    delegate.eachWithIndex { listItem, index ->
        collected << yield(listItem, index)
    }
    
    return collected 
}

def getRepeatingColumnList = { String line ->
    def i = 0
    line.split(csvSplitterExpression).collect{
        it.replaceAll(csvOuterQuoteExpression, '') + "#${i++}"
    }
}

def csvToObject = { String fileName ->
    def lines = new File(sourceDirectory, fileName + ".csv").readLines()
    def columns = getLineList(lines[0])
    def object = lines[1..-1].collect{
        getLineList(it)
    }.collectEntries{
        [it[0], [columns, it].transpose().collectEntries()]
    }
}

def motionCsvToObject = { String fileName ->
    def lines = new File(sourceDirectory, fileName + ".csv").readLines()
    def columns = getLineList(lines[0])
    def object = lines[1..-1].collect{
        getLineList(it)
    }.findAll{
        it[0] && it[0].length() > 0
    }.collectEntries{
        [it[1], [columns, it].transpose().collectEntries()]
    }
}

def csvToList = { String fileName ->
    def lines = new File(sourceDirectory, fileName + ".csv").readLines()
    def columns = getLineList(lines[0])
    def object = lines[1..-1].collect{
        getLineList(it)
    }.collect{
        [columns, it].transpose().collectEntries()
    }
}

def csvBossesToList = { String fileName ->
    def lines = new File(sourceDirectory, fileName + ".csv").readLines()
    def columns = getRepeatingColumnList(lines[0])
    def object = lines[1..-1].collect{
        getLineList(it)
    }.collect{
        [columns, it].transpose().collectEntries()
    }
}


//boss data to array
def bosses = csvBossesToList('bosses').collectMany{
    try{
        def list = []
        
        list << [
            name: it['Name 1#11'],
            difficulty_scaling_id: it['SpEffect ID#5'],
            ngp_difficulty_scaling_id: it['SpEffect ID (NG+)#6'],
            standard: (100 - (it['Standard Negation#14'] as int)) / 100,
            slash: (100 - (it['Slash Negation#15'] as int)) / 100,
            strike: (100 - (it['Strike Negation#16'] as int)) / 100,
            pierce: (100 - (it['Pierce Negation#17'] as int)) / 100,
            magic: (100 - (it['Magic Negation#18'] as int)) / 100,
            fire: (100 - (it['Fire Negation#19'] as int)) / 100,
            lightning: (100 - (it['Lightning Negation#20'] as int)) / 100,
            holy: (100 - (it['Holy Negation#21'] as int)) / 100,
        ]
        
        if(it['NPC ID 2#1'] != '-') {
            list << [
                name: it['Name 2#31'],
                difficulty_scaling_id: it['SpEffect ID#5'],
                ngp_difficulty_scaling_id: it['SpEffect ID (NG+)#6'],
                standard: (100 - (it['Standard Negation#34'] as int)) / 100,
                slash: (100 - (it['Slash Negation#35'] as int)) / 100,
                strike: (100 - (it['Strike Negation#36'] as int)) / 100,
                pierce: (100 - (it['Pierce Negation#37'] as int)) / 100,
                magic: (100 - (it['Magic Negation#38'] as int)) / 100,
                fire: (100 - (it['Fire Negation#39'] as int)) / 100,
                lightning: (100 - (it['Lightning Negation#40'] as int)) / 100,
                holy: (100 - (it['Holy Negation#41'] as int)) / 100,
            ]
        }
        
        if(it['NPC ID 3#2'] != '-') {
            list << [
                name: it['Name 3#51'],
                difficulty_scaling_id: it['SpEffect ID#5'],
                ngp_difficulty_scaling_id: it['SpEffect ID (NG+)#6'],
                standard: (100 - (it['Standard Negation#54'] as int)) / 100,
                slash: (100 - (it['Slash Negation#55'] as int)) / 100,
                strike: (100 - (it['Strike Negation#56'] as int)) / 100,
                pierce: (100 - (it['Pierce Negation#57'] as int)) / 100,
                magic: (100 - (it['Magic Negation#58'] as int)) / 100,
                fire: (100 - (it['Fire Negation#59'] as int)) / 100,
                lightning: (100 - (it['Lightning Negation#60'] as int)) / 100,
                holy: (100 - (it['Holy Negation#61'] as int)) / 100,
            ]
        }
        
        if(it['NPC ID (Phase 2)#3'] != '-') {
            list << [
                name: it['Actual Name (Phase 2)#70'] + ' (2nd Phase)',
                difficulty_scaling_id: it['SpEffect ID#5'],
                ngp_difficulty_scaling_id: it['SpEffect ID (NG+)#6'],
                standard: (100 - (it['Standard Negation#73'] as int)) / 100,
                slash: (100 - (it['Slash Negation#74'] as int)) / 100,
                strike: (100 - (it['Strike Negation#75'] as int)) / 100,
                pierce: (100 - (it['Pierce Negation#76'] as int)) / 100,
                magic: (100 - (it['Magic Negation#77'] as int)) / 100,
                fire: (100 - (it['Fire Negation#78'] as int)) / 100,
                lightning: (100 - (it['Lightning Negation#79'] as int)) / 100,
                holy: (100 - (it['Holy Negation#80'] as int)) / 100,
            ]
        }
        
        list
    }catch(e){
        println it
        throw e
    }
}
bosses << [['name', 'difficulty_scaling_id', 'ngp_difficulty_scaling_id', 'standard','slash','strike','pierce','magic','fire','lightning','holy'],['Target Dummy (No Resistances, Weaknesses, or Difficulty Scaling)','0','0',1,1,1,1,1,1,1,1]].transpose().collectEntries()
bosses.sort{ a, b -> a.name <=> b.name }
new File(targetDirectory, 'bosses.json').write(JsonOutput.toJson(bosses))

//difficulty data to object
def difficulty_scaling = csvToObject('difficulty_scaling').collectEntries{ key, entry ->
    try{
        if(![entry['Physical Attack'], entry['Magic Attack'], entry['Fire Attack'], entry['Lightning Attack'], entry['Holy Attack']].every{it == entry['Physical Attack']})
            throw new Exception('The assumption that elemental scaling is uniform is not valid.')
        [key,
            [
                defense: (entry['Defense'] as double) * 100,
            ]
        ]
    }catch(e){
        println key
        println entry
        throw e
    }
}
new File(targetDirectory, 'difficulty_scaling.json').write(JsonOutput.toJson(difficulty_scaling))

def element_scaling = csvToObject('element_scaling')

//weapon data to list
def weapon_id_motion_names = csvToList('weapon_id_motion_names').collectEntries{[it['ID'],it['Weapon']]}
def raw_weapons = csvToObject('weapons')
def weapons = csvToList('weapons').findAll{it['Sort ID'] != '9999999' && it['skip'] != 'arrow' && it['skip'] != 'unused'}.collect{
    try{
        def weapon_type_id = it['Weapon Type']
        if(!weapon_type_map.containsKey(weapon_type_id))
            throw new Exception("Unexpected weapon moveset ID \"$weapon_type_id\".")
        def reinforce_id = it['Reinforce Type ID']
        if(!weapon_affinity_map.containsKey(reinforce_id))
            throw new Exception("Unexpected weapon reinforce ID \"$reinforce_id\".")
        def weapon = [
            id: it['Row ID'],
            name: it['Row Name'],
            base_weapon_name: raw_weapons[it['Origin Weapon +0']]['Row Name'],
            motion_name: weapon_id_motion_names[it['Origin Weapon +0']],
            reinforce_id: reinforce_id as int,
            element_scaling: [:],
            weapon_type: weapon_type_map[weapon_type_id],
            affinity: weapon_affinity_map[reinforce_id],
            weight: it['Weight'] as double,
            max_upgrade_level: it['Origin Weapon +1'] == '-1' ? 0 : it['Origin Weapon +11'] == '-1' ? 10 : 25,
            physical_damage_types: [],
            physical_attack_power: it['Damage: Physical'] as int,
            magic_attack_power: it['Damage: Magic'] as int,
            fire_attack_power: it['Damage: Fire'] as int,
            lightning_attack_power: it['Damage: Lightning'] as int,
            holy_attack_power: it['Damage: Holy'] as int,
            physical_correction_id: it['Correction Type: Physical'] as int,
            magic_correction_id: it['Correction Type: Magic'] as int,
            fire_correction_id: it['Correction Type: Fire'] as int,
            lightning_correction_id: it['Correction Type: Lightning'] as int,
            holy_correction_id: it['Correction Type: Holy'] as int,
            poison_correction_id: it['Correction Type: Poison'] as int,
            bleed_correction_id: it['Correction Type: Hemorrhage'] as int,
            sleep_correction_id: it['Correction Type: Sleep'] as int,
            madness_correction_id: it['Correction Type: Mandesss'] as int,
            str_requirement: it['Requirement: STR'] as int,
            dex_requirement: it['Requirement: DEX'] as int,
            int_requirement: it['Requirement: INT'] as int,
            fai_requirement: it['Requirement: FTH'] as int,
            arc_requirement: it['Requirement: ARC'] as int,
            str_scaling : (it['Correction: STR'] as double) / 100,
            dex_scaling : (it['Correction: DEX'] as double) / 100,
            int_scaling : (it['Correction: INT'] as double) / 100,
            fai_scaling : (it['Correction: FTH'] as double) / 100,
            arc_scaling : (it['Correction: ARC'] as double) / 100,
            ammo: 'N/A',
        ]
        
        for(String damage_type : damage_types)
            for(String source : sources)
                if(element_scaling[it['Attack Element Correct ID']]["${damage_type.capitalize()} Scaling: ${source.toUpperCase()}"] == '1')
                    weapon.element_scaling["${damage_type}_${source}"] = 1
        
        //for weapon extending.
        weapon.rot = weapon.death = weapon.madness = weapon.sleep = weapon.frost = weapon.poison = weapon.bleed = 0
        
        if(it['Behavior SpEffect 1'] != '-1')
            weapon.passive_id_1 = it['Behavior SpEffect 1'] as int
        if(it['Behavior SpEffect 2'] != '-1')
            weapon.passive_id_2 = it['Behavior SpEffect 2'] as int
        if(it['Behavior SpEffect 3'] != '-1')
            weapon.passive_id_3 = it['Behavior SpEffect 3'] as int
        
        if(it['Bonus Damage %: Void'] != '1')
            weapon['void_multiplier'] = it['Bonus Damage %: Void'] as double
        if(it['Bonus Damage %: Undead'] != '1')
            weapon['undead_multiplier'] = it['Bonus Damage %: Undead'] as double
        if(it['Bonus Damage %: Ancient Dragon'] != '1')
            weapon['ancient_dragon_multiplier'] = it['Bonus Damage %: Ancient Dragon'] as double
        if(it['Bonus Damage %: Dragon/Wyrm'] != '1')
            weapon['dragon_wyvern_multiplier'] = it['Bonus Damage %: Dragon/Wyrm'] as double
        
        if(it['Type Display: Normal'] == 'TRUE')
            weapon['physical_damage_types'] << 'Standard'
        if(it['Type Display: Strike'] == 'TRUE')
            weapon['physical_damage_types'] << 'Strike'
        if(it['Type Display: Slash'] == 'TRUE')
            weapon['physical_damage_types'] << 'Slash'
        if(it['Type Display: Thrust'] == 'TRUE')
            weapon['physical_damage_types'] << 'Pierce'
        
        weapon
    }catch(e){
        println it
        throw e
    }
}

def passive_map = [
    Blood: 'bleed',
    Rot: 'rot',
    Death: 'death',
    Sleep: 'sleep',
    Poison: 'poison',
    Frost: 'frost',
    Madness: 'madness',
]

def passives = csvToObject('passives').collectEntries{ key, entry ->
    [key,
        [
            value: entry['Value'] as int,
            type: passive_map[entry['Type']],
        ]
    ]
    
}
new File(targetDirectory, 'passives.json').write(JsonOutput.toJson(passives))

def reinforce = csvToObject('reinforce').collectEntries{ key, entry ->
    [key,
        [
            physical: entry['Physical Attack'] as double,
            magic: entry['Magic Attack'] as double,
            fire: entry['Fire Attack'] as double,
            lightning: entry['Lightning Attack'] as double,
            holy: entry['Holy Attack'] as double,
            str: entry['Str Scaling'] as double,
            dex: entry['Dex Scaling'] as double,
            int: entry['Int Scaling'] as double,
            fai: entry['Fai Scaling'] as double,
            arc: entry['Arc Scaling'] as double,
            passive_offset_1: entry['Effect 1 Offset'] as int,
            passive_offset_2: entry['Effect 2 Offset'] as int,
        ]
    ]
    
}
new File(targetDirectory, 'reinforce.json').write(JsonOutput.toJson(reinforce))

//swing values to Object
def swing_values = motionCsvToObject('swing_values').collectEntries{ key, entry ->
    try{
        [key,
            [
                normal_light_1h: ranged_weapon_types.contains(entry['Weapon Class']) ?
                ['Pierce']
                :
                [entry['1h R1 1'], entry['1h R1 2'], entry['1h R1 3'], entry['1h R1 4'], entry['1h R1 5'], entry['1h R1 6']],
                normal_light_2h: ranged_weapon_types.contains(entry['Weapon Class']) ?
                ['Pierce']
                :
                [entry['2h R1 1'], entry['2h R1 2'], entry['2h R1 3'], entry['2h R1 4'], entry['2h R1 5'], entry['2h R1 6']],
                normal_offhand: [entry['Offhand R1 1'], entry['Offhand R1 2'], entry['Offhand R1 3'], entry['Offhand R1 4'], entry['Offhand R1 5'], entry['Offhand R1 6']],
                normal_paired: [entry['Paired L1 1'], entry['Paired L1 2'], entry['Paired L1 3'], entry['Paired L1 4'], entry['Paired L1 5'], entry['Paired L1 6']],
                normal_heavy_1h: [entry['1h R2 1'], entry['1h R2 2']],
                normal_heavy_2h: [entry['2h R2 1'], entry['2h R2 2']],
                normal_charged_1h: [entry['1h Charged R2 1'], entry['1h Charged R2 2']],
                normal_charged_2h: [entry['2h Charged R2 1'], entry['2h Charged R2 2']],
                
                running_light_1h: [entry['1h Running R1']],
                running_light_2h: [entry['2h Running R1']],
                running_heavy_1h: [entry['1h Running R2']],
                running_heavy_2h: [entry['2h Running R2']],
                running_paired: [entry['Paired Running L1']],
                
                rolling_light_1h: [entry['1h Rolling R1']],
                rolling_light_2h: [entry['2h Rolling R1']],
                rolling_paired: [entry['Paired Rolling L1']],
                
                jumping_light_1h: [entry['1h Jumping R1']],
                jumping_light_2h: [entry['2h Jumping R1']],
                jumping_heavy_1h: [entry['1h Jumping R2']],
                jumping_heavy_2h: [entry['2h Jumping R2']],
                jumping_paired: [entry['Paired Jumping L1']],
                
                chargefeint_1h: [entry['1h Charged R2 1 Feint']],
                chargefeint_2h: [entry['2h Charged R2 1 Feint']],
                
                chargedchargefeint_1h: [entry['1h Charged R2 1'], entry['1h Charged R2 2 Feint']],
                chargedchargefeint_2h: [entry['2h Charged R2 1'], entry['2h Charged R2 2 Feint']],
                
                backstep_light_1h: [entry['1h Backstep R1']],
                backstep_light_2h: [entry['2h Backstep R1']],
                backstep_paired: [entry['Paired Backstep L1']],
                
                guardcounter_1h: [entry['1h Guard Counter']],
                guardcounter_2h: [entry['2h Guard Counter']],
                
                mounted_light: [entry['Mounted R1 1'], entry['Mounted R1 2'], entry['Mounted R1 3']],
                mounted_heavy: [entry['Mounted R2']],
                mounted_charging: [entry['Mounted R2 Charging']],
                mounted_charged: [entry['Mounted Charged R2']],
                
                backstab: [entry['Backstab']],
                riposte: [entry['Riposte']],
                shieldpoke: [entry['Shieldpoke']],
            ].collectEntries{weapon, moves -> [weapon, moves.findAll().collect{move -> (move =~ /Standard|Slash|Pierce|Strike/).collect{it.toLowerCase()}}]}
        ]
    }catch(e){
        println key
        println entry
        println e
        throw e
    }
}

//motion values to object
def motion_values = motionCsvToObject('motion_values').collectEntries{ key, entry ->
    try{
        [key,
            [
                normal_light_1h: ranged_weapon_types.contains(entry['Weapon Class']) ?
                [100]
                :
                [entry['1h R1 1'], entry['1h R1 2'], entry['1h R1 3'], entry['1h R1 4'], entry['1h R1 5'], entry['1h R1 6']],
                normal_light_2h: ranged_weapon_types.contains(entry['Weapon Class']) ?
                [100]
                :
                [entry['2h R1 1'], entry['2h R1 2'], entry['2h R1 3'], entry['2h R1 4'], entry['2h R1 5'], entry['2h R1 6']],
                normal_offhand: [entry['Offhand R1 1'], entry['Offhand R1 2'], entry['Offhand R1 3'], entry['Offhand R1 4'], entry['Offhand R1 5'], entry['Offhand R1 6']],
                normal_paired: [entry['Paired L1 1'], entry['Paired L1 2'], entry['Paired L1 3'], entry['Paired L1 4'], entry['Paired L1 5'], entry['Paired L1 6']],
                normal_heavy_1h: [entry['1h R2 1'], entry['1h R2 2']],
                normal_heavy_2h: [entry['2h R2 1'], entry['2h R2 2']],
                normal_charged_1h: [entry['1h Charged R2 1'], entry['1h Charged R2 2']],
                normal_charged_2h: [entry['2h Charged R2 1'], entry['2h Charged R2 2']],
                
                running_light_1h: [entry['1h Running R1']],
                running_light_2h: [entry['2h Running R1']],
                running_heavy_1h: [entry['1h Running R2']],
                running_heavy_2h: [entry['2h Running R2']],
                running_paired: [entry['Paired Running L1']],
                
                rolling_light_1h: [entry['1h Rolling R1']],
                rolling_light_2h: [entry['2h Rolling R1']],
                rolling_paired: [entry['Paired Rolling L1']],
                
                jumping_light_1h: [entry['1h Jumping R1']],
                jumping_light_2h: [entry['2h Jumping R1']],
                jumping_heavy_1h: [entry['1h Jumping R2']],
                jumping_heavy_2h: [entry['2h Jumping R2']],
                jumping_paired: [entry['Paired Jumping L1']],
                
                chargefeint_1h: [entry['1h Charged R2 1 Feint']],
                chargefeint_2h: [entry['2h Charged R2 1 Feint']],
                
                chargedchargefeint_1h: [entry['1h Charged R2 2 Feint']],
                chargedchargefeint_2h: [entry['2h Charged R2 2 Feint']],
                
                backstep_light_1h: [entry['1h Backstep R1']],
                backstep_light_2h: [entry['2h Backstep R1']],
                backstep_paired: [entry['Paired Backstep L1']],
                
                guardcounter_1h: [entry['1h Guard Counter']],
                guardcounter_2h: [entry['2h Guard Counter']],
                
                mounted_light: [entry['Mounted R1 1'], entry['Mounted R1 2'], entry['Mounted R1 3']],
                mounted_heavy: [entry['Mounted R2']],
                mounted_charging: [entry['Mounted R2 Charging']],
                mounted_charged: [entry['Mounted Charged R2']],
                
                backstab: [entry['Backstab']],
                riposte: [entry['Riposte']],
                shieldpoke: [entry['Shieldpoke']],
            ].collectEntries{weapon, moves -> [weapon, moves.findAll().collect{move -> (move =~ /\d+(?:\.\d+)?/).collect{hit -> (hit as double) / 100}}]}
        ]
    }catch(e){
        println key
        println entry
        println e
        throw e
    }
}

motion_values = motion_values.collectEntries{ weapon, entry ->
    [weapon, entry.collectEntries{moveName, moveSet -> [moveName, moveSet.collectWithIndex{move, moveIndex -> move.collectWithIndex{hit, hitIndex -> [hit, swing_values[weapon][moveName][moveIndex][hitIndex]]}}]}]
}

new File(targetDirectory, 'motion_values.json').write(JsonOutput.toJson(motion_values))

//generate ranged weapon and ammo combinations

def weapon_ammo_map = [
    'Light Bow': 'Arrow',
    'Bow': 'Arrow',
    'Greatbow': 'Greatarrow',
    'Crossbow': 'Bolt',
    'Ballista': 'Greatbolt',
]

def ranged_weapons = weapons.findAll{ranged_weapon_types.contains(it['weapon_type'])}

def ammunitions = raw_weapons.values().findAll{it['skip'] == 'arrow'}

def ammunitions_by_type = [
    'Arrow': ammunitions.findAll{it['Weapon Type'] == '81'},
    'Greatarrow': ammunitions.findAll{it['Weapon Type'] == '83'},
    'Bolt': ammunitions.findAll{it['Weapon Type'] == '85'},
    'Greatbolt': ammunitions.findAll{it['Weapon Type'] == '86'},
]

def jsonSlurper = new JsonSlurper()
def ranged_weapons_with_ammo = ranged_weapons.collectMany{ weapon ->
    try{
        ammunitions_by_type[weapon_ammo_map[weapon['weapon_type']]].collect{ ammo ->
            
            def new_weapon = jsonSlurper.parseText(JsonOutput.toJson(weapon))
            
            new_weapon.name = "$weapon.name with ${ammo['Row Name']}"
            new_weapon.ammo = ammo['Row Name']
            new_weapon.bonus = [:]
            new_weapon.bonus.passives = []
            new_weapon.physical_damage_types << 'Pierce'
            
            if(ammo['Damage: Physical'] != '0')
                new_weapon.bonus.physical_attack_power = ammo['Damage: Physical'] as int
            if(ammo['Damage: Magic'] != '0')
                new_weapon.bonus.magic_attack_power = ammo['Damage: Magic'] as int
            if(ammo['Damage: Fire'] != '0')
                new_weapon.bonus.fire_attack_power = ammo['Damage: Fire'] as int
            if(ammo['Damage: Lightning'] != '0')
                new_weapon.bonus.lightning_attack_power = ammo['Damage: Lightning'] as int
            if(ammo['Damage: Holy'] != '0')
                new_weapon.bonus.holy_attack_power = ammo['Damage: Holy'] as int
            
            if(ammo['Behavior SpEffect 1'] != '-1')
                new_weapon.bonus.passives << (ammo['Behavior SpEffect 1'] as int)
            if(ammo['Behavior SpEffect 2'] != '-1')
                new_weapon.bonus.passives << (ammo['Behavior SpEffect 2'] as int)
            if(ammo['Behavior SpEffect 3'] != '-1')
                new_weapon.bonus.passives << (ammo['Behavior SpEffect 3'] as int)
            
            new_weapon
        }
    }catch(e){
        println weapon
        println e
        throw e
    }
}

weapons = weapons.findAll{ !ranged_weapon_types.contains(it.weapon_type) } + ranged_weapons_with_ammo

new File(targetDirectory, 'weapons.json').write(JsonOutput.toJson(weapons))