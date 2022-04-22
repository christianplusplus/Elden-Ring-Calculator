var Main = {
    data() { 
        return {
            args: {
                disabled: false,
                vig: 14,
                min: 9,
                end: 12,
                str: 16,
                dex: 9,
                'int': 7,
                fai: 8,
                arc:11,
                floatingPoints:10,
                must_have_required_attributes: true,
                is_two_handing: false,
                is_dual_wieldable: false,
                weapons: {},
                weapon_types: [],
                weapon_types_selected: [],
                affinities: [],
                affinities_selected: [],
                bosses: {},
                enemy: {},
                attack_element_scaling: {},
                difficulty_scaling: {},
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
            },
            result: {},
            progress: 0,
            output_state: '',
            worker: new Worker('worker.js'),
        }
    },
    computed: {
        attack_attributes() { return {
            str: this.args.str,
            dex: this.args.dex,
            'int': this.args.int,
            fai: this.args.fai,
            arc: this.args.arc,
        };},
        globals() { 
            return {
                must_have_required_attributes: this.args.must_have_required_attributes,
                is_two_handing: this.args.is_two_handing,
                enemy: Object.assign({}, this.args.enemy, this.args.difficulty_scaling[this.args.enemy['SpEffect ID']]),
                weapons: this.args.weapons,
                attack_element_scaling: this.args.attack_element_scaling,
            };
        },
    },
    methods: {
        load_class() {
            for(var [key, value] of Object.entries(this.args.clazz))
                this.args[key] = value;
        },
        get_attack_attributes(clazz) { return {
            str: clazz.str,
            dex: clazz.dex,
            'int': clazz.int,
            fai: clazz.fai,
            arc: clazz.arc,
        };},
        run(runnable, ...args) {
            this.setup();
            this.async(runnable, this.update, this.print, args);
        },
        async(runnable, update, callback, args) {
            this.worker.onmessage = function(e) {
                if(e.data.header == 'result' && callback && callback instanceof Function)
                    callback(e.data.result);
                else if(e.data.header == 'update' && update && update instanceof Function)
                    update(e.data.progress);
            };
            this.worker.postMessage({
                runnable: runnable.name,
                args: JSON.stringify(args),
                globals: JSON.stringify(this.globals),
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
            this.output_state = 'output';
        },
    },
    mounted() {
        fetch('data/weapons.json')
            .then(response => response.json())
            .then(data => {
                this.args.weapons = data;
                this.args.weapon_types = [...new Set(this.args.weapons.map(w=>w.weapon_type))];
                this.args.affinities = [...new Set(this.args.weapons.map(w=>w.affinity))];
            });

        fetch('data/attack_element_scaling.json')
            .then(response => response.json())
            .then(data => {
                this.args.attack_element_scaling = data;
            });
        
        fetch('data/boss_data.json')
            .then(response => response.json())
            .then(data => {
                this.args.bosses = data;
                this.args.enemy = this.args.bosses.find(b=>b.Name=='Malenia, Blade of Miquella');
            });
            
        fetch('data/difficulty_scaling.json')
            .then(response => response.json())
            .then(data => {
                this.args.difficulty_scaling = data;
            });
        
        this.args.clazz = this.args.class_stats['hero'];
    },
    template:`
<WeaponAttributesForm
    :args="args"
    :attack_attributes="attack_attributes"
    @run="run"
    @load_class="load_class"
/>
<resultForm
    :args="args"
    :result="result"
    :progress="progress"
    :state="output_state"
/>
`,
};