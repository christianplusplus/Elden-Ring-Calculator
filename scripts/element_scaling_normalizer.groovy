import groovy.json.*

def slurper = new JsonSlurper()
def parameterScaling = slurper.parse(new File('source/AttackElementCorrectParam.json'))

def weapons = parameterScaling.collectEntries{ key, entry ->
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

new File('data/flat_attack_element_scaling_params.json').write(JsonOutput.toJson(weapons))