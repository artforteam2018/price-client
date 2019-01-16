<template>

    <v-card class="vh-100 overflow-x-hidden">
        <v-layout column justify-space-between fill-height>
            <v-list two-line>
                <v-text-field box class="mx-2" @input="searchUser" append-icon="search"></v-text-field>

                <template v-for="(item) in items">
                    <v-subheader
                        v-if="item.header"
                        :key="item.header"
                    >
                        {{ item.header }}
                    </v-subheader>


                    <v-list-tile v-for="dialog in item.body" :key="dialog.title" avatar @click="loadDialog(dialog)">
                        <v-list-tile-avatar>
                            <img :src="dialog.avatar">
                        </v-list-tile-avatar>


                        <v-list-tile-content>
                            <v-list-tile-title v-html="dialog.title"></v-list-tile-title>
                            <v-list-tile-sub-title v-html="dialog.subtitle"></v-list-tile-sub-title>
                        </v-list-tile-content>

                    </v-list-tile>
                </template>
            </v-list>
            <v-layout row justify-space-between>
                <v-btn @click="logout" block class="align-self-end teal lighten-4 borders borders-radius-3">Выйти
                </v-btn>
                <v-btn @click="dialogue=true" fab small class="py-custom align-self-end teal lighten-4">
                    <v-icon>settings</v-icon>
                </v-btn>
            </v-layout>
        </v-layout>
        <!--<v-dialog v-model="dialogue" fullscreen hide-overlay transition="dialog-bottom-transition">-->
            <!--<v-card>-->
                <!--<v-toolbar dark color="primary">-->
                    <!--<v-btn icon dark @click="dialogue = false">-->
                        <!--<v-icon>close</v-icon>-->
                    <!--</v-btn>-->
                    <!--<v-toolbar-title>Настройки</v-toolbar-title>-->
                <!--</v-toolbar>-->
                <!--<v-layout align-center justify-center fill-height column subheader>-->
                    <!--<v-layout column fill-height justify-center>-->
                    <!--<v-flex layout md4 class="mb-4">-->
                    <!--<v-subheader>Логин:</v-subheader>-->
                            <!--<v-text-field  counter="20" v-model="settings.username"-->
                                           <!--type="text">-->
                            <!--</v-text-field>-->
                    <!--</v-flex>-->
                    <!--<v-flex layout>-->
                        <!--<v-subheader>Аватар:</v-subheader>-->
                        <!--<v-avatar-->
                            <!--self-align-center-->
                            <!--tile-->
                            <!--size="156px"-->
                            <!--color="grey lighten-4"-->
                        <!--&gt;<img src="https://vuetifyjs.com/apple-touch-icon-180x180.png" alt="avatar"></v-avatar>-->
                    <!--</v-flex>-->
                    <!--</v-layout>-->

                    <!--<v-btn @click="dialogue = false">Сохранить</v-btn>-->
                <!--</v-layout>-->
            <!--</v-card>-->
        <!--</v-dialog>-->
    </v-card>
</template>

<script>
    import {mapGetters} from 'vuex'

    export default {
        data() {
            return {
                items: this.items = [
                    {
                        header: 'Результаты поиска',
                        body: []
                    },
                    {
                        header: 'Сегодня',
                        body: []
                    }
                ],
                dialogue: false,
                settings:{
                    user: ''
                }
            }
        },
        sockets: {
            newMessage(msg) {
                for (let i = 1; i < this.items.length; i++) {
                    let tab = this.items[i].body.filter(tab => (tab.title === msg.user2 && this.getUsername === msg.user) || (tab.title === msg.user && this.getUsername2 === msg.user));
                    if (tab.length > 0) {
                        tab[0].subtitle = msg.text;
                    }
                }
            }
        },
        methods: {
            logout() {
                this.$store.dispatch('AUTH_LOGOUT')
            },
            searchUser(evt) {
                this.$store.dispatch('SEARCH_USER', {user: evt})
                    .then(result => {
                        console.log(result)
                        this.items[0].body = [];
                        result.data.data.forEach(user => {
                            this.items[0].body.push({
                                avatar: null,
                                title: user.username,
                                subtitle: '<span class=\'text--primary\'></span>'
                            })
                        });
                    })
            },
            loadDialog(dialog) {
                this.$emit('clearEvents');
                this.$store.dispatch('SET_USERNAME2', {user: dialog.title})
                    .then(() => {
                        this.$socket.emit("chatOpened", {
                            token: this.getToken,
                            username: this.getUsername,
                            username2: this.getUsername2
                        })
                    })
            }
        },
        computed:
            mapGetters([
                'getUsername',
                'getUsername2',
                'getToken'
            ]),
        created() {
            this.$store.dispatch('GET_DIALOGS').then(result => {
                result.data.rows.forEach(dialog => {
                    if (new Date(dialog.date) > new Date().setHours(0, 0, 0, 0)) {
                        let item = this.items.filter(elem => elem.header === 'Сегодня')[0];
                        item.body.push(
                            {
                                avatar: null,
                                title: dialog.user2,
                                subtitle: dialog.text
                            }
                        )
                    }
                })
            })
        }
    }
</script>
