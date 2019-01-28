<template>
    <div>
        <v-menu v-model="menu" :close-on-content-click="false" attach offset-x>
            <v-btn @click="openTab" flat small slot="activator">{{intervalStr}}</v-btn>

            <v-card class="px-4">
                <v-layout row>
                    <v-spacer></v-spacer>
                    <v-icon class="my-2" v-if="!one" @click="add" fab flat color="green">add</v-icon>
                    <v-icon class="my-2" flat color="red" @click="menu = false">close</v-icon>
                </v-layout>
                <v-list v-if="one">
                    <v-flex class="mx-2" layout row>
                        <div class="align-self-center px-2 py-2 body-2">Дни:</div>
                        <v-text-field type="number" class="text-right" hide-details flat solo
                                      v-model="frequencyLoc.days"></v-text-field>
                    </v-flex>
                    <v-divider></v-divider>
                    <v-flex class="mx-2" layout row>
                        <div class="align-self-center px-2 py-2 body-2">Часы:</div>
                        <v-text-field type="number" class="text-right" hide-details flat solo
                                      v-model="frequencyLoc.hours"></v-text-field>
                    </v-flex>
                    <v-divider></v-divider>
                    <v-flex class="mx-2" layout row>
                        <div class="align-self-center px-2 py-2 body-2">Минуты:</div>
                        <v-text-field type="number" class="text-right" hide-details flat solo
                                      v-model="frequencyLoc.minutes"></v-text-field>
                    </v-flex>
                </v-list>
                <div v-if="!one">
                    <v-data-table hide-actions hide-headers :items="intervalsLoc">
                        <template slot="items" slot-scope="props">
                            <td>
                                <v-edit-dialog :return-value.sync="new Date(props.item).toLocaleTimeString()" large lazy>
                                    {{ new Date(props.item).toLocaleTimeString() }}
                                    <v-text-field
                                        @change="changeItem($event, props)"
                                        slot="input"
                                        v-model="new Date(props.item).toLocaleTimeString()"
                                        single-line
                                        autofocus
                                    ></v-text-field>
                                </v-edit-dialog>

                            </td>
                            <td class="text-md-center px-2">
                                <v-icon small  @click="deleteItem(props.item)">delete</v-icon>
                            </td>
                        </template>
                    </v-data-table>
                </div>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn @click="one = !one"  flat>{{one ? "По таймеру" : "По расписанию"}}</v-btn>
                    <v-btn  flat @click="save">Сохранить</v-btn>
                </v-card-actions>
            </v-card>

        </v-menu>
    </div>
</template>

<script>
    export default {
        props: ["index", "intervals", "frequency", "intervalStr"],
        methods: {
            deleteItem(item) {
                const index = this.intervalsLoc.indexOf(item);
                this.intervalsLoc.splice(index, 1)
            },
            openTab() {
                this.intervalsLoc = this.intervals.concat();
                this.frequencyLoc = Object.assign({}, this.frequency);
                if (this.intervals.length > 0) {
                    this.one = 0
                } else {
                    this.one = 1
                }
            },
            add(){
                this.intervalsLoc.push('2018-01-01 12:00:00')
            },
            changeItem(evt, item){
                let date = new Date('2018-01-01');
                date.setHours(
                    evt.substring(0, evt.indexOf(':')),
                    evt.substring(evt.indexOf(':')+1, evt.lastIndexOf(':')),
                    evt.substring(evt.lastIndexOf(':')+1, evt.length));
                this.$set(this.intervalsLoc, item.index, date);
            },
            save(){
                this.$emit('saveTime', {intervals: this.intervalsLoc, frequency: this.frequencyLoc});
                this.menu = false;
            }
        },
        data() {
            return {
                intervalsLoc: [],
                frequencyLoc: {},
                one: 0,
                menu: false
            }
        },
        name: "date-picker"
    }
</script>

<style scoped>

</style>
