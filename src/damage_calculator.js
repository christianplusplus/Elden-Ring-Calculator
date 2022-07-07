//window[window.btoa('signature')]()
self['c2lnbmF0dXJl'] = function(){return window.atob('Q29kZSB3cml0dGVuIGJ5IENocmlzdGlhbiBXZW5kbGFuZHQuIEFsbCByaWdodHMgcmVzZXJ2ZWQu');};

self['status_update'] = function(){console.log('No status_update function defined.')};

self['optimize'] = function(objective_statement, minimum_attributes, optimize_class, optimize_free_points, class_level, free_points, weapons, enemy, moveset_aggregate_name, hit_aggregate_name, modifiers, options) {
    progress_count = 0;
    progress_total = optimize_class ? weapons.length * Object.keys(class_stats).length : weapons.length;
    
    var objective = get_damage_objective(enemy, moveset_aggregate_name, hit_aggregate_name, modifiers, options); //TODO should depend on objective_statement
    var result_objective = get_result_objective(enemy, moveset_aggregate_name, hit_aggregate_name, modifiers, options);
    var result = {};
    var resultArray;
    try {
        if(optimize_class) {
            if(optimize_free_points)
                resultArray = optimize_class_with_class_level(objective, minimum_attributes, class_level, weapons, modifiers, options);
            else
                resultArray = optimize_class_with_minimum_attributes(objective, minimum_attributes, weapons, modifiers, options);
            result['class'] = {class_name: resultArray[2].name, attack_attributes: resultArray[1].attrs};
        }
        else {
            if(!optimize_free_points)
                free_points = 0;
            resultArray = optimize_weapons(objective, minimum_attributes, free_points, weapons, modifiers, options);
            if(optimize_free_points)
                result['attributes'] = resultArray[1].attrs;
        }
    } catch(e) {
        return {error: "No Results"};
    }
    result['weapon'] = beautify_weapon_stats(resultArray[1], result_objective, modifiers, options);
    return result;
}

function optimize_class_with_class_level(objective, minimum_attributes, class_level, weapons, modifiers, options) {
    var highest_value = 0;
    var best_weapon_and_attributes;
    var best_class;
    
    for(var [name, stats] of Object.entries(class_stats)) {
        var minimum_class_attributes = {};
        var free_points = class_level + 79;
        for(var [attr_name, attr_value] of Object.entries(minimum_attributes)) {
            minimum_class_attributes[attr_name] = Math.max(attr_value, stats[attr_name]);
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
            best_class = {name: name, stats: stats};
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
    
    for(var [name, stats] of Object.entries(class_stats)) {
        var minimum_class_attributes = {};
        var class_level = -79;
        for(var [attr_name, attr_value] of Object.entries(minimum_attributes)) {
            minimum_class_attributes[attr_name] = Math.max(attr_value, stats[attr_name]);
            class_level += minimum_class_attributes[attr_name];
        }
        
        var [value, weapon_and_attributes] = optimize_weapons(objective, minimum_class_attributes, 0, weapons, modifiers, options);
        if(value > highest_value || (value == highest_value && class_level < lowest_level)) {
            highest_value = value;
            lowest_level = class_level;
            best_weapon_and_attributes = weapon_and_attributes;
            best_class = {name: name, stats: stats};
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
    var minimum_weapon_attributes = get_minimum_weapon_attributes(weapon, minimum_attributes, free_points, modifiers, options);
    
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

function DAMAGE_FORMULA(attack_power, defense, resistance) {
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

var progress_count = 0;
var progress_total = 100;
function progress(units = 1) {
    progress_count += units;
    self['status_update'](progress_count / progress_total);
}

function get_minimum_weapon_attributes(weapon, minimum_attributes, free_attributes, modifiers, options) {
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

function beautify_weapon_stats(result, result_objective, modifiers, options) {
    var attack_power = get_attack_powers(result.weapon, result.attrs, modifiers, options);
    var base_attack_power = attack_types.map(
            attack_type => ({[attack_type]: parseFloat(result.weapon['base_' + attack_type + '_attack_power'])})
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
        name: result.weapon['name'],
        base_weapon_name : result.weapon['base_weapon_name'],
        affinity: result.weapon['affinity'],
        weight: result.weapon['weight'],
        weapon_type: result.weapon['weapon_type'],
        dual_wieldable: result.weapon['dual_wieldable'],
        required_str: result.weapon['required_str'],
        required_dex: result.weapon['required_dex'],
        required_int: result.weapon['required_int'],
        required_fai: result.weapon['required_fai'],
        required_arc: result.weapon['required_arc'],
        str_scaling_grade: get_scaling_grade(result.weapon['str_scaling']),
        dex_scaling_grade: get_scaling_grade(result.weapon['dex_scaling']),
        int_scaling_grade: get_scaling_grade(result.weapon['int_scaling']),
        fai_scaling_grade: get_scaling_grade(result.weapon['fai_scaling']),
        arc_scaling_grade: get_scaling_grade(result.weapon['arc_scaling']),
        physical_damage_types: result.weapon['physical_damage_types'],
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
        attack_power: Object.entries(attack_power).map(([attack_type, ap]) => ({[attack_type]: ap_format(base_attack_power[attack_type]) + ap_format(bonus_attack_power[attack_type])})
            ).reduce(
                (a,b) => Object.assign(a,b),
                {}
            ),
        scarlet_rot: parseInt(result.weapon['scarlet_rot']),
        madness: parseInt(result.weapon['madness']),
        sleep: parseInt(result.weapon['sleep']),
        frostbite: parseInt(result.weapon['frostbite']),
        poison: parseInt(result.weapon['poison']),
        bleed: parseInt(result.weapon['bleed']),
        damage: result_objective(result),
    };
}

function ap_format(ap) {
    return parseInt(ap);
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

function get_damage_objective(enemy, moveset_aggregate_name, hit_aggregate_name, modifiers, options) {
    return function(weapon_and_attrs) {
        return get_aggregate_attack_damage(weapon_and_attrs.weapon, weapon_and_attrs.attrs, modifiers, options, enemy, aggregators[moveset_aggregate_name], aggregators[hit_aggregate_name]);
    };
}

function get_result_objective(enemy, moveset_aggregate_name, hit_aggregate_name, modifiers, options) {
    return function(weapon_and_attrs) {
        return get_aggregate_attack_damage(weapon_and_attrs.weapon, weapon_and_attrs.attrs, modifiers, options, enemy, floor_aggregators[moveset_aggregate_name], floor_aggregators[hit_aggregate_name]);
    };
}

//TODO
/*
function get_damage_comparator(enemy, moveset_aggregate, hit_aggregate, modifiers, options) {
    return function(enemy, moveset_aggregate, hit_aggregate, modifiers, options) {
        function(a, b){
            get_attack_damage(weapon_and_attrs.weapon, weapon_and_attrs.attrs, enemy, weapon_and_attrs.weapon.physical_damage_types[0], 1, modifiers, options)
        }
    }(enemy, moveset_aggregate, hit_aggregate, modifiers, options)
}*/

var aggregators = {
    first: (arr, func) => arr.length > 0 ? func(arr[0]) : 0,
    last: (arr, func) => arr.length > 0 ? func(arr[arr.length - 1]) : 0,
    total: (arr, func) => arr.map(func).reduce(sum),
    average: (arr, func) => arr.map(func).reduce(sum) / arr.length,
}

var floor_aggregators = {
    first: (arr, func) => arr.length > 0 ? make_floored(func)(arr[0]) : 0,
    last: (arr, func) => arr.length > 0 ? make_floored(func)(arr[arr.length - 1]) : 0,
    total: (arr, func) => arr.map(make_floored(func)).reduce(sum),
    average: (arr, func) => parseFloat((arr.map(make_floored(func)).reduce(sum) / arr.length).toFixed(1)),
}

function make_floored(func) {
    return function(...args){
        return Math.floor(func(...args));
    };
}

function attr_generator(weapon_and_attrs) {
    var speeds = [20, 1];
    var new_states = [];
    var scalable_sources = attack_sources.filter(s => weapon_and_attrs.weapon[s + '_scaling'] != '0');
    for(var source of attack_sources) {
        for(var otherSource of scalable_sources) {
            if(otherSource != source) {
                for(var speed of speeds) {
                    var attrs = {};
                    for(var source_name of attack_sources)
                        attrs[source_name] = weapon_and_attrs.attrs[source_name];
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
    var constraints = [];
    for(var source of attack_sources) {
        constraints.push((s => x => x.attrs[s] <= 99)(source));
        constraints.push((s => x => x.attrs[s] >= min_attrs[s])(source));
    }
    return constraints;
}

function ascent_solver(objective, initial_state, state_generator, constraints) {
    var highest_value = objective(initial_state);
    var next_state = initial_state;
    do {
        var state = next_state;
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

/*
function get_attack_damage(weapon, attributes, target, swing_type, movement_value, modifiers, options) {
    var attack_powers = get_attack_powers(weapon, attributes, modifiers, options);
    var damage = get_movement_damage(attack_powers, target, swing_type, movement_value);
    return get_movement_damage(attack_powers, target, swing_type, movement_value);
}
*/

function get_aggregate_attack_damage(weapon, attributes, modifiers, options, target, moveset_aggregate, hit_aggregate) {
    var attack_powers = get_attack_powers(weapon, attributes, modifiers, options);
    var damage = moveset_aggregate(weapon.moveset, move => hit_aggregate(move, hit => get_movement_damage(attack_powers, target, hit[0], hit[1])));
    return damage;
}

function get_movement_damage(attack_powers, target, movement_value, swing_type) {
    var damage = Object.entries(attack_powers).map(([attack_type, attack_power]) => get_type_damage(attack_type, attack_power, target, movement_value, swing_type)).reduce(sum);
    return damage;
}

function get_type_damage(attack_type, attack_power, target, movement_value, swing_type) {
    attack_power *= movement_value / 100;
    var defense = parseFloat(target[capitalize(attack_type) + ' Defense']) * 100;
    var resistance = parseFloat(attack_type == 'physical' ? target[capitalize(swing_type)] : target[capitalize(attack_type)]);
    return DAMAGE_FORMULA(attack_power, defense, resistance);
}

function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function sum(a, b) {
    return a + b;
}

function get_attack_powers(weapon, attributes, modifiers, options) {
    var attack_powers = {};
    attack_types.forEach( attack_type =>
        attack_powers[attack_type] = parseFloat(weapon['base_' + attack_type + '_attack_power']) + get_max_bonus_attack_power(weapon, attack_type, attributes, modifiers, options)
    );
    return attack_powers;
}

function get_max_bonus_attack_power(weapon, attack_type, attributes, modifiers, options) {
    var source_attack_power;
    if(attack_sources.every( source => meets_requirement(weapon, attack_type, attributes, source, modifiers, options))) {
        var source_attack_powers = attack_sources.map( source => get_attack_power_per_source(weapon, attack_type, attributes, source, modifiers, options));
        source_attack_power = source_attack_powers.reduce((a, b) => a + b);
    }
    else {
        source_attack_power = parseFloat(weapon['base_' + attack_type + '_attack_power']) * -0.4;
    }
    return source_attack_power;
}

function meets_requirement(weapon, attack_type, attributes, source, modifiers, options) {
    if(source == 'str')
        return !can_scale(weapon, attack_type, source) || attributes[source] >= (options['is_two_handing'] ? Math.ceil(parseInt(weapon['required_str']) / 1.5) : parseInt(weapon['required_str']));
    return !can_scale(weapon, attack_type, source) || attributes[source] >= parseInt(weapon['required_' + source]);
}

function get_attack_power_per_source(weapon, attack_type, attributes, source, modifiers, options) {
    if(!can_scale(weapon, attack_type, source))
        return 0;
    var attribute = attributes[source];
    if(options['is_two_handing'] && source == 'str')
        attribute *= 1.5;
    var base_attack_power = parseFloat(weapon['base_' + attack_type + '_attack_power']);
    var bonus_attack_power_scaling = parseFloat(weapon[source +'_scaling']);
    var calculation_id = parseInt(weapon[attack_type + '_damage_calculation_id'])
    var attribute_correction = parseFloat(attribute_curves[calculation_id](attribute)) / 100;
    var bonus_attack_power = base_attack_power * bonus_attack_power_scaling * attribute_correction;
    return bonus_attack_power;
}

function can_scale(weapon, attack_type, source) {
    return weapon[attack_type + '_' + source + '_element_scaling'];
}

function mapObject(object, func) {
    return Object.keys(object).reduce(function(result, key) {
        result[key] = func(object[key]);
        return result;
    }, {});
}

function* inclusiveRange(start, end = null, step = 1) {
    if (end === null) {
        end = start;
        start = 0;
    }
    var current = start;
    while (current <= end) {
        yield current;
        current += step;
    }
}

function* permutateKeys(objects) {
    var iterators = mapObject(objects, l => l.values());
    var permutation = mapObject(iterators, i => i.next().value);
    yield Object.assign({}, permutation);

    var keys = Object.keys(objects);
    var index = 0;
    while(index < keys.length) {
        var key = keys[index];
        var next = iterators[key].next();
        if(next.done) {
            iterators[key] = objects[key].values();
            permutation[key] = iterators[key].next().value;
            index++;
        }
        else {
            permutation[key] = next.value;
            index = 0;
            yield Object.assign({}, permutation);
        }
    }
}

var minimum_attributes_cache = null;
var attack_attribute_combinations_cache;
function get_attack_attribute_combinations(minimum_attributes, free_attributes) {
    if(
        minimum_attributes_cache != null
        && attack_sources.every(source => minimum_attributes_cache[source] == minimum_attributes[source])
        && minimum_attributes_cache['free_attributes'] == free_attributes
    ) return attack_attribute_combinations_cache;
    
    var attribute_ranges = {};
    for(var source of attack_sources)
        attribute_ranges[source] = [...inclusiveRange(minimum_attributes[source], Math.min(99, minimum_attributes[source] + free_attributes))];
    
    var attribute_combinations = [];
    for(var permutation of permutateKeys(attribute_ranges))
        if(get_attack_attribute_sum(permutation) == free_attributes + get_attack_attribute_sum(minimum_attributes))
            attribute_combinations.push(permutation);
    
    minimum_attributes_cache = Object.assign({}, minimum_attributes);
    minimum_attributes_cache['free_attributes'] = free_attributes;
    attack_attribute_combinations_cache = attribute_combinations;
    return attribute_combinations;
}

function get_attack_attribute_sum(attributes) {
    return attack_sources.map(source => attributes[source]).reduce(sum);
}