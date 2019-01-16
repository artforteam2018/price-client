<template>
    <div>
        <v-menu :close-on-content-click="false" attach offset-x>
            <v-btn small slot="activator">{{intervalStr}}</v-btn>

            <v-card class="px-4">
                <v-tabs v-model="active" fixed-tabs>
                    <v-tab key="1">Интервал</v-tab>
                    <v-tab key="2">По времени</v-tab>
                </v-tabs>
                <v-tabs-items v-model="active">
                    <v-tab-item key="1">
                        <v-list>
                            <v-flex class="mx-2" layout row>
                                <div class="align-self-center px-2 py-2 body-2">Дни:</div>
                                <v-text-field type="number" class="text-right" hide-details flat solo
                                              v-model="intervals[0].days"></v-text-field>
                            </v-flex>
                            <v-divider></v-divider>
                            <v-flex class="mx-2" layout row>
                                <div class="align-self-center px-2 py-2 body-2">Часы:</div>
                                <v-text-field type="number" class="text-right" hide-details flat solo
                                              v-model="intervals[0].hours"></v-text-field>
                            </v-flex>
                            <v-divider></v-divider>
                            <v-flex class="mx-2" layout row>
                                <div class="align-self-center px-2 py-2 body-2">Минуты:</div>
                                <v-text-field type="number" class="text-right" hide-details flat solo
                                              v-model="intervals[0].minutes"></v-text-field>
                            </v-flex>
                        </v-list>
                    </v-tab-item>
                    <v-tab-item key="2">

                        <v-text-field v-for="" type="time"></v-text-field>

                    </v-tab-item>
                </v-tabs-items>
            </v-card>
        </v-menu>
    </div>
</template>

<script>
    export default {
        props: ["value"],
        data() {
            return {
                active:1,
                intervalStr: ''
            }
        },
        name: "date-picker",
        created(){

            if (this.value.length > 1) {
                this.active = 2;
                this.value.forEach(val => {
                    this.intervalStr += val.hours + ':' + val.minutes + ', ';
                })
            } else {
                this.intervalStr =
                    (this.value[0].days ? this.value[0].days +
                        (this.value[0].days < 2 ? ' день ' : this.value[0].days < 5 ? ' дня ' : ' дней ') : '') +
                    (this.value[0].hours ? this.value[0].hours +
                        (this.value[0].hours < 2 ? ' час ' : this.value[0].hours < 5 ? ' часа ' : ' часов ') : '') +
                    (this.value[0].minutes ? this.value[0].minutes +
                        (this.value[0].minutes < 2 ? ' минута ' : this.value[0].minutes < 5 ? ' минуты ' : ' минут ') : '')
            }
        }
    }
</script>

<style scoped>

</style>
