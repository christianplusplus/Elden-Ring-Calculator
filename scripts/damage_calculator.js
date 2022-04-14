function best() {
    console.log(bestSword({'str':14,'dex':13,'int':9,'fai':9,'arc':7}, 104));
}

function bestSword(attributes, freeAttributes) {
    var swords = Object.entries(weapons).map(([k,v])=>v).filter(weapon => weapon.weapon_type == "Straight Sword");
    var stat_combinations = []
    for(var str = attributes['str']; str < 100; str++) {
        for(var dex = attributes['dex']; dex < 100; dex++) {
            for(var i = attributes['int']; i < 10; i++) {
                for(var fai = attributes['fai']; fai < 10; fai++) {
                    for(var arc = attributes['arc']; arc < 8; arc++) {
                        if(str + dex + i + fai + arc == freeAttributes + attributes['str'] + attributes['dex'] + attributes['int'] + attributes['fai'] + attributes['arc']) {
                            stat_combinations.push({'str':str,'dex':dex,'int':i,'fai':fai,'arc':arc});
                        }
                    }
                }
            }
        }
    }
    var max_ar = 0;
    var best_sword;
    var best_attr;
    for(var attr of stat_combinations) {
        for(var sword of swords) {
            var ar = getAttackPower(sword, attr).reduce((a, b) => a + b);
            console.log([sword.name, ar])
            if(ar > max_ar) {
                max_ar = ar;
                best_sword = sword;
                best_attr = attr;
            }
        }
    }
    return [best_sword, max_ar, attr];
}

function getAttackPower(weapon, attributes) {
    return attack_types.map( attack_type =>
            parseFloat(weapon['max_base_' + attack_type + '_attack_power']) + getMaxBonusAttackPower(weapon, attack_type, attributes)
        );
}

function getMaxBonusAttackPower(weapon, attack_type, attributes) {
    var source_attack_powers = attack_sources.map( source => getAttackPowerPerSource(weapon, attack_type, attributes, source));
    var source_attack_power = source_attack_powers.reduce((a, b) => a + b);
    return source_attack_power;
}

function getAttackPowerPerSource(weapon, attack_type, attributes, source) {
    if(!weapon[attack_type + '_' + source + '_element_scaling'])
        return 0;
    var base_attack_power = parseFloat(weapon['max_base_' + attack_type + '_attack_power']);
    var bonus_attack_power_scaling = parseFloat(weapon['max_' + source +'_scaling']);
    var calculation_id = parseInt(weapon[attack_type + '_damage_calculation_id'])
    var attribute_correction = parseFloat(attribute_curves[calculation_id](attributes[source])) / 100;
    var bonus_attack_power = base_attack_power * bonus_attack_power_scaling * attribute_correction;
    //need to reduce power if stat requirements aren't met.
    return bonus_attack_power;
}


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