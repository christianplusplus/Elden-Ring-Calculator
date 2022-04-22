var resultForm = {
    props: {
        state: String,
        progress: Number,
        result: Object,
        args: Object,
    },
    
    template:`
<weaponResultForm v-if="state=='output'"
    :result="result"
/>
<attributeResultForm v-if="state=='output'"
    :result="result"
    :args="args"
/>
<progressBar v-if="state=='update'"
    :progress="progress"
/>
`,
};