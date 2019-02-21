<template>
    <div>
        <v-menu v-model="menu" :close-on-content-click="false" attach offset-x>
            <v-btn flat small slot="activator">{{groups}}</v-btn>

            <v-card class="px-4">
                <v-layout row>
                    <v-spacer></v-spacer>
                    <v-icon class="my-2" v-if="!one" @click="add" fab flat color="green">add</v-icon>
                    <v-icon class="my-2" flat color="red" @click="menu = false">close</v-icon>
                </v-layout>
                <v-data-table hide-actions hide-headers :items="groupsLoc">
                    <template slot="items" slot-scope="props">
                        <td class="layout" style="width: 5rem">
                            <v-icon class="text-md-center" @click="moveDown(props.index)">keyboard_arrow_down
                            </v-icon>
                            <v-icon class="text-md-center" @click="moveUp(props.index)">keyboard_arrow_up</v-icon>
                        </td>
                        <td style="width: 55rem">
                                <v-select multiple chips
                                          v-model="props.item"
                                          @change="change($event, props)"
                                          :items="templates"
                                          item-text="name"
                                          item-value="id"
                                ></v-select>
                        </td>
                        <td class="text-md-center px-2">
                            <v-icon small @click="deleteItem(props.item)">delete</v-icon>
                        </td>
                    </template>
                </v-data-table>
                <v-layout row>
                    <v-btn flat @click="save">Сохранить</v-btn>
                </v-layout>
            </v-card>

        </v-menu>
    </div>
</template>

<script>
    export default {
        props: ["index", "groups", "templates"],
        methods: {
            deleteItem(item) {
                const index = this.groupsLoc.indexOf(item);
                this.groupsLoc.splice(index, 1)
            },
            add(){
                this.groupsLoc.push('')
            },
            save(){
                this.$emit('selectGroups', {groups: this.groupsLoc});
                this.menu = false;
            },
            change(evt, props){
                this.$set(this.groupsLoc, props.index, evt);
            },
            moveUp(evt) {
                if (evt > 0) {
                    let temp = this.groupsLoc[evt];
                    this.$set(this.groupsLoc, evt, this.groupsLoc[evt - 1]);
                    this.$set(this.groupsLoc, evt - 1, temp);
                }
            },
            moveDown(evt) {
                if (evt < this.groupsLoc.length - 1) {

                    let temp = this.groupsLoc[evt];
                    this.$set(this.groupsLoc, evt, this.groupsLoc[evt + 1]);
                    this.$set(this.groupsLoc, evt + 1, temp);
                }
            },
        },
        data() {
            return {
                groupsLoc: {},
                one: 0,
                menu: false
            }
        },
        name: "date-picker",
        created() {
            this.groupsLoc = this.groups.split(', ').map(g => g.split('; ').map(gg => parseInt(gg)));
        }
    }
</script>

<style scoped>

</style>
