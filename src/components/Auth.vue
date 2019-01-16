<template>
    <div>
        <v-form class="login vh-100" ref="form">
            <v-layout justify-center align-center fill-height>
                <v-flex xs8 md4 class="mb-5">
                    <v-layout justify-center>
                    <v-avatar :size="mobileShow ? '156px' : '212px'" class="mb-2" color="teal lighten-3">
                        <img src="static/img/icons/android-chrome-512x512.png" alt="avatar">
                    </v-avatar>
                    </v-layout>
                    <div class="display-2 logo text-md-center text-xs-center">PA PRICES</div>
                    <v-text-field @keypress.enter="login"
                                  label="Имя пользователя"
                                  counter="20"
                                  :error-messages="usernameErrors" required v-model="username"
                                  type="text">
                    </v-text-field>
                    <v-text-field @keypress.enter="login"
                                  :append-icon="show3 ? 'visibility_off' : 'visibility'"
                                  :type="show3 ? 'text' : 'password'"
                                  label="Пароль"
                                  v-model="password"
                                  :error-messages="passwordErrors"
                                  @click:append="show3 = !show3"
                    ></v-text-field>
                    <v-layout  :class="mobileShow ? 'justify-space-between' : 'justify-end'">
                        <v-btn type="button" class="teal lighten-3 ml-0" @click="login">Вход</v-btn>
                        <v-btn type="button" class="teal lighten-3 mr-0" @click="register">Регистрация</v-btn>
                    </v-layout>
                </v-flex>
            </v-layout>
        </v-form>
    </div>
</template>

<script>
    import {validationMixin} from 'vuelidate'
    import {required, maxLength, minLength} from 'vuelidate/lib/validators'

    export default {
        mixins: [validationMixin],
        computed: {
            usernameErrors() {
                const errors = [];
                if (!this.$v.username.$dirty) return errors;
                !this.$v.username.maxLength && errors.push('Имя не должно быть длиннее 20 знаков');
                !this.$v.username.required && errors.push('Не заполнено');
                return errors
            },
            passwordErrors() {
                const errors = [];
                if (!this.$v.password.$dirty) return errors;
                !this.$v.password.minLength && errors.push('Пароль не должен быть меньше 8 знаков');
                !this.$v.password.required && errors.push('Не заполнено');
                return errors
            },
            mobileShow() {
                return this.$vuetify.breakpoint.xs
            }
        },
        validations: {
            username: {required, maxLength: maxLength(20)},
            password: {required, minLength: minLength(8)},
        },
        name: "Auth",
        data() {
            return {
                show3: false,
                rules: {
                    required: value => !!value || 'Не заполнено',
                    min: v => v.length >= 8 || 'Больше 8 знаков',
                },
                username: '',
                password: '',
                sha256: require('sha256')
            }
        },
        methods: {
            login() {
                this.$v.$touch();
                if (!this.$v.$error) {
                    let username = this.username;
                    let password = this.sha256(this.password);
                    this.$store.dispatch('AUTH_REQUEST', {username, password}).then(() => {
                    })
                }
            },
            register() {
                this.$v.$touch();
                if (!this.$v.$error) {
                    let username = this.username;
                    let password = this.sha256(this.password);
                    this.$store.dispatch('REGISTER_REQUEST', {username, password}).then(result => {
                        if (result.data.success) {
                            this.login()
                        } else {
                            //todo reglint
                        }
                    })
                }
            }
        }
    }
</script>

<style scoped>

</style>
