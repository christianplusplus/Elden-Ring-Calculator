var vagabond_stats = {'str':14,'dex':13,'int':9,'fai':9,'arc':7};
var must_have_required_attributes = false;
var attack_types = [
    'physical',
    'magic',
    'fire',
    'lightning',
    'holy',
]
var attack_sources = [
    'str',
    'dex',
    'int',
    'fai',
    'arc',
]
function IF(a, b, c) {return a ? b : c;}
function ADD(a, b) {return a + b;}
function MINUS(a, b) {return a - b;}
function MULTIPLY(a, b) {return a * b;}
function DIVIDE(a, b) {return a / b;}
function POW(a, b) {return a ** b;}
var attribute_curves = {
    0:function(attribute){
            return IF(attribute>80,ADD(90,MULTIPLY(20,DIVIDE(attribute-80,70))),
            IF(attribute>60,ADD(75,MULTIPLY(15,DIVIDE(attribute-60,20))),
            IF(attribute>18,ADD(25,MULTIPLY(50,MINUS(1,POW(MINUS(1,DIVIDE(attribute-18,42)),1.2)))),
            MULTIPLY(25,POW(DIVIDE(attribute-1,17),1.2)) )))
    },
    1:function(attribute){
            return IF(attribute>80,ADD(90,MULTIPLY(20,DIVIDE(attribute-80,70))),
            IF(attribute>60,ADD(75,MULTIPLY(15,DIVIDE(attribute-60,20))),
            IF(attribute>20,ADD(35,MULTIPLY(40,MINUS(1,POW(MINUS(1,DIVIDE(attribute-20,40)),1.2)))),
            MULTIPLY(35,POW(DIVIDE(attribute-1,19),1.2)) )))
    },
    2:function(attribute){
            return IF(attribute>80,ADD(90,MULTIPLY(20,DIVIDE(attribute-80,70))),
            IF(attribute>60,ADD(75,MULTIPLY(15,DIVIDE(attribute-60,20))),
            IF(attribute>20,ADD(35,MULTIPLY(40,MINUS(1,POW(MINUS(1,DIVIDE(attribute-20,40)),1.2)))),
            MULTIPLY(35,POW(DIVIDE(attribute-1,19),1.2)) )))
    },
    4:function(attribute){
            return IF(attribute>80,ADD(95,MULTIPLY(5,DIVIDE(attribute-80,19))),
            IF(attribute>50,ADD(80,MULTIPLY(15,DIVIDE(attribute-50,30))),
            IF(attribute>20,ADD(40,MULTIPLY(40,DIVIDE(attribute-20,30))),
            MULTIPLY(40,DIVIDE(attribute-1,19)) )))
    },
    7:function(attribute){
            return IF(attribute>80,ADD(90,MULTIPLY(20,DIVIDE(attribute-80,70))),
            IF(attribute>60,ADD(75,MULTIPLY(15,DIVIDE(attribute-60,20))),
            IF(attribute>20,ADD(35,MULTIPLY(40,MINUS(1,POW(MINUS(1,DIVIDE(attribute-20,40)),1.2)))),
            MULTIPLY(35,POW(DIVIDE(attribute-1,19),1.2)) )))
    },
    8:function(attribute){
            return IF(attribute>80,ADD(90,MULTIPLY(20,DIVIDE(attribute-80,70))),
            IF(attribute>60,ADD(75,MULTIPLY(15,DIVIDE(attribute-60,20))),
            IF(attribute>16,ADD(25,MULTIPLY(50,MINUS(1,POW(MINUS(1,DIVIDE(attribute-16,44)),1.2)))),
            MULTIPLY(25,POW(DIVIDE(attribute-1,15),1.2)) )))
    },
    12:function(attribute){
            return IF(attribute>45,ADD(75,MULTIPLY(25,DIVIDE(attribute-45,54))),
            IF(attribute>30,ADD(55,MULTIPLY(20,DIVIDE(attribute-30,15))),
            IF(attribute>15,ADD(10,MULTIPLY(45,DIVIDE(attribute-15,15))),
            MULTIPLY(10,DIVIDE(attribute-1,14)) )))
    },
    14:function(attribute){
            return IF(attribute>80,ADD(85,MULTIPLY(15,DIVIDE(attribute-80,19))),
            IF(attribute>40,ADD(60,MULTIPLY(25,DIVIDE(attribute-40,40))),
            IF(attribute>20,ADD(40,MULTIPLY(20,DIVIDE(attribute-20,20))),
            MULTIPLY(40,DIVIDE(attribute-1,19)) )))
    },
    15:function(attribute){
            return IF(attribute>80,ADD(95,MULTIPLY(5,DIVIDE(attribute-80,19))),
            IF(attribute>60,ADD(65,MULTIPLY(30,DIVIDE(attribute-60,20))),
            IF(attribute>25,ADD(25,MULTIPLY(40,DIVIDE(attribute-25,35))),
            MULTIPLY(25,DIVIDE(attribute-1,24)) )))
    },
    16:function(attribute){
            return IF(attribute>80,ADD(90,MULTIPLY(10,DIVIDE(attribute-80,19))),
            IF(attribute>60,ADD(75,MULTIPLY(15,DIVIDE(attribute-60,20))),
            IF(attribute>18,ADD(20,MULTIPLY(55,DIVIDE(attribute-18,42))),
            MULTIPLY(20,DIVIDE(attribute-1,17)) )))
    },
}

function optimize(weapon_type, minimum_attributes, free_attributes) {
    var prospective_weapons = Array.from(weapons.values()).filter(weapon => weapon.weapon_type == weapon_type);
    var attribute_combinations;
    var need_attribute_combinations = true;
    
    var best_damage = -1;
    var best_weapon;
    var best_attr;
    for(var weapon of prospective_weapons) {
        var locked_attribute_distribution = get_locked_attribute_distribution(weapon, minimum_attributes, free_attributes);
        var damage = 0;
        var attributes;
        if(!locked_attribute_distribution) {
            if(must_have_required_attributes) {
                console.log('Couldn\'t wield ' + weapon.name + '!')
                continue;
            }
            if(need_attribute_combinations) {
                attribute_combinations = get_attribute_combinations(minimum_attributes, free_attributes);
                need_attribute_combinations = false;
            }
            for(var attribute_combination of attribute_combinations) {
                var damage_with_attributes = getDamage(weapon, attribute_combination, bosses.get('11'), weapon.physical_damage_types[0]);
                if(damage_with_attributes > damage) {
                    damage = damage_with_attributes;
                    attributes = attribute_combination;
                }
            }
        }
        else {
            var initial_attribute_distribution = get_initial_attribute_distribution(locked_attribute_distribution, free_attributes + Object.values(minimum_attributes).reduce((a,b)=>a+b) - Object.values(locked_attribute_distribution).reduce((a,b)=>a+b));
            var final_state;
            [damage, final_state] = CSPSolver(damage_objective, {'weapon':weapon,'attrs':initial_attribute_distribution}, attr_generator, get_attr_contraints(locked_attribute_distribution));
            attributes = final_state.attrs;
        }
        console.log([damage, weapon, attributes]);
        if(damage > best_damage) {
            best_damage = damage;
            best_weapon = weapon;
            best_attr = attributes;
        }
    }
    return [best_damage, best_weapon, best_attr];
}

function get_locked_attribute_distribution(weapon, minimum_attributes, free_attributes) {
    var locked_attribute_distribution = {};
    attack_sources.forEach(attack_source => {
        var attributes_needed = Math.max(parseInt(weapon['required_' + attack_source]) - minimum_attributes[attack_source], 0);
        locked_attribute_distribution[attack_source] = minimum_attributes[attack_source] + attributes_needed;
        free_attributes -= attributes_needed;
    });
    return free_attributes >= 0 ? locked_attribute_distribution : null;
}

function get_initial_attribute_distribution(locked_attribute_distribution, free_attributes) {
    var initial_attribute_distribution = {};
    attack_sources.forEach(attack_source => {
        var attributes_needed = Math.min(99 - locked_attribute_distribution[attack_source], free_attributes);
        initial_attribute_distribution[attack_source] = locked_attribute_distribution[attack_source] + attributes_needed;
        free_attributes -= attributes_needed;
    });
    return initial_attribute_distribution;
}

function damage_objective(weapon_and_attrs) {
    return getDamage(weapon_and_attrs.weapon, weapon_and_attrs.attrs, bosses.get('11'), weapon_and_attrs.weapon.physical_damage_types[0]);
}

function attr_generator(weapon_and_attrs) {
    var new_states = [];
    for(var source of attack_sources) {
        for(var otherSource of attack_sources) {
            if(otherSource != source) {
                var attrs = {
                    'str':weapon_and_attrs.attrs['str'],
                    'dex':weapon_and_attrs.attrs['dex'],
                    'int':weapon_and_attrs.attrs['int'],
                    'fai':weapon_and_attrs.attrs['fai'],
                    'arc':weapon_and_attrs.attrs['arc'],
                };
                attrs[source]--;
                attrs[otherSource]++;
                new_states.push({'weapon':weapon_and_attrs.weapon,'attrs':attrs});
            }
        }
    }
    return new_states;
}

function get_attr_contraints(class_attrs) {
    return [
        x => x.attrs['str'] <= 99,
        x => x.attrs['dex'] <= 99,
        x => x.attrs['int'] <= 99,
        x => x.attrs['fai'] <= 99,
        x => x.attrs['arc'] <= 99,
        x => x.attrs['str'] >= class_attrs['str'],
        x => x.attrs['dex'] >= class_attrs['dex'],
        x => x.attrs['int'] >= class_attrs['int'],
        x => x.attrs['fai'] >= class_attrs['fai'],
        x => x.attrs['arc'] >= class_attrs['arc'],
    ]
}

function CSPSolver(objective, state, state_generator, constraints) {
    var next_state = state;
    var highest_value = objective(state);
    do {
        state = next_state;
        next_state = null;
        for(var candidate_state of state_generator(state)) {
            if(constraints.every(constraint => constraint(candidate_state))) {
                var value = objective(candidate_state);
                if(value > highest_value) {
                    highest_value = value;
                    next_state = candidate_state;
                }
            }
        }
    }while(next_state);
    return [highest_value, state];
}

function getDamage(weapon, attributes, target, swing_type) {
    var attackPowers = getAttackPower(weapon, attributes);
    var damage = Object.entries(attackPowers).map(([attack_type, attack_power]) => getTypeDamage(attack_type, attack_power, swing_type, target));
    return damage.reduce((a, b) => a + b);
}

function getTypeDamage(attack_type, attack_power, swing_type, target) {
    var defense = parseFloat(target[capitalize(attack_type) + ' Defense']) * 100;
    var resistance = parseFloat(attack_type == 'physical' ? target[capitalize(swing_type)] : target[capitalize(attack_type)]);
    return damageFormula(attack_power, defense, resistance);
}

function damageFormula(attack_power, defense, resistance) {
    var damage;
    if(defense > attack_power * 8)
        damage = 0.1 * attack_power;
    else if(defense > attack_power)
        damage = attack_power * (19.2 / 49 * (attack_power / defense - 0.125) ** 2 + 0.1);
    else if(defense > attack_power * 0.4)
        damage = attack_power * (-0.4 / 3 * (attack_power / defense - 2.5) ** 2 + 0.7);
    else if(defense > attack_power * 0.125)
        damage = attack_power * (-0.8 / 121 * (attack_power / defense - 8) ** 2 + 0.9);
    else
        damage = attack_power * 0.9;
    return damage * resistance;
}

function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function getAttackPower(weapon, attributes) {
    var attackPowers = {};
    attack_types.forEach( attack_type =>
        attackPowers[attack_type] = parseFloat(weapon['max_base_' + attack_type + '_attack_power']) + getMaxBonusAttackPower(weapon, attack_type, attributes)
    );
    return attackPowers;
}

function getMaxBonusAttackPower(weapon, attack_type, attributes) {
    var source_attack_power;
    if(attack_sources.every( source => meetsRequirement(weapon, attack_type, attributes, source))) {
        var source_attack_powers = attack_sources.map( source => getAttackPowerPerSource(weapon, attack_type, attributes, source));
        source_attack_power = source_attack_powers.reduce((a, b) => a + b);
    }
    else {
        source_attack_power = parseFloat(weapon['max_base_' + attack_type + '_attack_power']) * -0.4;
    }
    return source_attack_power;
}

function meetsRequirement(weapon, attack_type, attributes, source) {
    return !weapon[attack_type + '_' + source + '_element_scaling'] || attributes[source] >= parseInt(weapon['required_' + source]);
}

function getAttackPowerPerSource(weapon, attack_type, attributes, source) {
    if(!weapon[attack_type + '_' + source + '_element_scaling'])
        return 0;
    var base_attack_power = parseFloat(weapon['max_base_' + attack_type + '_attack_power']);
    var bonus_attack_power_scaling = parseFloat(weapon['max_' + source +'_scaling']);
    var calculation_id = parseInt(weapon[attack_type + '_damage_calculation_id'])
    var attribute_correction = parseFloat(attribute_curves[calculation_id](attributes[source])) / 100;
    var bonus_attack_power = base_attack_power * bonus_attack_power_scaling * attribute_correction;
    return bonus_attack_power;
}

function old_find_best_sword() {
    return bs = old_find_best('Straight Sword', {'str':14,'dex':13,'int':9,'fai':9,'arc':7}, 104)
}

function old_find_best(weapon_type, attributes, free_attributes) {
    var prospective_weapons = Array.from(weapons.values()).filter(weapon => weapon.weapon_type == weapon_type);
    var attr_combinations = get_attribute_combinations(attributes, free_attributes);
    
    console.log('Comparing ' + prospective_weapons.length * attr_combinations.length + ' weapon/stat combinations.')
    var count = 0n;
    var max_damage = 0;
    var best_sword;
    var best_attr;
    for(var attr of attr_combinations) {
        for(var weapon of prospective_weapons) {
            var damage = getDamage(weapon, attr, bosses.get('11'), weapon.physical_damage_types[0]);
            count++;
            if(damage > max_damage) {
                max_damage = damage;
                best_sword = weapon.name;
                best_attr = JSON.stringify(attr);
                console.log([max_damage, best_sword, best_attr, count]);
            }
        }
    }
    return [max_damage, best_sword, best_attr];
}

function get_attribute_combinations(minimum_attributes, free_attributes) {
    var attribute_combinations = [];
    for(var str = minimum_attributes['str']; str <= Math.min(99, minimum_attributes['str'] + free_attributes); str++) {
        for(var dex = minimum_attributes['dex']; dex <= Math.min(99, minimum_attributes['dex'] + free_attributes); dex++) {
            for(var i = minimum_attributes['int']; i <= Math.min(99, minimum_attributes['int'] + free_attributes); i++) {
                for(var fai = minimum_attributes['fai']; fai <= Math.min(99, minimum_attributes['fai'] + free_attributes); fai++) {
                    for(var arc = minimum_attributes['arc']; arc <= Math.min(99, minimum_attributes['arc'] + free_attributes); arc++) {
                        if(str + dex + i + fai + arc == free_attributes + Object.values(minimum_attributes).reduce((a, b)=>a+b)) {
                            attribute_combinations.push({'str':str,'dex':dex,'int':i,'fai':fai,'arc':arc});
                        }
                    }
                }
            }
        }
    }
    return attribute_combinations;
}