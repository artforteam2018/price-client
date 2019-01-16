<template>
    <header class="hero">
        <h2>{{getUsername}}</h2>
        <v-btn @click="logout">Выйти</v-btn>
    </header>
</template>

<script>
    import {mapGetters} from 'vuex'

    export default {
        name: 'app',
        props: ["text"],
        data() {
            return {
                texto: ""
            }
        },
        methods: {
            logout() {
                this.$store.dispatch('AUTH_LOGOUT')
            },
            change(evt) {
                //this.$socket.emit("change", {value: evt.target.value});
            }
        }
    }</script>


