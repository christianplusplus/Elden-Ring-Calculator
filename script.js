var class_stats={hero:{lvl:7,vig:14,min:9,end:12,str:16,dex:9,"int":7,fai:8,arc:11},bandit:{lvl:5,vig:10,min:11,end:10,str:9,dex:13,"int":9,fai:8,arc:14},astrologer:{lvl:6,vig:9,min:15,end:9,str:8,dex:12,"int":16,fai:7,arc:9},warrior:{lvl:8,vig:11,min:12,end:11,str:10,dex:16,"int":10,fai:8,arc:9},prisoner:{lvl:9,vig:11,min:12,end:11,str:11,dex:14,"int":14,fai:6,arc:9},confessor:{lvl:10,vig:10,min:13,end:10,str:12,dex:12,"int":9,fai:14,arc:9},wretch:{lvl:1,vig:10,min:10,end:10,str:10,dex:10,"int":10,
fai:10,arc:10},vagabond:{lvl:9,vig:15,min:10,end:11,str:14,dex:13,"int":9,fai:9,arc:7},prophet:{lvl:7,vig:10,min:14,end:8,str:11,dex:10,"int":7,fai:16,arc:10},samurai:{lvl:9,vig:12,min:11,end:13,str:12,dex:15,"int":9,fai:8,arc:8}},attack_types=["physical","magic","fire","lightning","holy"],attack_sources=["str","dex","int","fai","arc"];function IF(a,b,d){return a?b:d}function ADD(a,b){return a+b}function MINUS(a,b){return a-b}function MULTIPLY(a,b){return a*b}function DIVIDE(a,b){return a/b}
function POW(a,b){return a**b}
var attribute_curves={0:function(a){return IF(80<a,ADD(90,MULTIPLY(20,DIVIDE(a-80,70))),IF(60<a,ADD(75,MULTIPLY(15,DIVIDE(a-60,20))),IF(18<a,ADD(25,MULTIPLY(50,MINUS(1,POW(MINUS(1,DIVIDE(a-18,42)),1.2)))),MULTIPLY(25,POW(DIVIDE(a-1,17),1.2)))))},1:function(a){return IF(80<a,ADD(90,MULTIPLY(20,DIVIDE(a-80,70))),IF(60<a,ADD(75,MULTIPLY(15,DIVIDE(a-60,20))),IF(20<a,ADD(35,MULTIPLY(40,MINUS(1,POW(MINUS(1,DIVIDE(a-20,40)),1.2)))),MULTIPLY(35,POW(DIVIDE(a-1,19),1.2)))))},2:function(a){return IF(80<a,ADD(90,
MULTIPLY(20,DIVIDE(a-80,70))),IF(60<a,ADD(75,MULTIPLY(15,DIVIDE(a-60,20))),IF(20<a,ADD(35,MULTIPLY(40,MINUS(1,POW(MINUS(1,DIVIDE(a-20,40)),1.2)))),MULTIPLY(35,POW(DIVIDE(a-1,19),1.2)))))},4:function(a){return IF(80<a,ADD(95,MULTIPLY(5,DIVIDE(a-80,19))),IF(50<a,ADD(80,MULTIPLY(15,DIVIDE(a-50,30))),IF(20<a,ADD(40,MULTIPLY(40,DIVIDE(a-20,30))),MULTIPLY(40,DIVIDE(a-1,19)))))},7:function(a){return IF(80<a,ADD(90,MULTIPLY(20,DIVIDE(a-80,70))),IF(60<a,ADD(75,MULTIPLY(15,DIVIDE(a-60,20))),IF(20<a,ADD(35,
MULTIPLY(40,MINUS(1,POW(MINUS(1,DIVIDE(a-20,40)),1.2)))),MULTIPLY(35,POW(DIVIDE(a-1,19),1.2)))))},8:function(a){return IF(80<a,ADD(90,MULTIPLY(20,DIVIDE(a-80,70))),IF(60<a,ADD(75,MULTIPLY(15,DIVIDE(a-60,20))),IF(16<a,ADD(25,MULTIPLY(50,MINUS(1,POW(MINUS(1,DIVIDE(a-16,44)),1.2)))),MULTIPLY(25,POW(DIVIDE(a-1,15),1.2)))))},12:function(a){return IF(45<a,ADD(75,MULTIPLY(25,DIVIDE(a-45,54))),IF(30<a,ADD(55,MULTIPLY(20,DIVIDE(a-30,15))),IF(15<a,ADD(10,MULTIPLY(45,DIVIDE(a-15,15))),MULTIPLY(10,DIVIDE(a-1,
14)))))},14:function(a){return IF(80<a,ADD(85,MULTIPLY(15,DIVIDE(a-80,19))),IF(40<a,ADD(60,MULTIPLY(25,DIVIDE(a-40,40))),IF(20<a,ADD(40,MULTIPLY(20,DIVIDE(a-20,20))),MULTIPLY(40,DIVIDE(a-1,19)))))},15:function(a){return IF(80<a,ADD(95,MULTIPLY(5,DIVIDE(a-80,19))),IF(60<a,ADD(65,MULTIPLY(30,DIVIDE(a-60,20))),IF(25<a,ADD(25,MULTIPLY(40,DIVIDE(a-25,35))),MULTIPLY(25,DIVIDE(a-1,24)))))},16:function(a){return IF(80<a,ADD(90,MULTIPLY(10,DIVIDE(a-80,19))),IF(60<a,ADD(75,MULTIPLY(15,DIVIDE(a-60,20))),IF(18<
a,ADD(20,MULTIPLY(55,DIVIDE(a-18,42))),MULTIPLY(20,DIVIDE(a-1,17)))))}};function DAMAGE_FORMULA(a,b,d){return(b>8*a?.1*a:b>a?a*(19.2/49*(a/b-.125)**2+.1):b>.4*a?a*(-.4/3*(a/b-2.5)**2+.7):b>.125*a?a*(-.8/121*(a/b-8)**2+.9):.9*a)*d}
function optimize_class_weapon_and_attributes(a,b,d){var c=weapons.filter(v=>d.every(w=>w(v))),e=0,f=0,g,k;for([g,k]of Object.entries(class_stats)){var h={},l=b+79,n,p;for([n,p]of Object.entries(a))h[n]=Math.max(p,k[n]),l-=h[n];if(0<=l){var r=!1,q;for(q of c){var m=get_locked_attribute_distribution(q,h,l);if(m){var t=get_initial_attribute_distribution(m,l+get_attack_attribute_sum(h)-get_attack_attribute_sum(m));[m,t]=CSPSolver(damage_objective,{weapon:q,attrs:t},attr_generator,get_attr_contraints(m))}else{if(must_have_required_attributes)continue;
if(!r){var x=get_attribute_combinations(h,l);r=!0}m=get_weapon_attribute_states(q,x);[m,t]=brute_solver(damage_objective,m)}status_update(++e/(c.length*Object.keys(class_stats).length));if(m>f){f=m;var u=t;var y=g}}}else e+=c.length,status_update(e/(c.length*Object.keys(class_stats).length))}return 0==f?c.length?{error:"Your target level is too low."}:{error:"No Weapons found."}:{weapon:beautify_weapon_stats(u.weapon,u.attrs,f),"class":{class_name:y,attack_attributes:u.attrs}}}
function optimize_weapon_and_attributes(a,b,d){var c=weapons.filter(r=>d.every(q=>q(r))),e=!1,f=0,g=0,k;for(k of c){var h=get_locked_attribute_distribution(k,a,b);if(h){var l=get_initial_attribute_distribution(h,b+get_attack_attribute_sum(a)-get_attack_attribute_sum(h));[h,l]=CSPSolver(damage_objective,{weapon:k,attrs:l},attr_generator,get_attr_contraints(h))}else{if(must_have_required_attributes)continue;if(!e){var n=get_attribute_combinations(a,b);e=!0}h=get_weapon_attribute_states(k,n);[h,l]=brute_solver(damage_objective,
h)}status_update(++f/c.length);if(h>g){g=h;var p=l}}return 0==g?{error:"No Weapons found."}:{weapon:beautify_weapon_stats(p.weapon,p.attrs,g),attributes:p.attrs}}function get_locked_attribute_distribution(a,b,d){var c={},e=Math.max((is_two_handing?Math.ceil(parseInt(a.required_str)/1.5):parseInt(a.required_str))-b.str,0);c.str=b.str+e;d-=e;attack_sources.slice(1).forEach(f=>{e=Math.max(parseInt(a["required_"+f])-b[f],0);c[f]=b[f]+e;d-=e});return 0<=d?c:null}
function beautify_weapon_stats(a,b,d){b=getAttackPower(a,b);var c=attack_types.map(f=>({[f]:parseFloat(a["max_base_"+f+"_attack_power"])})).reduce((f,g)=>Object.assign(f,g),{}),e=Object.entries(b).map(([f,g])=>({[f]:g-c[f]})).reduce((f,g)=>Object.assign(f,g),{});return{name:a.name,base_weapon_name:a.base_weapon_name,affinity:a.affinity,weight:a.weight,weapon_type:a.weapon_type,dual_wieldable:a.dual_wieldable,required_str:a.required_str,required_dex:a.required_dex,required_int:a.required_int,required_fai:a.required_fai,
required_arc:a.required_arc,str_scaling_grade:getScalingGrade(a.max_str_scaling),dex_scaling_grade:getScalingGrade(a.max_dex_scaling),int_scaling_grade:getScalingGrade(a.max_int_scaling),fai_scaling_grade:getScalingGrade(a.max_fai_scaling),arc_scaling_grade:getScalingGrade(a.max_arc_scaling),physical_damage_types:a.physical_damage_types,base_attack_power:Object.entries(c).map(([f,g])=>({[f]:apFormat(g)})).reduce((f,g)=>Object.assign(f,g),{}),bonus_attack_power:Object.entries(e).map(([f,g])=>({[f]:apFormat(g)})).reduce((f,
g)=>Object.assign(f,g),{}),attack_power:Object.entries(b).map(([f,g])=>({[f]:apFormat(g)})).reduce((f,g)=>Object.assign(f,g),{}),scarlet_rot:parseInt(a.max_base_scarlet_rot),madness:parseInt(a.max_base_madness),sleep:parseInt(a.max_base_sleep),frostbite:parseInt(a.max_base_frostbite),poison:parseInt(a.max_base_poison),bleed:parseInt(a.max_base_bleed),damage:Math.floor(d)}}function apFormat(a){return parseInt(a.toFixed(0))}
function getScalingGrade(a){a=parseFloat(a);return 1.75<a?"S":1.4<=a?"A":.9<=a?"B":.6<=a?"C":.25<=a?"D":0<a?"E":"-"}function get_attributes_needed_to_wield(a,b){var d=0+Math.max((is_two_handing?Math.ceil(parseInt(a.required_str)/1.5):parseInt(a.required_str))-b.str,0);for(var c in b.slice(1))d+=Math.max(parseInt(a["required_"+c])-b[c],0);return d}function get_initial_attribute_distribution(a,b){var d={};attack_sources.forEach(c=>{var e=Math.min(99-a[c],b);d[c]=a[c]+e;b-=e});return d}
function get_weapon_attribute_states(a,b){var d={weapon:a,attrs:b};d[Symbol.iterator]=function(){var c=d.attrs[Symbol.iterator]();return{next:function(){var e=c.next();return{done:e.done,value:{weapon:a,attrs:e.value}}}}};return d}function status_update(a){}function print_damage_weapon_attributes(a,b){console.log(a,b.weapon.name,JSON.stringify(b.attrs))}function damage_objective(a){return Object.values(get_damage(a.weapon,a.attrs,enemy,a.weapon.physical_damage_types[0])).reduce((b,d)=>b+d)}
function attr_generator(a){var b=[],d;for(d of attack_sources)for(var c of attack_sources)if(c!=d){var e={str:a.attrs.str,dex:a.attrs.dex,"int":a.attrs["int"],fai:a.attrs.fai,arc:a.attrs.arc};e[d]--;e[c]++;b.push({weapon:a.weapon,attrs:e})}return b}
function get_attr_contraints(a){return[b=>99>=b.attrs.str,b=>99>=b.attrs.dex,b=>99>=b.attrs["int"],b=>99>=b.attrs.fai,b=>99>=b.attrs.arc,b=>b.attrs.str>=a.str,b=>b.attrs.dex>=a.dex,b=>b.attrs["int"]>=a["int"],b=>b.attrs.fai>=a.fai,b=>b.attrs.arc>=a.arc]}function CSPSolver(a,b,d,c){var e=b,f=a(b);do{b=e;e=null;for(var g of d(b))if(c.every(h=>h(g))){var k=a(g);k>f&&(f=k,e=g)}}while(e);return[f,b]}
function brute_solver(a,b){var d=b[Symbol.iterator]().next().value,c=a(d),e;for(e of b)b=a(e),b>c&&(c=b,d=e);return[c,d]}function get_damage(a,b,d,c){a=getAttackPower(a,b);return Object.entries(a).map(([e,f])=>({[e]:getTypeDamage(e,f,c,d)})).reduce((e,f)=>Object.assign(e,f),{})}function getTypeDamage(a,b,d,c){var e=100*parseFloat(c[capitalize(a)+" Defense"]);a=parseFloat("physical"==a?c[capitalize(d)]:c[capitalize(a)]);return DAMAGE_FORMULA(b,e,a)}
function capitalize(a){return a.charAt(0).toUpperCase()+a.slice(1)}function sum(a,b){return a+b}function getAttackPower(a,b){var d={};attack_types.forEach(c=>d[c]=parseFloat(a["max_base_"+c+"_attack_power"])+getMaxBonusAttackPower(a,c,b));return d}function getMaxBonusAttackPower(a,b,d){return attack_sources.every(c=>meetsRequirement(a,b,d,c))?attack_sources.map(c=>getAttackPowerPerSource(a,b,d,c)).reduce((c,e)=>c+e):-.4*parseFloat(a["max_base_"+b+"_attack_power"])}
function meetsRequirement(a,b,d,c){return"str"==c?!canScale(a,b,c)||d[c]>=(is_two_handing?Math.ceil(parseInt(a.required_str)/1.5):parseInt(a.required_str)):!canScale(a,b,c)||d[c]>=parseInt(a["required_"+c])}
function getAttackPowerPerSource(a,b,d,c){if(!canScale(a,b,c))return 0;var e=d[c];is_two_handing&&"str"==c&&(e*=1.5);d=parseFloat(a["max_base_"+b+"_attack_power"]);c=parseFloat(a["max_"+c+"_scaling"]);a=parseInt(a[b+"_damage_calculation_id"]);a=parseFloat(attribute_curves[a](e))/100;return d*c*a}function canScale(a,b,d){return attack_element_scaling[a.attack_element_scaling_id][b+"_"+d+"_element_scaling"]}
function get_attribute_combinations(a,b){for(var d=[],c=a.str;c<=Math.min(99,a.str+b);c++)for(var e=a.dex;e<=Math.min(99,a.dex+b);e++)for(var f=a["int"];f<=Math.min(99,a["int"]+b);f++)for(var g=a.fai;g<=Math.min(99,a.fai+b);g++)for(var k=a.arc;k<=Math.min(99,a.arc+b);k++)c+e+f+g+k==b+get_attack_attribute_sum(a)&&d.push({str:c,dex:e,"int":f,fai:g,arc:k});return d}function get_attack_attribute_sum(a){return a.str+a.dex+a["int"]+a.fai+a.arc};
