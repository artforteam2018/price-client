<template>

    <div class="justify-center vh-100">
        <Auth v-if="!isAuthenticated"></Auth>
        <v-layout fill-height v-if="isAuthenticated">
            <v-flex>
                <LandingPage></LandingPage>
            </v-flex>
        </v-layout>
    </div>
</template>


<script>

    // import Intro from './components/Intro.vue';
    // import Current from './components/Current.vue';
    import {mapGetters} from 'vuex'
    import Auth from './components/Auth';
    import LandingPage from './components/LandingPage.vue';

    export default {
        name: 'app',
        components: {LandingPage, Auth},//{Auth, Intro, Current},
        // data() {
        //     return {
        //         active: null,
        //         text: ""
        //     }
        // },
        // methods: {},
        // socket: {
        //     events: {
        //         change(msg) {
        //             this.text = msg
        //         }
        //     }
        // },
        computed:
            mapGetters([
                'isAuthenticated',
                'getUsername',
                'getToken'
            ])
    }
</script>

<style>
    @import "./styles/main.css";
    @import '~vuetify/dist/vuetify.min.css';
    /*@import url('https://fonts.googleapis.com/css?family=Lato');*/


    @font-face {
        font-family: "IbmPlexSansThin";
        src: url("/static/font/ibmplexsans/IBMPlexSans-Thin.ttf") format("opentype");
    }

    @font-face {
        font-family: "IbmPlexSansRegular";
        src: url("/static/font/ibmplexsans/IBMPlexSans-Regular.ttf") format("opentype");
    }

    * {
        margin: 0;
        padding: 0;
        font-family: 'IbmPlexSansRegular', sans-serif;
    }

    .logo {
        font-family: 'IbmPlexSansThin', sans-serif !important;
    }
</style>
