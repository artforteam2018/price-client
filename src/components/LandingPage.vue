<template>
    <v-tabs v-model="active" md4 fixed-tabs>
        <v-tab active key="Receivers">Получатели</v-tab>
        <v-tab>Настройки</v-tab>
        <v-tab-item key="Receivers"
        >
            <v-card flat>
                <Receivers></Receivers>
            </v-card>
        </v-tab-item>
    </v-tabs>
</template>

<script>
    // import SystemInformation from './LandingPage/SystemInformation'
    import Receivers from './LandingPage/Receivers'
    // import console from './LandingPage/console'
    // import config from './LandingPage/config'
    import {mapGetters} from 'vuex'

    export default {
        name: 'LandingPage',
        data() {
            return {
                active: null
            }
        },
        created() {
            this.$store.dispatch('SESSION_CHECK')
                .then(()=>{
                    this.$socket.emit('subscribe', {token: this.getToken});
                    this.sockets.subscribe(this.getToken, (data) => {
                        console.log('ss')
                    });
                    this.$socket.emit("loadTable", {
                        token: this.getToken,
                        username: this.getUsername
                    })
                })
        },
        components: {Receivers},
        computed:
            mapGetters([
                'isAuthenticated',
                'getUsername',
                'getToken'
            ])
    }
</script>
