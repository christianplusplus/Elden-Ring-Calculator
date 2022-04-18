var weapons = new Map();
var bosses = new Map();

fetch('data/weapons.json')
    .then(response => response.json())
    .then(data => {
        for(var [key, value] of Object.entries(data))
            weapons.set(key, value);
        
        var attack_element_scaling_params = new Map();
        fetch('data/flat_attack_element_scaling_params.json')
            .then(response => response.json())
            .then(data => {
                for(var [key, value] of Object.entries(data))
                    attack_element_scaling_params.set(key, value);
            
                for(var weapon of weapons.values()) {
                    for(var [key, value] of Object.entries(attack_element_scaling_params.get(weapon['attack_element_scaling_id']))) {
                        weapon[key] = value;
                    }
                }
            })
    });

fetch('data/boss_data.json')
    .then(response => response.json())
    .then(data => {
        for(var [key, value] of Object.entries(data))
            bosses.set(key, value);
        
        var difficulty_data = new Map();
        fetch('data/difficulty_data.json')
            .then(response => response.json())
            .then(data => {
                for(var [key, value] of Object.entries(data))
                    difficulty_data.set(key, value);
            
                for(var boss of bosses.values()) {
                    var id = boss["SpEffect ID"];
                    if(difficulty_data.has(id)) {
                        for(var [key, value] of Object.entries(difficulty_data.get(id))) {
                            boss[key] = value;
                        }
                    }
                }
                
                for(var [id, boss] of bosses.entries()) {
                    var option = document.createElement('option');
                    option.value = id;
                    option.innerHTML = boss['Name'];
                    document.getElementById('enemy').appendChild(option);
                }
            })
    });
/*
window.onload = function() {
    document.getElementById("weapon")
        .addEventListener("keyup", function(event) {
            if(event.keyCode === 13)
                compute();
        });
}*/

function enter_optimize_weapon_and_attributes() {
    document.getElementById('output').innerHTML = 'thinking...';
    var minimum_attributes = {
        'str':parseInt(document.getElementById('str').value),
        'dex':parseInt(document.getElementById('dex').value),
        'int':parseInt(document.getElementById('int').value),
        'fai':parseInt(document.getElementById('fai').value),
        'arc':parseInt(document.getElementById('arc').value),
    };
    var free_attributes = parseInt(document.getElementById('floatingPoints').value);
    var constraints = [];
    
    var weapon_type_options = Array.from(document.getElementById('weaponTypes').options);
    var weapon_type_filters = weapon_type_options
        .filter(option => option.selected)
        .map(option => option.value)
        .map(type => (x => x.weapon_type == type));
    if(weapon_type_filters.length && !weapon_type_options.every(option => option.selected))
        constraints.push(weapon_type_filters.reduce(disjunction));
    
    var affinity_options = Array.from(document.getElementById('affinities'));
    var affinity_filters = affinity_options
        .filter(option => option.selected)
        .map(option => option.value)
        .map(affinity => (x => x.affinity == affinity));
    if(affinity_filters.length && !affinity_options.every(option => option.selected))
        constraints.push(affinity_filters.reduce(disjunction));
    
    is_two_handing = document.getElementById('isTwoHanding').checked;
    must_have_required_attributes = document.getElementById('meetsAttributeRequirements').checked;
    enemy = bosses.get(document.getElementById('enemy').value);
    if(document.getElementById('isDualWieldable').checked)
        constraints.push(x => x.dual_wieldable);
    
    var result = optimize_weapon_and_attributes(
        minimum_attributes,
        free_attributes,
        constraints
    )
    console.log('done');
    document.getElementById('output').innerHTML = JSON.stringify(result, null, 2);
}

function load_class() {
    for(var [source, value] of Object.entries(get_attack_stats(class_stats[document.getElementById('classes').value])))
        document.getElementById(source).value = value;
}

var disjunction = (a, b) => (x => a(x) || b(x));