<template>
    <div>
        <v-tabs v-model="active" md4 fixed-tabs>
            <v-tab active key="rules">Получатели</v-tab>
            <v-tab @click="getSettings" key="opts">Настройки</v-tab>
            <v-tab-item key="rules">
                <rules></rules>
            </v-tab-item>
            <v-tab-item key="opts">
                <v-dialog v-model="alertDialog" width="500">
                    <v-card>
                        <v-card-title class="headline grey lighten-2" primary-title>Уведомление от сервера</v-card-title>
                        <v-card-text>Изменения успешно внесены!</v-card-text>
                    </v-card>
                </v-dialog>
                <settings @save="saveSettings" :settings="settings"></settings>
            </v-tab-item>
        </v-tabs>
    </div>
</template>

<script>
    import settings from './LandingPage/settings'
    import rules from './LandingPage/rules'
    // import console from './LandingPage/console'
    // import config from './LandingPage/config'
    import {mapGetters} from 'vuex'

    export default {
        name: 'LandingPage',
        data() {
            return {
                active: null,
                settings: {},
                alertDialog: false
            }
        },
        created() {
            this.$store.dispatch('SESSION_CHECK')
                .then(() => {
                    this.$socket.emit('subscribe', {token: this.getToken});
                    this.sockets.subscribe(this.getToken, () => {

                    });
                    this.$socket.emit("loadTable", {
                        token: this.getToken,
                        username: this.getUsername
                    })
                })
        },
        methods: {
            getSettings(){
                this.$store.dispatch('GET_SETTINGS')
                    .then(result => {
                        this.settings = {};
                        result.data.forEach(res => {
                           if (this.settings[res.folder] === undefined) {
                               this.$set(this.settings, res.folder, []);
                           }
                           this.settings[res.folder].push({name: res.name, param: res.param, hint: res.hint})
                        });
                    })
            },
            saveSettings(evt){
                this.$store.dispatch('CHANGE_SETTINGS', {data: evt})
                    .then(() => {
                        this.alertDialog = true;
                        this.active = 0;
                    })
            }
        },
        components: {rules, settings},
        computed:
            mapGetters([
                'isAuthenticated',
                'getUsername',
                'getToken'
            ])
    }
</script>
