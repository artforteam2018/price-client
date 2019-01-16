<template>
    <v-layout class="overflow-h ">

        <v-flex v-if="(!mobileShow || showUsers)" class="overflow-h" md4 lg2 xs12>

            <UserList @clearEvents="clearEvents" class="overflow-h"></UserList>

        </v-flex>

        <v-layout v-if="(!mobileShow || !showUsers)" class="overflow-h" fill-height column>
            <v-layout align-space-between column justify-space-between dark
                      :style="{ background: 'linear-gradient(45deg, '   + style.colors[0] + ' ' + style.percents[0] + '%, ' +
                                                                  style.colors[1] + ' ' + style.percents[1] + '%, ' +
                                                                  style.colors[2] + ' ' + style.percents[2] + '%, ' +
                                                                  style.colors[3] + ' ' + style.percents[3] + '%, ' +
                                                                  style.colors[4] + ' ' + style.percents[4] + '%, ' +
                                                                  style.colors[5] + ' ' + style.percents[5] + '%, ' +
                                                                  style.colors[6] + ' ' + style.percents[6] + '%, ' +
                                                                  style.colors[7] + ' ' + style.percents[7] + '%, ' +
                                                                  style.colors[8] + ' ' + style.percents[8] + '%)'}">
                <v-btn v-if="mobileShow" @click="showUsers = !showUsers" fab color="white" small>
                    <v-icon>format_list_bulleted</v-icon>
                </v-btn>
                <v-layout class="overflow align-start" column reverse>
                    <div class="teal lighten-5 mx-4 my-2 borders borders-radius-3" v-for="event in events"
                         :key="event.date">

                        <v-slide-x-transition>
                            <v-slide-x-transition>
                                <v-flex class="px-2 py-2">
                                    <v-layout row justify-space-between>
                                        <div class="text-teal body-2" style="min-width: 5vw">{{
                                            event.user}}
                                        </div>
                                        <div class="text-teal text-md-right body-2 ml-2" style="min-width: 5vw">
                                            {{new Date(event.date).getHours() + ":" + new
                                            Date(event.date).getMinutes()}}
                                        </div>
                                    </v-layout>
                                    <div class="pre body-1">{{event.text}}</div>
                                </v-flex>
                            </v-slide-x-transition>
                        </v-slide-x-transition>

                    </div>
                </v-layout>
            </v-layout>

            <v-card>
                <v-avatar color="teal lighten-3">
                    <img src="https://vuetifyjs.com/apple-touch-icon-180x180.png" alt="avatar">
                </v-avatar>
                <span class="subheading ml-2" v-text="getUsername2"></span>
                <v-textarea auto-grow rows="1" v-model="input" hide-details flat label="Сообщение..." solo>
                    <template slot="append">
                        <v-btn class="mx-2 mb-2 borders-radius-3 borders teal lighten-4" depressed @click="comment">
                            Отправить
                        </v-btn>
                    </template>
                </v-textarea>
            </v-card>

        </v-layout>
    </v-layout>
</template>

<script>
    import UserList from './UserList'
    import {hideAt, showAt} from 'vue-breakpoints'



    export default {
        data: () => ({
            events: [],
            input: null,
            nonce: 0,
            style: {
                colors: [],
                percents: [0, 25.5, 42.5, 49, 62, 68, 75, 86, 100]
            },
            showUsers: true
        }),
        components: {UserList, hideAt, showAt},
        computed: {
            getUsername() {
                return this.$store.getters.getUsername
            },
            getUsername2() {
                return this.$store.getters.getUsername2
            },
            getToken() {
                return this.$store.getters.getToken
            },
            mobileShow() {
                return this.$vuetify.breakpoint.xs
            }
        },

        methods: {
            clearEvents() {
                this.events = [];
                this.showUsers = false;
            },
            comment() {
                this.$socket.emit("newMessage", {
                    text: this.input,
                    date: Date.now(),
                    username: this.getUsername,
                    username2: this.getUsername2,
                    token: this.getToken
                })

                this.input = ''
            }
        },
        sockets: {
            newMessage(msg) {
                if ((msg.user === this.getUsername2 && msg.user2 === this.getUsername) || (msg.user === this.getUsername && msg.user2 === this.getUsername2)) {
                    if (this.events.filter(event => event.date === msg.date).length === 0) {
                        this.events.unshift({
                            text: msg.text,
                            date: msg.date,
                            user: msg.user
                        })
                    }
                }
            }
        },
        created() {
            this.$socket.emit('subscribe', {token: this.getToken})
            this.sockets.subscribe(this.getToken, (data) => {
            });
            for (let i = 0; i < this.style.percents.length; i++) {
                let g = parseInt(154 + Math.random() * 50).toString(16)
                let b = parseInt(117 + Math.random() * 50).toString(16)
                let newColor = '#01' + g + b
                this.style.colors.push(newColor)
            }
            setInterval(() => {
                for (let i = 0; i < this.style.percents.length; i++) {
                    if (this.style.percents[i] + 0.01 > 100 && i + 1 !== this.style.percents.length) {
                        let num = this.style.percents[this.style.percents.length - 2] - 100;
                        this.style.percents.pop();
                        this.style.percents.unshift(num)
                        let g = parseInt(154 + Math.random() * 50).toString(16)
                        let b = parseInt(117 + Math.random() * 50).toString(16)
                        let newColor = '#01' + g + b
                        this.style.colors.unshift(newColor)
                        this.style.colors.pop();
                    } else {
                        this.$set(this.style.percents, i, this.style.percents[i] + 0.01)
                    }

                }
            }, 10)
        }
    }
</script>
