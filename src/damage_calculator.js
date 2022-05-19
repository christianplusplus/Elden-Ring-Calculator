//window[window.btoa('signature')]()
self['c2lnbmF0dXJl'] = function(){return window.atob('Q29kZSB3cml0dGVuIGJ5IENocmlzdGlhbiBXZW5kbGFuZHQuIEFsbCByaWdodHMgcmVzZXJ2ZWQu');};

self['status_update'] = function(){console.log('No status_update function defined.')};

self['optimize'] = function(objective_statement, minimum_attributes, optimize_class, optimize_free_points, class_level, free_points, weapons, enemy, modifiers, options) {
    progress_count = 0;
    progress_total = weapons.length * Object.keys(class_stats).length;
    
    var objective = get_damage_objective(enemy); //TODO should depend on objective_statement
    
    if(optimize_class) {
        if(optimize_free_points)
            return optimize_class_with_class_level(objective, minimum_attributes, class_level, weapons, modifiers, options);
        return optimize_class_with_minimum_attributes(objective, minimum_attributes, weapons, modifiers, options);
    }
    if(!optimize_free_points)
        free_points = 0;
    return optimize_weapons(objective, minimum_attributes, free_points, weapons, modifiers, options)
}

function optimize_class_with_class_level(objective, minimum_attributes, class_level, weapons, modifiers, options) {
    var highest_value = 0;
    var best_weapon_and_attributes;
    var best_class;
    
    for(var [class_name, class_stats] of Object.entries(class_stats)) {
        var minimum_class_attributes = {};
        var free_points = class_level + 79;
        for(var [attr_name, attr_value] of Object.entries(minimum_attributes)) {
            minimum_class_attributes[attr_name] = Math.max(attr_value, class_stats[attr_name]);
            free_points -= minimum_class_attributes[attr_name];
        }
        if(free_points < 0) {
            progress(weapons.length);
            continue;
        }
        
        var [value, weapon_and_attributes] = optimize_weapons(objective, minimum_class_attributes, free_points, weapons, modifiers, options);
        if(value > highest_value) {
            highest_value = value;
            best_weapon_and_attributes = weapon_and_attributes;
            best_class = {name: class_name, stats: class_stats};
        }
        progress();
    }
    
    return [highest_value, best_weapon_and_attributes, best_class];
}

function optimize_class_with_minimum_attributes(objective, minimum_attributes, weapons, modifiers, options) {
    var highest_value = 0;
    var lowest_level = Number.MAX_VALUE;
    var best_weapon_and_attributes;
    var best_class;
    
    for(var [class_name, class_stats] of Object.entries(class_stats)) {
        var minimum_class_attributes = {};
        var class_level = -79;
        for(var [attr_name, attr_value] of Object.entries(minimum_attributes)) {
            minimum_class_attributes[attr_name] = Math.max(attr_value, class_stats[attr_name]);
            class_level += minimum_class_attributes[attr_name];
        }
        
        var [value, weapon_and_attributes] = optimize_weapons(objective, minimum_class_attributes, 0, weapons, modifiers, options);
        if(value > highest_value || (value == highest_value && class_level < lowest_level)) {
            highest_value = value;
            lowest_level = class_level;
            best_weapon_and_attributes = weapon_and_attributes;
            best_class = {name: class_name, stats: class_stats};
        }
        progress();
    }
    
    return [highest_value, best_weapon_and_attributes, best_class];
}

function optimize_weapons(objective, minimum_attributes, free_points, weapons, modifiers, options) {
    var highest_value = 0;
    var best_weapon_and_attributes;
    
    for(var weapon of weapons) {
        var [value, weapon_and_attributes] = optimize_attributes(objective, minimum_attributes, free_points, weapon, modifiers, options);
        if(value > highest_value) {
            highest_value = value;
            best_weapon_and_attributes = weapon_and_attributes;
        }
        progress();
    }
    
    return [highest_value, best_weapon_and_attributes];
}

function optimize_attributes(objective, minimum_attributes, free_points, weapon, modifiers, options) {
    var minimum_weapon_attributes = get_minimum_weapon_attributes(weapon, minimum_attributes, free_points, options);
    
    if(minimum_weapon_attributes) {
        var free_points_for_weapon = free_points + get_attack_attribute_sum(minimum_attributes) - get_attack_attribute_sum(minimum_weapon_attributes);
        var initial_attribute_distribution = get_initial_attribute_distribution(minimum_weapon_attributes, free_points_for_weapon);
        return ascent_solver(objective, {'weapon':weapon,'attrs':initial_attribute_distribution}, attr_generator, get_attr_contraints(minimum_weapon_attributes));
    }
    
    if(options['must_have_required_attributes'])
        return [-1, null];
    
    var attribute_combinations = get_attack_attribute_combinations(minimum_attributes, free_points);
    var weapon_attribute_states = get_weapon_attribute_states(weapon, attribute_combinations);
    return brute_solver(objective, weapon_attribute_states);
}

var class_stats = {
    hero : {'lvl':7,'vig':14,'min':9,'end':12,'str':16,'dex':9,'int':7,'fai':8,'arc':11},
    bandit : {'lvl':5,'vig':10,'min':11,'end':10,'str':9,'dex':13,'int':9,'fai':8,'arc':14},
    astrologer : {'lvl':6,'vig':9,'min':15,'end':9,'str':8,'dex':12,'int':16,'fai':7,'arc':9},
    warrior : {'lvl':8,'vig':11,'min':12,'end':11,'str':10,'dex':16,'int':10,'fai':8,'arc':9},
    prisoner : {'lvl':9,'vig':11,'min':12,'end':11,'str':11,'dex':14,'int':14,'fai':6,'arc':9},
    confessor : {'lvl':10,'vig':10,'min':13,'end':10,'str':12,'dex':12,'int':9,'fai':14,'arc':9},
    wretch : {'lvl':1,'vig':10,'min':10,'end':10,'str':10,'dex':10,'int':10,'fai':10,'arc':10},
    vagabond : {'lvl':9,'vig':15,'min':10,'end':11,'str':14,'dex':13,'int':9,'fai':9,'arc':7},
    prophet : {'lvl':7,'vig':10,'min':14,'end':8,'str':11,'dex':10,'int':7,'fai':16,'arc':10},
    samurai : {'lvl':9,'vig':12,'min':11,'end':13,'str':12,'dex':15,'int':9,'fai':8,'arc':8},
};

var attack_types = [
    'physical',
    'magic',
    'fire',
    'lightning',
    'holy',
];

var attack_sources = [
    'str',
    'dex',
    'int',
    'fai',
    'arc',
];

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

function DAMAGE_FORMULA(attack_power, defense, resistance, movement_value) {
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
    return damage * resistance * movement_value;
}

var progress_count = 0;
var progress_total = 100;
function progress(units = 1) {
    progress_count += units;
    self['status_update'](progress_count / progress_total);
}

function get_minimum_weapon_attributes(weapon, minimum_attributes, free_attributes, options) {
    var locked_attribute_distribution = {};
    var attributes_needed = Math.max((options['is_two_handing'] ? Math.ceil(parseInt(weapon['required_str']) / 1.5) : parseInt(weapon['required_str'])) - minimum_attributes['str'], 0);
    locked_attribute_distribution['str'] = minimum_attributes['str'] + attributes_needed;
    free_attributes -= attributes_needed;
    attack_sources.slice(1).forEach(attack_source => {
        attributes_needed = Math.max(parseInt(weapon['required_' + attack_source]) - minimum_attributes[attack_source], 0);
        locked_attribute_distribution[attack_source] = minimum_attributes[attack_source] + attributes_needed;
        free_attributes -= attributes_needed;
    });
    return free_attributes >= 0 ? locked_attribute_distribution : null;
}

function beautify_weapon_stats(weapon, attributes, damage) {
    var attack_power = get_attack_power(weapon, attributes);
    var base_attack_power = attack_types.map(
            attack_type => ({[attack_type]: parseFloat(weapon['max_base_' + attack_type + '_attack_power'])})
        ).reduce(
            (a,b) => Object.assign(a,b),
            {}
        );
    var bonus_attack_power = Object.entries(attack_power).map(([attack_type, ap]) => ({[attack_type]: ap-base_attack_power[attack_type]})
            ).reduce(
                (a,b) => Object.assign(a,b),
                {}
            )
    return {
        name: weapon['name'],
        base_weapon_name : weapon['base_weapon_name'],
        affinity: weapon['affinity'],
        weight: weapon['weight'],
        weapon_type: weapon['weapon_type'],
        dual_wieldable: weapon['dual_wieldable'],
        required_str: weapon['required_str'],
        required_dex: weapon['required_dex'],
        required_int: weapon['required_int'],
        required_fai: weapon['required_fai'],
        required_arc: weapon['required_arc'],
        str_scaling_grade: get_scaling_grade(weapon['max_str_scaling']),
        dex_scaling_grade: get_scaling_grade(weapon['max_dex_scaling']),
        int_scaling_grade: get_scaling_grade(weapon['max_int_scaling']),
        fai_scaling_grade: get_scaling_grade(weapon['max_fai_scaling']),
        arc_scaling_grade: get_scaling_grade(weapon['max_arc_scaling']),
        physical_damage_types: weapon['physical_damage_types'],
        base_attack_power: Object.entries(base_attack_power).map(([attack_type, ap]) => ({[attack_type]: ap_format(ap)})
            ).reduce(
                (a,b) => Object.assign(a,b),
                {}
            ),
        bonus_attack_power: Object.entries(bonus_attack_power).map(([attack_type, ap]) => ({[attack_type]: ap_format(ap)})
            ).reduce(
                (a,b) => Object.assign(a,b),
                {}
            ),
        attack_power: Object.entries(attack_power).map(([attack_type, ap]) => ({[attack_type]: ap_format(ap)})
            ).reduce(
                (a,b) => Object.assign(a,b),
                {}
            ),
        scarlet_rot: parseInt(weapon['max_base_scarlet_rot']),
        madness: parseInt(weapon['max_base_madness']),
        sleep: parseInt(weapon['max_base_sleep']),
        frostbite: parseInt(weapon['max_base_frostbite']),
        poison: parseInt(weapon['max_base_poison']),
        bleed: parseInt(weapon['max_base_bleed']),
        damage: Math.floor(damage),
    };
}

function ap_format(ap) {
    return parseInt(ap.toFixed(0));
}

function get_scaling_grade(scaling) {
    scaling = parseFloat(scaling);
    if(scaling > 1.75)
        return 'S';
    if(scaling >= 1.4)
        return 'A';
    if(scaling >= 0.9)
        return 'B';
    if(scaling >= 0.6)
        return 'C';
    if(scaling >= 0.25)
        return 'D';
    if(scaling > 0)
        return 'E';
    return '-';
}

function get_attributes_needed_to_wield(weapon, attributes) {
    var needed = 0;
    needed += Math.max((is_two_handing ? Math.ceil(parseInt(weapon['required_str']) / 1.5) : parseInt(weapon['required_str'])) - attributes['str'], 0);
    for(var source in attributes.slice(1)) {
        needed += Math.max(parseInt(weapon['required_' + source]) - attributes[source], 0);
    }
    return needed;
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

function get_weapon_attribute_states(weapon, attribute_combinations) {
    var weapon_attribute_states = {'weapon':weapon,'attrs':attribute_combinations};
    weapon_attribute_states[Symbol.iterator] = function(){
        var old_iterator = weapon_attribute_states.attrs[Symbol.iterator]();
        return { next: function() {
            var next_object = old_iterator.next();
            return {
                done: next_object.done,
                value: {'weapon':weapon, 'attrs':next_object.value}
            };
        }};
    };
    return weapon_attribute_states;
}

function print_damage_weapon_attributes(damage, weapon_and_attributes) {
    console.log(damage, weapon_and_attributes.weapon.name, JSON.stringify(weapon_and_attributes.attrs));
}

function get_damage_objective(enemy) {
    return function(weapon_and_attrs) {
        return get_damage(weapon_and_attrs.weapon, weapon_and_attrs.attrs, enemy, weapon_and_attrs.weapon.physical_damage_types[0], 1);
    };
}

function attr_generator(weapon_and_attrs) {
    var speeds = [20, 1];
    var new_states = [];
    for(var source of attack_sources) {
        for(var otherSource of attack_sources) {
            if(otherSource != source) {
                for(var speed of speeds) {
                    var attrs = {
                        'str':weapon_and_attrs.attrs['str'],
                        'dex':weapon_and_attrs.attrs['dex'],
                        'int':weapon_and_attrs.attrs['int'],
                        'fai':weapon_and_attrs.attrs['fai'],
                        'arc':weapon_and_attrs.attrs['arc'],
                    };
                    attrs[source] -= speed;
                    attrs[otherSource] += speed;
                    new_states.push({'weapon':weapon_and_attrs.weapon,'attrs':attrs});
                }
            }
        }
    }
    return new_states;
}

function get_attr_contraints(min_attrs) {
    return [
        x => x.attrs['str'] <= 99,
        x => x.attrs['dex'] <= 99,
        x => x.attrs['int'] <= 99,
        x => x.attrs['fai'] <= 99,
        x => x.attrs['arc'] <= 99,
        x => x.attrs['str'] >= min_attrs['str'],
        x => x.attrs['dex'] >= min_attrs['dex'],
        x => x.attrs['int'] >= min_attrs['int'],
        x => x.attrs['fai'] >= min_attrs['fai'],
        x => x.attrs['arc'] >= min_attrs['arc'],
    ]
}

function ascent_solver(objective, initial_state, state_generator, constraints) {
    var highest_value = objective(initial_state);
    var next_state = initial_state;
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

function brute_solver(objective, state_space) {
    var optimal_state = state_space[Symbol.iterator]().next().value;
    var highest_value = objective(optimal_state);
    for(var state of state_space) {
        var value = objective(state);
        if(value > highest_value) {
            highest_value = value;
            optimal_state = state;
        }
    }
    return [highest_value, optimal_state];
}

function get_damage(weapon, attributes, target, swing_type, movement_value) {
    var attack_powers = get_attack_powers(weapon, attributes);
    return Object.entries(attack_powers).map(([attack_type, attack_power]) => get_type_damage(attack_type, attack_power, target, swing_type, movement_value)).reduce(sum);
}

function get_type_damage(attack_type, attack_power, target, swing_type, movement_value) {
    var defense = parseFloat(target[capitalize(attack_type) + ' Defense']) * 100;
    var resistance = parseFloat(attack_type == 'physical' ? target[capitalize(swing_type)] : target[capitalize(attack_type)]);
    return DAMAGE_FORMULA(attack_power, defense, resistance, movement_value);
}

function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function sum(a, b) {
    return a + b;
}

function get_attack_powers(weapon, attributes) {
    var attack_powers = {};
    attack_types.forEach( attack_type =>
        attack_powers[attack_type] = parseFloat(weapon['max_base_' + attack_type + '_attack_power']) + get_max_bonus_attack_power(weapon, attack_type, attributes)
    );
    return attack_powers;
}

function get_max_bonus_attack_power(weapon, attack_type, attributes) {
    var source_attack_power;
    if(attack_sources.every( source => meets_requirement(weapon, attack_type, attributes, source))) {
        var source_attack_powers = attack_sources.map( source => get_attack_power_per_source(weapon, attack_type, attributes, source));
        source_attack_power = source_attack_powers.reduce((a, b) => a + b);
    }
    else {
        source_attack_power = parseFloat(weapon['max_base_' + attack_type + '_attack_power']) * -0.4;
    }
    return source_attack_power;
}

function meets_requirement(weapon, attack_type, attributes, source) {
    if(source == 'str')
        return !can_scale(weapon, attack_type, source) || attributes[source] >= (is_two_handing ? Math.ceil(parseInt(weapon['required_str']) / 1.5) : parseInt(weapon['required_str']));
    return !can_scale(weapon, attack_type, source) || attributes[source] >= parseInt(weapon['required_' + source]);
}

function get_attack_power_per_source(weapon, attack_type, attributes, source) {
    if(!can_scale(weapon, attack_type, source))
        return 0;
    var attribute = attributes[source];
    if(is_two_handing && source == 'str')
        attribute *= 1.5;
    var base_attack_power = parseFloat(weapon['max_base_' + attack_type + '_attack_power']);
    var bonus_attack_power_scaling = parseFloat(weapon['max_' + source +'_scaling']);
    var calculation_id = parseInt(weapon[attack_type + '_damage_calculation_id'])
    var attribute_correction = parseFloat(attribute_curves[calculation_id](attribute)) / 100;
    var bonus_attack_power = base_attack_power * bonus_attack_power_scaling * attribute_correction;
    return bonus_attack_power;
}

function can_scale(weapon, attack_type, source) {
    return attack_element_scaling[weapon['attack_element_scaling_id']][attack_type + '_' + source + '_element_scaling'];
}

var minimum_attributes_catch = null;
var attack_attribute_combinations_catch;
function get_attack_attribute_combinations(minimum_attributes, free_attributes) {
    if(
        minimum_attributes_catch != null
        && minimum_attributes_catch['str'] == minimum_attributes['str']
        && minimum_attributes_catch['dex'] == minimum_attributes['dex']
        && minimum_attributes_catch['int'] == minimum_attributes['int']
        && minimum_attributes_catch['fai'] == minimum_attributes['fai']
        && minimum_attributes_catch['arc'] == minimum_attributes['arc']
        && minimum_attributes_catch['free_attributes'] == free_attributes
    ) return attack_attribute_combinations_catch;
    
    var attribute_combinations = [];
    for(var str = minimum_attributes['str']; str <= Math.min(99, minimum_attributes['str'] + free_attributes); str++) {
        for(var dex = minimum_attributes['dex']; dex <= Math.min(99, minimum_attributes['dex'] + free_attributes); dex++) {
            for(var i = minimum_attributes['int']; i <= Math.min(99, minimum_attributes['int'] + free_attributes); i++) {
                for(var fai = minimum_attributes['fai']; fai <= Math.min(99, minimum_attributes['fai'] + free_attributes); fai++) {
                    for(var arc = minimum_attributes['arc']; arc <= Math.min(99, minimum_attributes['arc'] + free_attributes); arc++) {
                        if(str + dex + i + fai + arc == free_attributes + get_attack_attribute_sum(minimum_attributes)) {
                            attribute_combinations.push({'str':str,'dex':dex,'int':i,'fai':fai,'arc':arc});
                        }
                    }
                }
            }
        }
    }
    
    minimum_attributes_catch = Object.create(minimum_attributes);
    minimum_attributes_catch['free_attributes'] = free_attributes;
    attack_attribute_combinations_catch = Object.create(attribute_combinations);
    return attribute_combinations;
}

function get_attack_attribute_sum(attributes) {
    return attributes['str'] + attributes['dex'] + attributes['int'] + attributes['fai'] + attributes['arc'];
}