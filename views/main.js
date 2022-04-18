var Main = {
    data() { 
        return {
            args: {
                vig: 14,
                min: 9,
                end: 12,
                str: 16,
                dex: 9,
                'int': 7,
                fai: 8,
                arc:11,
                floatingPoints:10,
                must_have_required_attributes: false,
                is_two_handing: false,
                is_dual_wieldable: false,
                weapons: {},
                weapon_types: [],
                weapon_types_selected: [],
                affinities: [],
                affinities_selected: [],
                bosses: {},
                enemy: {},
                clazz: {},
                class_stats: {
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
                },
            }
        }
    },
    computed: {
        attack_attributes() { return {
            str: this.args.str,
            dex: this.args.dex,
            'int': this.args.int,
            fai: this.args.fai,
            arc: this.args.arc,
        };}
    },
    methods: {
        load_class() {
            for(var [key, value] of Object.entries(this.get_attack_attributes(this.args.clazz)))
                this.args[key] = value;
        },
        get_attack_attributes(clazz) { return {
            str: clazz.str,
            dex: clazz.dex,
            'int': clazz.int,
            fai: clazz.fai,
            arc: clazz.arc,
        };},
    },
    mounted() {
        this.args.weapons = new Map();
        this.args.bosses = [];
        
        fetch('data/weapons.json')
            .then(response => response.json())
            .then(data => {
                for(var [key, value] of Object.entries(data))
                    this.args.weapons.set(key, value);
                
                var attack_element_scaling_params = new Map();
                fetch('data/flat_attack_element_scaling_params.json')
                    .then(response => response.json())
                    .then(data => {
                        for(var [key, value] of Object.entries(data))
                            attack_element_scaling_params.set(key, value);
                    
                        for(var weapon of this.args.weapons.values()) {
                            for(var [key, value] of Object.entries(attack_element_scaling_params.get(weapon['attack_element_scaling_id']))) {
                                weapon[key] = value;
                            }
                        }
                        
                        this.args.weapon_types = [...new Set(Array.from(this.args.weapons.values()).map(w=>w.weapon_type))];
                        this.args.affinities = [...new Set(Array.from(this.args.weapons.values()).map(w=>w.affinity))];
                    })
            });

        fetch('data/boss_data.json')
            .then(response => response.json())
            .then(data => {
                for(var value of Object.values(data))
                    this.args.bosses.push(value);
                
                var difficulty_data = new Map();
                fetch('data/difficulty_data.json')
                    .then(response => response.json())
                    .then(data => {
                        for(var [key, value] of Object.entries(data))
                            difficulty_data.set(key, value);
                    
                        for(var boss of this.args.bosses.values()) {
                            var id = boss["SpEffect ID"];
                            if(difficulty_data.has(id)) {
                                for(var [key, value] of Object.entries(difficulty_data.get(id))) {
                                    boss[key] = value;
                                }
                            }
                        }
                        
                        this.args.enemy = this.args.bosses.find(b=>b.Name=='Malenia, Blade of Miquella');
                    })
            });
        
        this.args.clazz = this.args.class_stats['hero'];
    },
    template:`
<WeaponAttributesOptimizer
    :args="args"
    :attack_attributes="attack_attributes"
    @load_class="load_class"
/>
`,
};