import groovy.json.*

def sourceDirectory = '../src_data'
def targetDirectory = '../data'
def fileNames = [
    'Extra_Data',
    'Attack',
    'CalcCorrectGraph_ID',
    'SpEffectParam',
    'Passive',
    'Scaling',
    'AttackElementCorrectParam',
    //'Boss_Data',
]

def csvSplitterExpression = /,(?=(?:[^"]*"[^"]*")*[^"]*$)/
def csvOuterQuoteExpression = /^"|"$/
def getLineList = { String line ->
    line.split(csvSplitterExpression).collect{it.replaceAll(csvOuterQuoteExpression, '')}
}

def csvToObject = { String fileName ->
    def lines = new File(sourceDirectory, fileName + ".csv").readLines()
    def columns = getLineList(lines[0])
    def object = lines[1..-1].collect{
        getLineList(it)
    }.collectEntries{
        //fixes epee
        it[0] = it[0].replaceAll('epee', 'Epee')
        [it[0], [columns, it].transpose().collectEntries()]
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

fileNames.each{
    binding.setProperty(it, csvToObject(it))
}

Boss_Data = csvToArray('Boss_Data')

new File(targetDirectory, 'boss_data.json').write(JsonOutput.toJson(Boss_Data))

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