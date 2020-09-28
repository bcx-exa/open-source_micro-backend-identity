<template>
    <div id="app">
       {{myVar}} {{myVar2}}
    </div>
</template>

<script>
    import axios from 'axios';

    export default {
        name: 'Example',
        data() {
            return {
                myVar: 'Hello',
                myVar2: '',
                asyncExample: ''
            };
        },
        metaInfo: {
            title: 'Default Title',
            titleTemplate: '%s | My Awesome Website',
            meta: [
                { charset: 'utf-8' },
                { name: 'viewport', content: 'width=device-width, initial-scale=1' }
            ]
        },
        created() {
            this.myVar2 = example;
        },
        methods: {},
        computed: {},
        components: {}
    }
</script>

<style lang="scss">
    body {
        #app {
            font-size: 16px;
            font-weight: bold;
        }
    }
</style>