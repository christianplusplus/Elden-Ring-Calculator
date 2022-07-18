import groovy.json.*

def sourceDirectory = '../src_data'
def targetDirectory = '../data'

def csvSplitterExpression = /,(?=(?:[^"]*"[^"]*")*[^"]*$)/
def csvOuterQuoteExpression = /^"|"$/
def getLineList = { String line ->
    line.split(csvSplitterExpression).collect{it.replaceAll(csvOuterQuoteExpression, '')}
}
def ranged_weapon_types = ['Light Bow', 'Bow', 'Greatbow', 'Crossbow', 'Ballista']
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
/*
    '20': 'Dagger',
    '23': 'Straight Sword',
    '28': 'Curved Sword',
    '25': 'Greatsword',
    '26': 'Colossal Sword',
    '27': 'Thrusting Sword',
    '39': 'Heavy Thrusting Sword',
    '40': 'Curved Greatsword',
    '29': 'Katana',
    '24': 'Twinblade',
    '33': 'Hammer',
    '35': 'Great Hammer',
    '34': 'Flail',
    '30': 'Axe',
    '32': 'Greataxe',
    '36': 'Spear',
    '37': 'Greate Spear',
    '38': 'Halberd',
    '50': 'Reaper',
    '43': 'Whip',
    '42': 'Fist',
    '22': 'Claw',
    '31': 'Colossal Weapon',
    '21': 'Torch',
    '48': 'Small Shield',
    '49': 'Medium Shield',
    '47': 'Greateshield',
    '41': 'Glintstone Staff',
    '51': 'Light Bow',
    '44': 'Bow',
    '45': 'Greatbow',
    '46': 'Crossbow',
    '52': 'Ballista',
    
    '103': 'Dagger', // Black Knife/Erdsteel
    '101': 'Dagger', // Curvy Dagger
    '100': 'Dagger', // Sickle
    '104': 'Dagger', // Wakizashi
    
    '111': 'Straight Sword', // Shortsword
    '110': 'Straight Sword', // Broadsword/Cane Sword
    '852': 'Straight Sword', // Ornamental Straight Sword
    '113': 'Straight Sword', // Carian Knight's Sword/Lazuli Glintstone Sword
    '112': 'Straight Sword', // Miquellan Knight's Sword
    '117': 'Straight Sword', // Warhawk's Talon
    
    '128': 'Greatsword', // Inseparable Sword
    '126': 'Greatsword',
    '129': 'Greatsword',
    '130': 'Greatsword',
    '127': 'Greatsword',
    '125': 'Greatsword',
    
    '136': 'Colossal Sword',
    '135': 'Colossal Sword',
    '832': 'Colossal Sword',
    '137': 'Colossal Sword',
    '138': 'Colossal Sword',
    
    '145': 'Thrusting Sword',
    '146': 'Thrusting Sword',
    '147': 'Thrusting Sword',
    
    '150': 'Heavy Thrusting Sword',
    '151': 'Heavy Thrusting Sword',
    
    '161': 'Curved Sword',
    '155': 'Curved Sword',
    '156': 'Curved Sword',
    '157': 'Curved Sword',
    '159': 'Curved Sword',
    '158': 'Curved Sword',
    
    '216': 'Curved Greatsword',
    '215': 'Curved Greatsword',
    
    '167': 'Katana',
    '166': 'Katana',
    '165': 'Katana',
    
    '121': 'Twinblade',
    '120': 'Twinblade',
    
    '183': 'Hammer',
    '180': 'Hammer',
    '182': 'Hammer',
    '181': 'Hammer',
    '184': 'Hammer',
    
    '176': 'Great Hammer',
    
    '170': 'Axe',
    '172': 'Axe',
    '171': 'Axe',
    
    '177': 'Greataxe',
    '175': 'Greataxe',
    
    '203': 'Spear',
    '200': 'Spear',
    '201': 'Spear',
    '202': 'Spear',
    
    '205': 'Great Spear',
    '207': 'Great Spear',
    '206': 'Great Spear',
    
    '210': 'Halberd',
    '211': 'Halberd',
    '212': 'Halberd',
    
    '225': 'Reaper',
    
    '226': 'Whip',
    
    '221': 'Fist',
    '220': 'Fist',
    
    '227': 'Claw',
    
    '196': 'Colossal Weapon',
    '195': 'Colossal Weapon',
    '831': 'Colossal Weapon',
    '839': 'Colossal Weapon',
    '197': 'Colossal Weapon',
    '198': 'Colossal Weapon',
    
    '250': 'Torch',
    '251': 'Torch',
    
    '240': 'Sacred Seal',
    
    '232': 'Light Bow',
    
    '230': 'Bow',
    '231': 'Bow',
    
    '233': 'Crossbow',
    '236': 'Crossbow',
    
    '234': 'Ballista',
*/
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
    
    '3000': 'Unupgradable',
]
def weapon_ammo_map = [
    'Light Bow': 'Arrow',
    'Bow': 'Arrow',
    'Greatbow': 'Greatarrow',
    'Crossbow': 'Bolt',
    'Ballista': 'Greatbolt',
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
    
        //fixes
        /*
        it[0] = it[0].replaceAll('epee', 'Epee')
        it[1] = it[1].replaceAll("Man-serpent's Shield", "Man-Serpent's Shield")
        it[1] = it[1].replaceAll("^Celebrant's Cleaver\$", "Celebrant's Cleaver Blades")
        it[1] = it[1].replaceAll("Relic Sword", "Sacred Relic Sword")
        it[1] = it[1].replaceAll("Mohgwyn's Spear", "Mohgwyn's Sacred Spear")
        */
        
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
        
        //fixes
        /*
        it[1] = it[1].replaceAll('Épée', 'Epee')
        it[1] = it[1].replaceAll('Miséricorde', 'Misericorde')
        it[1] = it[1].replaceAll("Varré's Bouquet", "Varre's Bouquet")
        it[1] = it[1].replaceAll("Celebrant's Cleaver", "Celebrant's Cleaver Blades")
        */
        
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
            lighting: (100 - (it['Lightning Negation#20'] as int)) / 100,
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
                lighting: (100 - (it['Lightning Negation#40'] as int)) / 100,
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
                lighting: (100 - (it['Lightning Negation#60'] as int)) / 100,
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
                lighting: (100 - (it['Lightning Negation#79'] as int)) / 100,
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
                defense: entry['Defense'] as double,
                resistance: entry['Physical Attack'] as double,
            ]
        ]
    }catch(e){
        println key
        println entry
        throw e
    }
}
new File(targetDirectory, 'difficulty_scaling.json').write(JsonOutput.toJson(difficulty_scaling))

def raw_weapons = csvToObject('weapons')
//weapon data to list
def weapons = raw_weapons.values().findAll{it['Sort ID'] != '9999999' && it['skip'] != 'arrow'}.collect{
    try{
        def weapon_type_id = it['Weapon Type']
        if(!weapon_type_map.containsKey(weapon_type_id))
            throw new Exception("Unexpected weapon moveset ID \"$weapon_type_id\".")
        def reinforce_id = it['Reinforce Type ID']
        if(!weapon_affinity_map.containsKey(reinforce_id))
            throw new Exception("Unexpected weapon reinforce ID \"$reinforce_id\".")
        [
            name: it['Row Name'],
            base_weapon: raw_weapons[it['Origin Weapon +0']]['Row Name'],
            reinforce_id: reinforce_id,
            elemental_scaling_id: it['Attack Element Correct ID'],
            moveset_id: it['Moveset Override Category'] == '0' ? it['Weapon Moveset Category'] : it['Moveset Override Category'],
            weapon_type: weapon_type_map[weapon_type_id],
            affinity: weapon_affinity_map[reinforce_id],
            weight: it['Weight'] as double,
            max_upgrade_level: it['Orign Weapon +1'] == '-1' ? 0 : it['Orign Weapon +11'] == '-1' ? 10 : 25,
            base_physical_damage: it['Damage: Physical'] as int,
            base_magic_damage: it['Damage: Magic'] as int,
            base_fire_damage: it['Damage: Fire'] as int,
            base_lightning_damage: it['Damage: Lightning'] as int,
            base_holy_damage: it['Damage: Holy'] as int,
            str_requirement: it['Requirement: STR'] as int,
            dex_requirement: it['Requirement: DEX'] as int,
            int_requirement: it['Requirement: INT'] as int,
            fai_requirement: it['Requirement: FTH'] as int,
            arc_requirement: it['Requirement: ARC'] as int,
            base_str_scaling : it['Correction: STR'] as int,
            base_dex_scaling : it['Correction: DEX'] as int,
            base_int_scaling : it['Correction: INT'] as int,
            base_fai_scaling : it['Correction: FTH'] as int,
            base_arc_scaling : it['Correction: ARC'] as int,
            void_multiplier: it['Bonus Damage %: Void'] as double,
            undead_multiplier: it['Bonus Damage %: Undead'] as double,
            ancient_dragon_multiplier: it['Bonus Damage %: Ancient Dragon'] as double,
            dragon_wyvern_multiplier: it['Bonus Damage %: Dragon/Wyrm'] as double,
            //is_dual_wieldable: it['is_dual_weapon'] as boolean,
        ]
    }catch(e){
        println it
        throw e
    }
}
new File(targetDirectory, 'weapons.json').write(JsonOutput.toJson(weapons))

/*
//swing values to Object
swing_values = motionCsvToObject('weapon_swing_types').collectEntries{ key, entry ->
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
            ].collectEntries{weapon, moves -> [weapon, moves.findAll().collect{move -> (move =~ /Standard|Slash|Pierce|Strike/).collect{it}}]}
        ]
    }catch(e){
        println key
        println entry
        println e
        throw e
    }
}

//motion values to object
motion_values = motionCsvToObject('motion_values').collectEntries{ key, entry ->
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
            ].collectEntries{weapon, moves -> [weapon, moves.findAll().collect{move -> (move =~ /\d+(?:\.\d+)?/).collect{hit -> hit as double}}]}
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

AttackElementCorrectParam = AttackElementCorrectParam.collectEntries{ key, entry ->
    try{
        [key,
            [
                'physical_str_element_scaling': entry['Physical Scaling: STR']=='1',
                'physical_dex_element_scaling': entry['Physical Scaling: DEX']=='1',
                'physical_int_element_scaling': entry['Physical Scaling: INT']=='1',
                'physical_fai_element_scaling': entry['Physical Scaling: FAI']=='1',
                'physical_arc_element_scaling': entry['Physical Scaling: ARC']=='1',
                'magic_str_element_scaling': entry['Magic Scaling: STR']=='1',
                'magic_dex_element_scaling': entry['Magic Scaling: DEX']=='1',
                'magic_int_element_scaling': entry['Magic Scaling: INT']=='1',
                'magic_fai_element_scaling': entry['Magic Scaling: FAI']=='1',
                'magic_arc_element_scaling': entry['Magic Scaling: ARC']=='1',
                'fire_str_element_scaling': entry['Fire Scaling: STR']=='1',
                'fire_dex_element_scaling': entry['Fire Scaling: DEX']=='1',
                'fire_int_element_scaling': entry['Fire Scaling: INT']=='1',
                'fire_fai_element_scaling': entry['Fire Scaling: FAI']=='1',
                'fire_arc_element_scaling': entry['Fire Scaling: ARC']=='1',
                'lightning_str_element_scaling': entry['Lightning Scaling: STR']=='1',
                'lightning_dex_element_scaling': entry['Lightning Scaling: DEX']=='1',
                'lightning_int_element_scaling': entry['Lightning Scaling: INT']=='1',
                'lightning_fai_element_scaling': entry['Lightning Scaling: FAI']=='1',
                'lightning_arc_element_scaling': entry['Lightning Scaling: ARC']=='1',
                'holy_str_element_scaling': entry['Holy Scaling: STR']=='1',
                'holy_dex_element_scaling': entry['Holy Scaling: DEX']=='1',
                'holy_int_element_scaling': entry['Holy Scaling: INT']=='1',
                'holy_fai_element_scaling': entry['Holy Scaling: FAI']=='1',
                'holy_arc_element_scaling': entry['Holy Scaling: ARC']=='1',
            ]
        ]
    }catch(e){
        println key
        println entry
        println e
        throw e
    }
}
new File(targetDirectory, 'attack_element_scaling.json').write(JsonOutput.toJson(AttackElementCorrectParam))

def weapons = Extra_Data.collect{ key, entry ->
    try{
        max_upgrade_level = entry['Max Upgrade']
        [
            name: key,
            base_weapon_name: entry['Weapon Name'],
            affinity: entry['Affinity'] == 'None' ? 'Standard' : entry['Affinity'] == '-' ? 'N/A' : entry['Affinity'],
            max_upgrade_level: max_upgrade_level,
            weight: entry['Weight'],
            //poise: entry['Poise'],  got removed?
            weapon_type: entry['Weapon Type'],
            dual_wieldable: entry['2H Dual-Wield']=='Yes',
            required_str: entry['Required (Str)'],
            required_dex: entry['Required (Dex)'],
            required_int: entry['Required (Int)'],
            required_fai: entry['Required (Fai)'],
            required_arc: entry['Required (Arc)'],
            physical_damage_types: entry['Physical Damage Type'].split('/'),
            physical_damage_calculation_id: CalcCorrectGraph_ID[(key)]['Physical'],
            magic_damage_calculation_id: CalcCorrectGraph_ID[(key)]['Magic'],
            fire_damage_calculation_id: CalcCorrectGraph_ID[(key)]['Fire'],
            lightning_damage_calculation_id: CalcCorrectGraph_ID[(key)]['Lightning'],
            holy_damage_calculation_id: CalcCorrectGraph_ID[(key)]['Holy'],
            attack_element_scaling_id: CalcCorrectGraph_ID[(key)]['AttackElementCorrect ID'],
            ammo: 'N/A',
        ]
    }catch(e){
        println key
        println entry
        println e
        throw e
    }
}

//generate ranged weapon and ammo combinations

def ranged_weapons = weapons.findAll{ ranged_weapon_types.contains(it['weapon_type']) }

def ranged_weapons_with_ammo = ranged_weapons.collectMany{ weapon ->
    ammo_values.values().findAll{
        it['Weapon Type'] == weapon_ammo_map[weapon.weapon_type]
    }.collect{
        def new_weapon = [:] + weapon
        new_weapon.name = "$weapon.name (with $it.Name)"
        new_weapon.physical_damage_types = [it['Physical Damage Type']]
        new_weapon.ammo = it.Name
        new_weapon
    }
}

weapons = weapons.findAll{ !ranged_weapon_types.contains(it.weapon_type) } + ranged_weapons_with_ammo

new File(targetDirectory, 'weapons.json').write(JsonOutput.toJson(weapons))

//add ranged ammo combinations to Attack data
Attack += ranged_weapons_with_ammo.collectEntries{ weapon ->
    try{
        def new_attack_stats = [:] + Attack[weapon.base_weapon_name]
        (25 + 1).times { upgrade_level ->
            new_attack_stats["Phys +$upgrade_level"] = new_attack_stats["Phys +$upgrade_level"] as double + (ammo_values[weapon.ammo]['Attack Power (Physical)'] as double)
            new_attack_stats["Mag +$upgrade_level"] = new_attack_stats["Mag +$upgrade_level"] as double + (ammo_values[weapon.ammo]['Attack Power (Magic)'] as double)
            new_attack_stats["Fire +$upgrade_level"] = new_attack_stats["Fire +$upgrade_level"] as double + (ammo_values[weapon.ammo]['Attack Power (Fire)'] as double)
            new_attack_stats["Ligh +$upgrade_level"] = new_attack_stats["Ligh +$upgrade_level"] as double + (ammo_values[weapon.ammo]['Attack Power (Lightning)'] as double)
            new_attack_stats["Holy +$upgrade_level"] = new_attack_stats["Holy +$upgrade_level"] as double + (ammo_values[weapon.ammo]['Attack Power (Holy)'] as double)
        }
        new_attack_stats.Name = weapon.name
        [weapon.name, new_attack_stats]
    }catch(e){
        println weapon
        println e
        throw e
    }
}
//clean up the object
Attack = Attack.collectEntries{ key, entry ->
    try{
        def new_entry = [:]
        
        (25 + 1).times{ upgrade_level ->
            if(entry["Phys +$upgrade_level"] as double > 0) new_entry["p$upgrade_level"] = entry["Phys +$upgrade_level"]
            if(entry["Mag +$upgrade_level"] as double > 0) new_entry["m$upgrade_level"] = entry["Mag +$upgrade_level"]
            if(entry["Fire +$upgrade_level"] as double > 0) new_entry["f$upgrade_level"] = entry["Fire +$upgrade_level"]
            if(entry["Ligh +$upgrade_level"] as double > 0) new_entry["l$upgrade_level"] = entry["Ligh +$upgrade_level"]
            if(entry["Holy +$upgrade_level"] as double > 0) new_entry["h$upgrade_level"] = entry["Holy +$upgrade_level"]
        }
        
        [key, new_entry]
    }catch(e){
        pritnln key
        println entry
        println e
        throw e
    }
}
new File(targetDirectory, 'weapon_base_attacks.json').write(JsonOutput.toJson(Attack))


//add ranged ammo combinations to Scaling data
Scaling += ranged_weapons_with_ammo.collectEntries{ weapon ->
    try{
        def new_attack_stats = [:] + Scaling[weapon.base_weapon_name]
        new_attack_stats.Name = weapon.name
        [weapon.name, new_attack_stats]
    }catch(e){
        println weapon
        println e
        throw e
    }
}
//clean up the object
Scaling = Scaling.collectEntries{ key, entry ->
    try{
        def new_entry = [:]
        
        (25 + 1).times{ upgrade_level ->
            if(entry["Str +$upgrade_level"] as double > 0) new_entry["s$upgrade_level"] = entry["Str +$upgrade_level"]
            if(entry["Dex +$upgrade_level"] as double > 0) new_entry["d$upgrade_level"] = entry["Dex +$upgrade_level"]
            if(entry["Int +$upgrade_level"] as double > 0) new_entry["i$upgrade_level"] = entry["Int +$upgrade_level"]
            if(entry["Fai +$upgrade_level"] as double > 0) new_entry["f$upgrade_level"] = entry["Fai +$upgrade_level"]
            if(entry["Arc +$upgrade_level"] as double > 0) new_entry["a$upgrade_level"] = entry["Arc +$upgrade_level"]
        }
        
        [key, new_entry]
    }catch(e){
        pritnln key
        println entry
        println e
        throw e
    }
}
new File(targetDirectory, 'weapon_source_scaling.json').write(JsonOutput.toJson(Scaling))

//add ranged ammo combinations to Passive data
Passive += ranged_weapons_with_ammo.collectEntries{ weapon ->
    try{
        def new_attack_stats = [:] + Passive[weapon.base_weapon_name]
        new_attack_stats["Scarlet Rot +0"] = new_attack_stats["Scarlet Rot +0"] as double + (ammo_values[weapon.ammo]['Base Rot Build-up'] == '-' ? 0 : ammo_values[weapon.ammo]['Base Rot Build-up'] as double)
        new_attack_stats["Sleep +0"] = new_attack_stats["Sleep +0"] as double + (ammo_values[weapon.ammo]['Base Sleep Build-up'] == '-' ? 0 : ammo_values[weapon.ammo]['Base Sleep Build-up'] as double)
        (25 + 1).times { upgrade_level ->
            new_attack_stats["Frost +$upgrade_level"] = new_attack_stats["Frost +$upgrade_level"] as double + (ammo_values[weapon.ammo]['Base Frost Build-up'] == '-' ? 0 : ammo_values[weapon.ammo]['Base Frost Build-up'] as double)
            if(weapon.base_weapon_name == 'Serpent Bow') new_attack_stats["Poison +$upgrade_level"] = 15
            new_attack_stats["Poison +$upgrade_level"] = new_attack_stats["Poison +$upgrade_level"] as double + (ammo_values[weapon.ammo]['Base Poison Build-up'] == '-' ? 0 : ammo_values[weapon.ammo]['Base Poison Build-up'] as double)
            new_attack_stats["Blood +$upgrade_level"] = new_attack_stats["Blood +$upgrade_level"] as double + (ammo_values[weapon.ammo]['Base Blood Build-up'] == '-' ? 0 : ammo_values[weapon.ammo]['Base Blood Build-up'] as double)
        }
        new_attack_stats.Name = weapon.name
        [weapon.name, new_attack_stats]
    }catch(e){
        println weapon
        println e
        throw e
    }
}
//clean up the object
Passive = Passive.collectEntries{ key, entry ->
    try{
        def new_entry = [:]
        
        if(entry['Scarlet Rot +0'] as double > 0) new_entry['r'] = entry['Scarlet Rot +0']
        if(entry['Madness +0'] as double > 0) new_entry['m'] = entry['Madness +0']
        if(entry['Sleep +0'] as double > 0) new_entry['s'] = entry['Sleep +0']
        
        (25 + 1).times{ upgrade_level ->
            if(entry["Frost +$upgrade_level"] as double > 0) new_entry["f$upgrade_level"] = entry["Frost +$upgrade_level"]
            if(entry["Poison +$upgrade_level"] as double > 0) new_entry["p$upgrade_level"] = entry["Poison +$upgrade_level"]
            if(entry["Blood +$upgrade_level"] as double > 0) new_entry["b$upgrade_level"] = entry["Blood +$upgrade_level"]
        }
        
        [key, new_entry]
    }catch(e){
        pritnln key
        println entry
        println e
        throw e
    }
}
new File(targetDirectory, 'weapon_passives.json').write(JsonOutput.toJson(Passive))
*/