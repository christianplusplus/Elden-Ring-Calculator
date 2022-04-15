var weapons = new Map();
var bosses = new Map();
var affinities = [];

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
                    for(var [key, value] of Object.entries(attack_element_scaling_params.get(weapon.attack_element_scaling_id))) {
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
    
    var selected_weapon_types = getSelectedValues(document.getElementById('weaponTypes'))
        .map(type => (x => (x.weapon_type == type)));
    if(selected_weapon_types.length)
        constraints.push(selected_weapon_types.reduce(disjunction));
    
    var selected_affinities = getSelectedValues(document.getElementById('affinities'))
        .map(affinity => (x => (x.affinity == affinity)));
    if(selected_affinities.length)
        constraints.push(selected_affinities.reduce(disjunction));
    
    var result = optimize_weapon_and_attributes(
        minimum_attributes,
        free_attributes,
        constraints
    )
    console.log('done');
    document.getElementById('output').innerHTML = JSON.stringify(result, null, 2);
}

function getSelectedValues(select) {
    return Array.from(select.options)
        .filter(option => option.selected)
        .map(option => option.value);
}

function disjunction(a, b) {
    return x => a(x) || b(x);
}