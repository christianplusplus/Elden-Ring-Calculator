import groovy.json.*

def sourceDirectory = '../src_data'
def targetDirectory = '../data'

def csvSplitterExpression = /,(?=(?:[^"]*"[^"]*")*[^"]*$)/
def csvOuterQuoteExpression = /^"|"$/
def getLineList = { String line ->
    line.split(csvSplitterExpression).collect{it.replaceAll(csvOuterQuoteExpression, '')}
}

List.metaClass.collectWithIndex = { yield ->
    def collected = []
    delegate.eachWithIndex { listItem, index ->
        collected << yield(listItem, index)
    }
    
    return collected 
}

def csvToObject = { String fileName ->
    def lines = new File(sourceDirectory, fileName + ".csv").readLines()
    def columns = getLineList(lines[0])
    def object = lines[1..-1].collect{
        getLineList(it)
    }.collectEntries{
    
        //fixes
        it[0] = it[0].replaceAll('epee', 'Epee')
        it[1] = it[1].replaceAll("Man-serpent's Shield", "Man-Serpent's Shield")
        it[1] = it[1].replaceAll("^Celebrant's Cleaver\$", "Celebrant's Cleaver Blades")
        it[1] = it[1].replaceAll("Relic Sword", "Sacred Relic Sword")
        it[1] = it[1].replaceAll("Mohgwyn's Spear", "Mohgwyn's Sacred Spear")
        
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
        it[1] = it[1].replaceAll('Épée', 'Epee')
        it[1] = it[1].replaceAll('Miséricorde', 'Misericorde')
        it[1] = it[1].replaceAll("Varré's Bouquet", "Varre's Bouquet")
        it[1] = it[1].replaceAll("Celebrant's Cleaver", "Celebrant's Cleaver Blades")
        
        [it[1], [columns, it].transpose().collectEntries()]
    }
}

def csvToArray = { String fileName ->
    def lines = new File(sourceDirectory, fileName + ".csv").readLines()
    def columns = getLineList(lines[0])
    def object = lines[1..-1].collect{
        getLineList(it)
    }.collect{
        [columns, it].transpose().collectEntries()
    }
}

//regular files to objects
def fileNames = [
    'Extra_Data',
    'Attack',
    'CalcCorrectGraph_ID',
    'SpEffectParam',
    'Passive',
    'Scaling',
    'AttackElementCorrectParam',
]
fileNames.each{binding.setProperty(it, csvToObject(it))}

//boss data to array
Boss_Data = csvToArray('Boss_Data')
Boss_Data << [['NPC ID','SpEffect ID','Name','HP','Standard','Slash','Strike','Pierce','Magic','Fire','Lightning','Holy','Poison','Rot','Blood','Frost','Sleep','Madness','Death Blight','Poise'],['76543210','0','Target Dummy (No Resistances, Weaknesses, or Difficulty Scaling)','60000.0','1','1','1','1','1','1','1','1','306.096','306.096','306.096','306.096','306.096','306.096','306.096','120']].transpose().collectEntries()
new File(targetDirectory, 'boss_data.json').write(JsonOutput.toJson(Boss_Data))

//swing values to Object
swing_values = motionCsvToObject('weapon_swing_types').collectEntries{ key, entry ->
    try{
        [key,
            [
                normal_light_1h: [entry['1h R1 1'], entry['1h R1 2'], entry['1h R1 3'], entry['1h R1 4'], entry['1h R1 5'], entry['1h R1 6']],
                normal_light_2h: [entry['2h R1 1'], entry['2h R1 2'], entry['2h R1 3'], entry['2h R1 4'], entry['2h R1 5'], entry['2h R1 6']],
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
                normal_light_1h: [entry['1h R1 1'], entry['1h R1 2'], entry['1h R1 3'], entry['1h R1 4'], entry['1h R1 5'], entry['1h R1 6']],
                normal_light_2h: [entry['2h R1 1'], entry['2h R1 2'], entry['2h R1 3'], entry['2h R1 4'], entry['2h R1 5'], entry['2h R1 6']],
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

new File(targetDirectory, 'difficulty_scaling.json').write(JsonOutput.toJson(SpEffectParam))

def weapons = Extra_Data.collect{ key, entry ->
    try{
        max_upgrade_level = entry['Max Upgrade']
        [
            'name': key,
            'base_weapon_name': entry['Weapon Name'],
            'affinity': entry['Affinity'] == '-' ? 'Somber' : entry['Affinity'],
            'max_upgrade_level': max_upgrade_level,
            'weight': entry['Weight'],
            //'poise': entry['Poise'],  got removed?
            'weapon_type': entry['Weapon Type'],
            'dual_wieldable': entry['2H Dual-Wield']=='Yes',
            'required_str': entry['Required (Str)'],
            'required_dex': entry['Required (Dex)'],
            'required_int': entry['Required (Int)'],
            'required_fai': entry['Required (Fai)'],
            'required_arc': entry['Required (Arc)'],
            'max_str_scaling': Scaling[(key)]["Str +$max_upgrade_level"],
            'max_dex_scaling': Scaling[(key)]["Dex +$max_upgrade_level"],
            'max_int_scaling': Scaling[(key)]["Int +$max_upgrade_level"],
            'max_fai_scaling': Scaling[(key)]["Fai +$max_upgrade_level"],
            'max_arc_scaling': Scaling[(key)]["Arc +$max_upgrade_level"],
            'physical_damage_types': entry['Physical Damage Type'].split('/'),
            'max_base_physical_attack_power': Attack[(key)]["Phys +$max_upgrade_level"],
            'max_base_magic_attack_power': Attack[(key)]["Mag +$max_upgrade_level"],
            'max_base_fire_attack_power': Attack[(key)]["Fire +$max_upgrade_level"],
            'max_base_lightning_attack_power': Attack[(key)]["Ligh +$max_upgrade_level"],
            'max_base_holy_attack_power': Attack[(key)]["Holy +$max_upgrade_level"],
            'max_base_stamina_attack_power': Attack[(key)]["Stam +$max_upgrade_level"],
            'max_base_scarlet_rot': Passive[(key)]['Scarlet Rot +0'],
            'max_base_madness': Passive[(key)]['Madness +0'],
            'max_base_sleep': Passive[(key)]['Sleep +0'],
            'max_base_frostbite': Passive[(key)]["Frost +$max_upgrade_level"],
            'max_base_poison': Passive[(key)]["Poison +$max_upgrade_level"],
            'max_base_bleed': Passive[(key)]["Blood +$max_upgrade_level"],
            'physical_damage_calculation_id': CalcCorrectGraph_ID[(key)]['Physical'],
            'magic_damage_calculation_id': CalcCorrectGraph_ID[(key)]['Magic'],
            'fire_damage_calculation_id': CalcCorrectGraph_ID[(key)]['Fire'],
            'lightning_damage_calculation_id': CalcCorrectGraph_ID[(key)]['Lightning'],
            'holy_damage_calculation_id': CalcCorrectGraph_ID[(key)]['Holy'],
            'attack_element_scaling_id': CalcCorrectGraph_ID[(key)]['AttackElementCorrect ID'],
        ]
    }catch(e){
        println key
        println entry
        println e
        throw e
    }
}
new File(targetDirectory, 'weapons.json').write(JsonOutput.toJson(weapons))