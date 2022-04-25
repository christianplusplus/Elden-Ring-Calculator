var resultForm = {
    props: {
        state: String,
        progress: Number,
        result: Object,
        args: Object,
    },
    
    template:`
<errorResultForm v-if="state=='output' && result.error != null"
    :result="result"
/>
<weaponResultForm v-if="state=='output' && result.weapon != null"
    :result="result"
/>
<attributeResultForm v-if="state=='output' && result.attributes != null"
    :result="result"
    :args="args"
/>
<classResultForm v-if="state=='output' && result.class != null"
    :result="result"
    :args="args"
/>
<progressBar v-if="state=='update'"
    :progress="progress"
/>
`,
};