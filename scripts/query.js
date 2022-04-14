var weapons;
fetch('data/weapons.json')
    .then(response => response.json())
    .then(data => weapons = data)

var attack_element_scaling_params;
fetch('data/flat_attack_element_scaling_params.json')
    .then(response => response.json())
    .then(data => attack_element_scaling_params = data)


window.onload = function() {
    document.getElementById("weapon")
        .addEventListener("keyup", function(event) {
            if(event.keyCode === 13)
                search();
        });
}

function search() {
    document.getElementById("output").innerHTML = getAttackPower(
        getWeapon(document.getElementById("weapon").value),
        {
            "str" : parseInt(document.getElementById("str").value),
            "dex" : parseInt(document.getElementById("dex").value),
            "int" : parseInt(document.getElementById("int").value),
            "fai" : parseInt(document.getElementById("fai").value),
            "arc" : parseInt(document.getElementById("arc").value),
        }
    ).map(Math.floor);
}

function getWeapon(name) {
    var weapon = weapons[name];
    for(var [key, value] of Object.entries(attack_element_scaling_params[weapon.attack_element_scaling_id]))
        weapon[key] = value;
    return weapon;
}