var weapons = {}
fetch('data/weapons.json')
    .then(response => response.json())
    .then(data => weapons = data)

window.onload = function() {
    document.getElementById("searchbar")
        .addEventListener("keyup", function(event) {
            if(event.keyCode === 13)
                search();
        });
}

function search() {
    document.getElementById("output").innerHTML = JSON.stringify(getWeapon(document.getElementById("searchbar").value), null, 2);
}

function getWeapon(name) {
    return weapons[name];
}