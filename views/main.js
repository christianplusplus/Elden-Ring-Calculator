var Main = {
    data() { 
        return {
            args: {
                disabled: false,
                attributes: {},
                floatingPoints:10,
                target_level: 150,
                optimize_class: true,
                optimize_weapon: true,
                optimize_attributes: true,
                weapon: {},
                weapons: [],
                weapon_types: [],
                weapon_types_selected: [],
                affinities: [],
                affinities_selected: [],
                ammo_types: [],
                ammo_types_selected: [],
                modifiers: [],
                options: {
                    must_have_required_attributes: true,
                    is_dual_wieldable: false,
                },
                movesets: {
                    normal: {
                        display_name: 'Normal',
                        modifiers: {
                            light:{is_two_handable: true, has_multiple_inputs: true},
                            heavy:{is_two_handable: true, has_multiple_inputs: true},
                            charged:{is_two_handable: true, has_multiple_inputs: true},
                            offhand:{is_two_handable: false, has_multiple_inputs: true},
                            paired:{is_two_handable: false, has_multiple_inputs: true},
                        }
                    },
                    running: {
                        display_name: 'Running',
                        modifiers: {
                            light:{is_two_handable: true, has_multiple_inputs: false},
                            heavy:{is_two_handable: true, has_multiple_inputs: false},
                            paired:{is_two_handable: false, has_multiple_inputs: false},
                        }
                    },
                    rolling: {
                        display_name: 'Rolling',
                        modifiers: {
                            light:{is_two_handable: true, has_multiple_inputs: false},
                            paired:{is_two_handable: false, has_multiple_inputs: false},
                        }
                    },
                    jumping: {
                        display_name: 'Jumping',
                        modifiers: {
                            light:{is_two_handable: true, has_multiple_inputs: false},
                            heavy:{is_two_handable: true, has_multiple_inputs: false},
                            paired:{is_two_handable: false, has_multiple_inputs: false},
                        }
                    },
                    chargefeint: {
                        display_name: 'Charge Feint',
                        is_two_handable: true,
                        has_multiple_inputs: false,
                    },
                    chargedchargefeint: {
                        display_name: '2nd Charge Feint',
                        is_two_handable: true,
                        has_multiple_inputs: true,
                    },
                    backstep: {
                        display_name: 'Backstep',
                        modifiers: {
                            light:{is_two_handable: true, has_multiple_inputs: false},
                            paired:{is_two_handable: false, has_multiple_inputs: false},
                        }
                    },
                    guardcounter: {
                        display_name: 'Guard Counter',
                        is_two_handable: true,
                        has_multiple_inputs: false,
                    },
                    mounted: {
                        display_name: 'Mounted',
                        modifiers: {
                            light:{is_two_handable: false, has_multiple_inputs: true},
                            heavy:{is_two_handable: false, has_multiple_inputs: false},
                            charging:{is_two_handable: false, has_multiple_inputs: false},
                            charged:{is_two_handable: false, has_multiple_inputs: false},
                        }
                    },
                    backstab: {
                        display_name: 'Backstab',
                        is_two_handable: false,
                        has_multiple_inputs: false,
                    },
                    riposte: {
                        display_name: 'Riposte',
                        is_two_handable: false,
                        has_multiple_inputs: false
                    },
                    shieldpoke: {
                        display_name: 'Shield Poke',
                        is_two_handable: false,
                        has_multiple_inputs: false
                    },
                },
                aggregates: [
                    'first',
                    'last',
                    'total',
                    'average',
                ],
                moveset_aggregate: 'first',
                moveset_category: 'normal',
                moveset_modifier: 'light',
                is_two_handing: false,
                hit_aggregate: 'last',
                bosses: {},
                enemy: {},
                attack_element_scaling: {},
                weapon_base_attacks: {},
                weapon_source_scaling: {},
                weapon_passives: {},
                difficulty_scaling: {},
                upgrade_level: 0,
                upgrade_cap: 25,
                somber_upgrade_cap: 10,
                motion_values: {},
                ready_to_tweak: false,
                clazz: {},
                class_stats: {
                    hero: {'vig':14,'min':9,'end':12,'str':16,'dex':9,'int':7,'fai':8,'arc':11},
                    bandit: {'vig':10,'min':11,'end':10,'str':9,'dex':13,'int':9,'fai':8,'arc':14},
                    astrologer: {'vig':9,'min':15,'end':9,'str':8,'dex':12,'int':16,'fai':7,'arc':9},
                    warrior: {'vig':11,'min':12,'end':11,'str':10,'dex':16,'int':10,'fai':8,'arc':9},
                    prisoner: {'vig':11,'min':12,'end':11,'str':11,'dex':14,'int':14,'fai':6,'arc':9},
                    confessor: {'vig':10,'min':13,'end':10,'str':12,'dex':12,'int':9,'fai':14,'arc':9},
                    wretch: {'vig':10,'min':10,'end':10,'str':10,'dex':10,'int':10,'fai':10,'arc':10},
                    vagabond: {'vig':15,'min':10,'end':11,'str':14,'dex':13,'int':9,'fai':9,'arc':7},
                    prophet: {'vig':10,'min':14,'end':8,'str':11,'dex':10,'int':7,'fai':16,'arc':10},
                    samurai: {'vig':12,'min':11,'end':13,'str':12,'dex':15,'int':9,'fai':8,'arc':8},
                },
                attack_types: [
                    'physical',
                    'magic',
                    'fire',
                    'lightning',
                    'holy',
                ],
                attack_sources: [
                    'str',
                    'dex',
                    'int',
                    'fai',
                    'arc',
                ],
            },
            result: {},
            progress: 0,
            output_state: '',
            worker: new Worker('worker.js'),
        }
    },
    computed: {
        attack_attributes() { return {
            'str': this.args.attributes.str,
            'dex': this.args.attributes.dex,
            'int': this.args.attributes.int,
            'fai': this.args.attributes.fai,
            'arc': this.args.attributes.arc,
        };},
    },
    methods: {
        load_class() {
            for(var [key, value] of Object.entries(this.args.clazz))
                this.args.attributes[key] = value;
        },
        blank_slate() {
            this.args.attributes.vig = 50;
            this.args.attributes.min = 1;
            this.args.attributes.end = 20;
            this.args.attributes.str = 1;
            this.args.attributes.dex = 1;
            this.args.attributes.int = 1;
            this.args.attributes.fai = 1;
            this.args.attributes.arc = 1;
        },
        quick_run(runnable, ...args) {
            this.result = self[runnable](...args);
            this.output_state = 'output';
        },
        run(runnable, ...args) {
            this.setup();
            this.async(runnable, this.update, this.print, args);
        },
        async(runnable, update, callback, args, predicates) {
            this.worker.onmessage = function(e) {
                if(e.data.header == 'result' && callback && callback instanceof Function)
                    callback(e.data.result);
                else if(e.data.header == 'update' && update && update instanceof Function)
                    update(e.data.progress);
            };
            
            this.worker.postMessage({
                runnable: runnable,
                args: JSON.stringify(args),
            });
        },
        setup() {
            this.args.disabled = true;
            this.output_state = '';
        },
        update(progress) {
            this.progress = progress;
            this.output_state = 'update';
        },
        print(output) {
            this.args.disabled = false;
            this.result = output;
            this.args.ready_to_tweak = true;
            this.output_state = 'output';
        },
    },
    mounted() {
        fetch('data/weapons.json')
            .then(response => response.json())
            .then(data => {
                this.args.weapons = Object.values(data);
                this.args.weapon_types = [...new Set(this.args.weapons.map(w=>w.weapon_type))];
                this.args.ammo_types = [...new Set(this.args.weapons.map(w=>w.ammo))];
                this.args.affinities = [...new Set(this.args.weapons.map(w=>w.affinity))];
            });

        fetch('data/attack_element_scaling.json')
            .then(response => response.json())
            .then(data => {
                this.args.attack_element_scaling = data;
            });
            
        fetch('data/weapon_base_attacks.json')
            .then(response => response.json())
            .then(data => {
                this.args.weapon_base_attacks = data;
            });
            
        fetch('data/weapon_source_scaling.json')
            .then(response => response.json())
            .then(data => {
                this.args.weapon_source_scaling = data;
            });
        
        fetch('data/weapon_passives.json')
            .then(response => response.json())
            .then(data => {
                this.args.weapon_passives = data;
            });
        
        fetch('data/boss_data.json')
            .then(response => response.json())
            .then(data => {
                this.args.bosses = data.sort((a,b)=>a.Name<b.Name?-1:a.Name>b.Name?1:0);
                this.args.enemy = this.args.bosses.find(b=>b.Name=='Target Dummy (No Resistances, Weaknesses, or Difficulty Scaling)');
            });
            
        fetch('data/difficulty_scaling.json')
            .then(response => response.json())
            .then(data => {
                this.args.difficulty_scaling = data;
            });
        
        fetch('data/motion_values.json')
            .then(response => response.json())
            .then(data => {
                this.args.motion_values = data;
            });
        
        this.blank_slate();
    },
    template:`
<!--
<div class="elden_sheet sidebar" id="navigation">
    <ul>
        <li><a :style="input_state=='class_weapon_attribute'?{color: 'RoyalBlue'}:{}" @click="input_state='class_weapon_attribute'">Class/Weapon/Attributes Optimizer</a></li>
        <li><a :style="input_state=='weapon_attribute'?{color: 'RoyalBlue'}:{}" @click="input_state='weapon_attribute'">Weapon/Attributes Optimizer</a></li>
        <li><a :style="input_state=='damage_calc'?{color: 'RoyalBlue'}:{}" @click="input_state='damage_calc'">Damage Calculator</a></li>
    </ul>
</div>
-->
<div class="filler"></div>
<div id="content">
    <inputForm
        :args="args"
        @run="run"
        @quick_run="quick_run"
        @load_class="load_class"
        @blank_slate="blank_slate"
    />
    <resultForm
        :args="args"
        :result="result"
        :progress="progress"
        :state="output_state"
    />
    <div class="filler"></div>
</div>
<!--
<div class="elden_sheet sidebar">
</div>
-->
<div class="filler"></div>
`,
};
