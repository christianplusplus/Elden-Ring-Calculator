var weapons = new Map();
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

var bosses = new Map();
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

window.onload = function() {
    document.getElementById("weapon")
        .addEventListener("keyup", function(event) {
            if(event.keyCode === 13)
                search();
        });
}

function search() {
    document.getElementById("output").innerHTML = Object.values(getAttackPower(
        weapons.get(document.getElementById("weapon").value),
        {
            "str" : parseInt(document.getElementById("str").value),
            "dex" : parseInt(document.getElementById("dex").value),
            "int" : parseInt(document.getElementById("int").value),
            "fai" : parseInt(document.getElementById("fai").value),
            "arc" : parseInt(document.getElementById("arc").value),
        }
    )).map(Math.floor);
}