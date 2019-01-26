<template>

    <v-dialog v-model="dialog" scrollable max-width="80vw">
        <v-btn slot="activator" @click="refreshReceivers" flat icon color="grey">
            <v-icon>ballot</v-icon>
        </v-btn>
        <v-card>
            <v-flex class="my-2 " layout row align-center justify-space-between>
                <v-card-title class="title">Получатели</v-card-title>
                <v-btn @click="addItem" flat color="green" small>
                    Добавить <v-icon>add</v-icon>
                </v-btn>
            </v-flex>
            <v-divider></v-divider>
            <v-card-text class="no-scroll-x">
                <v-data-table select-all hide-actions :headers="head" :items="selects" v-model="selected">
                    <template slot="items" slot-scope="props">
                        <td :class="props.item.removed ? 'grey' : ''">
                            <v-checkbox v-model="props.selected" hide-details></v-checkbox>
                        </td>
                        <td :class="props.item.removed ? 'grey' : ''">
                            <v-edit-dialog :return-value.sync="props.item.name" large lazy>
                                {{props.item.name}}
                                <v-text-field
                                    @change="changeItem"
                                    slot="input"
                                    v-model="props.item.name"
                                    single-line
                                    autofocus
                                ></v-text-field>
                            </v-edit-dialog>
                        </td>
                        <td :class="props.item.removed ? 'grey' : ''">
                            <v-edit-dialog :return-value.sync="props.item.email" large lazy>
                                {{props.item.email}}
                                <v-text-field
                                    @change="changeItem"
                                    slot="input"
                                    v-model="props.item.email"
                                    single-line
                                    autofocus
                                ></v-text-field>
                            </v-edit-dialog>
                            </td>
                        <td :class="props.item.removed ? 'grey' : ''" class="text-md-center px-2">
                            <v-icon small  @click="deleteItem(props.item)">delete</v-icon>
                        </td>
                    </template>
                </v-data-table>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn flat @click="dialog = false">Закрыть</v-btn>
                <v-btn  flat @click="send">Выбрать</v-btn>
                <v-btn v-if="changesMade" flat @click="updateTable">Сохранить изменения</v-btn>
            </v-card-actions>
        </v-card>
        <v-dialog v-model="alertDialog" width="500">
           <v-card>
                <v-card-title class="headline grey lighten-2" primary-title>Уведомление от сервера</v-card-title>
                <v-card-text>Изменения успешно внесены!</v-card-text>
            </v-card>
        </v-dialog>
    </v-dialog>
</template>

<script>
    export default {
        name: "receivers",
        data() {
            return {
                dialog: false,
                alertDialog: false,
                selects: [],
                selected: [],
                head: [
                    {text: "Имя", align: 'center', value: 'name'},
                    {text: "Email", align: 'center', value: 'email'},
                    {text: 'Удалить', align: 'center', value: true}
                ],
                defaultItem: {
                    name: '',
                    email: ''
                },
                maxId: 0,
                changesMade: false
            }
        },
        methods: {
            send(){
                this.$emit('selectReceivers', this.selected);
                this.dialog = false;
            },
            changeItem() {
                this.changesMade = true;
            },
            addItem() {
                this.selects.push({name: '', email: '', removed: false, id: this.maxId+1});
                this.maxId = this.maxId + 1;
                this.changesMade = true;
            },
            deleteItem(item) {
                item.removed = true;
                this.$set(this.selects, this.selects.indexOf(item), item);
                this.changesMade = true;
            },
            refreshReceivers(){
                this.$store.dispatch('GET_RECEIVERS')
                    .then(result => {
                        result.data.sort((a,b) => a.id > b.id ? 1 : -1);
                        this.selects = [];
                        this.selects = result.data;
                        this.maxId = result.data[result.data.length-1].id
                    })
            },
            updateTable(){
                this.$store.dispatch('CHANGE_RECEIVERS', {data: this.selects})
                    .then(() => {
                        this.alertDialog = true;
                        this.refreshReceivers()
                    })
            }
        }
    }
</script>

<style scoped>

</style>
