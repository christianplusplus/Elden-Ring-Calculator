var Main = {
    data() { 
        return {
            args: {
                disabled: false,
                attributes: {},
                floatingPoints:10,
                target_level: 150,
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
                    hero : {'vig':14,'min':9,'end':12,'str':16,'dex':9,'int':7,'fai':8,'arc':11},
                    bandit : {'vig':10,'min':11,'end':10,'str':9,'dex':13,'int':9,'fai':8,'arc':14},
                    astrologer : {'vig':9,'min':15,'end':9,'str':8,'dex':12,'int':16,'fai':7,'arc':9},
                    warrior : {'vig':11,'min':12,'end':11,'str':10,'dex':16,'int':10,'fai':8,'arc':9},
                    prisoner : {'vig':11,'min':12,'end':11,'str':11,'dex':14,'int':14,'fai':6,'arc':9},
                    confessor : {'vig':10,'min':13,'end':10,'str':12,'dex':12,'int':9,'fai':14,'arc':9},
                    wretch : {'vig':10,'min':10,'end':10,'str':10,'dex':10,'int':10,'fai':10,'arc':10},
                    vagabond : {'vig':15,'min':10,'end':11,'str':14,'dex':13,'int':9,'fai':9,'arc':7},
                    prophet : {'vig':10,'min':14,'end':8,'str':11,'dex':10,'int':7,'fai':16,'arc':10},
                    samurai : {'vig':12,'min':11,'end':13,'str':12,'dex':15,'int':9,'fai':8,'arc':8},
                },
            },
            result: {},
            progress: 0,
            input_state: 'weapon_attribute',
            output_state: '',
            worker: new Worker('worker.js'),
        }
    },
    computed: {
        attack_attributes() { return {
            str: this.args.attributes.str,
            dex: this.args.attributes.dex,
            'int': this.args.attributes.int,
            fai: this.args.attributes.fai,
            arc: this.args.attributes.arc,
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
                this.args.attributes[key] = value;
        },
        get_attack_attributes(clazz) { return {
            str: clazz.str,
            dex: clazz.dex,
            'int': clazz.int,
            fai: clazz.fai,
            arc: clazz.arc,
        };},
        quick_run(runnable, ...args) {
            for(var [key, value] of Object.entries(this.globals))
                window[key] = value;
            this.result = runnable(...args);
            this.output_state = 'output';
        },
        run(runnable, ...args) {
            this.setup();
            this.async(runnable, this.update, this.print, args);
        },
        run_with_predicates(runnable, predicates, ...args) {
            this.setup();
            this.async(runnable, this.update, this.print, args, predicates);
        },
        async(runnable, update, callback, args, predicates) {
            this.worker.onmessage = function(e) {
                if(e.data.header == 'result' && callback && callback instanceof Function)
                    callback(e.data.result);
                else if(e.data.header == 'update' && update && update instanceof Function)
                    update(e.data.progress);
            };
            
            this.worker.postMessage({
                runnable: runnable.name,
                args: JSON.stringify(args),
                predicates: predicates,
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
        this.load_class();
    },
    template:`
<div class="elden_sheet" id="navigation">
    <ul>
        <li><a :style="input_state=='class_weapon_attribute'?{color: 'RoyalBlue'}:{}" @click="input_state='class_weapon_attribute'">Class/Weapon/Attributes Optimizer</a></li>
        <li><a :style="input_state=='weapon_attribute'?{color: 'RoyalBlue'}:{}" @click="input_state='weapon_attribute'">Weapon/Attributes Optimizer</a></li>
        <li><a :style="input_state=='damage_calc'?{color: 'RoyalBlue'}:{}" @click="input_state='damage_calc'">Damage Calculator</a></li>
    </ul>
</div>
<div id="content">
    <inputForm
    :args="args"
    :result="result"
    :attack_attributes="attack_attributes"
    :state="input_state"
    @run="run"
    @quick_run="quick_run"
    @run_with_predicates="run_with_predicates"
    @load_class="load_class"
    />
    <resultForm
        :args="args"
        :result="result"
        :progress="progress"
        :state="output_state"
    />
</div>
<div class="elden_sheet ad" id="side-ad">
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3997865404309179"
         crossorigin="anonymous"></script>
    <!-- side-bar-ad -->
    <ins class="adsbygoogle"
         style="display:inline-block;width:130px;height:400px"
         data-ad-client="ca-pub-3997865404309179"
         data-ad-slot="3269106063"></ins>
    <script>
         (adsbygoogle = window.adsbygoogle || []).push({});
    </script>
</div>
`,
};
