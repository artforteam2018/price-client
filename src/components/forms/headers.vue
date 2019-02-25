<template>

    <v-dialog v-model="dialog" width="60vw" scrollable>
        <v-btn slot="activator" @click="refreshHeaders" flat icon color="grey">
            <v-icon>ballot</v-icon>
        </v-btn>
        <v-card>
            <v-flex class="my-2 " layout row align-center justify-space-between>
                <v-card-title class="title">Заголовки</v-card-title>
                <v-btn @click="addItem" flat color="green" small>
                    Добавить
                    <v-icon>add</v-icon>
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
                        <td @click="openHeaderDialog(props.item)" :class="props.item.removed ? 'grey' : ''">
                            {{props.item.columns.join(', ')}}
                        </td>
                        <td :class="props.item.removed ? 'grey' : ''" class="text-md-center px-2">
                            <v-icon small @click="copyItem(props.item)">library_add</v-icon>
                        </td>
                        <td :class="props.item.removed ? 'grey' : ''" class="text-md-center px-2">
                            <v-icon small @click="deleteItem(props.item)">delete</v-icon>
                        </td>
                    </template>
                </v-data-table>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn flat @click="dialog = false">Закрыть</v-btn>
                <v-btn flat @click="send">Выбрать</v-btn>
                <v-btn v-if="changesMade" flat @click="updateTable">Сохранить изменения</v-btn>
            </v-card-actions>
        </v-card>
        <v-dialog v-model="alertDialog" width="500">
            <v-card>
                <v-card-title class="headline grey lighten-2" primary-title>Уведомление от сервера</v-card-title>
                <v-card-text>Изменения успешно внесены!</v-card-text>
            </v-card>
        </v-dialog>
        <v-dialog v-model="dialog2" width="50vw" large lazy scrollable>
            <v-card>
                <v-flex class="my-2 " layout row align-center justify-space-between>
                    <v-card-title class="title">Заголовки</v-card-title>
                    <v-btn @click="addItem2" flat color="green" small>
                        Добавить
                        <v-icon>add</v-icon>
                    </v-btn>
                </v-flex>
                <v-divider></v-divider>
                <v-card-text>
                    <v-data-table
                        hide-actions
                        hide-headers
                        @change="changeItem"
                        slot="input"
                        :items="editedItem"
                    >
                        <template slot="items" slot-scope="props">
                            <td class="layout" style="width: 5rem">
                                <v-icon class="text-md-center" @click="moveDown(props.index)">keyboard_arrow_down</v-icon>
                                <v-icon class="text-md-center" @click="moveUp(props.index)">keyboard_arrow_up</v-icon>
                            </td>
                            <td style="width: 55rem">
                                <v-edit-dialog :return-value.sync="editedItem[props.index]" large lazy>
                                    {{editedItem[props.index]}}
                                    <v-text-field
                                        slot="input"
                                        v-model="editedItem[props.index]"
                                        single-line
                                        autofocus
                                    ></v-text-field>
                                </v-edit-dialog>
                            </td>

                            <td class="text-md-center px-2">
                                <v-icon small @click="deleteItem2(props)">delete</v-icon>
                            </td>
                        </template>
                    </v-data-table>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn flat @click="dialog2 = false">Закрыть</v-btn>
                    <v-btn flat @click="saveHeaders">Сохранить</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-dialog>
</template>

<script>
    export default {
        name: "headers",
        props: ['defaultSelect'],
        data() {
            return {
                dialog: false,
                dialog2: false,
                alertDialog: false,
                selects: [],
                selected: [],
                head: [
                    {text: "Имя", align: 'center', value: 'name'},
                    {text: "Колонки", align: 'center', value: 'columns'},
                    {text: 'Скопировать', align: 'center', value: true},
                    {text: 'Удалить', align: 'center', value: true},

                ],
                defaultItem: {
                    name: '',
                    email: ''
                },
                maxId: 0,
                changesMade: false,
                editedItem: [],
                editedIndex: -1
            }
        },
        methods: {
            moveUp(evt){
                if (evt > 0) {
                    let temp = this.editedItem[evt];
                    this.$set(this.editedItem, evt, this.editedItem[evt - 1]);
                    this.$set(this.editedItem, evt-1, temp);
                }
            },
            moveDown(evt){
                if (evt < this.editedItem.length-1) {

                    let temp = this.editedItem[evt];
                    this.$set(this.editedItem, evt, this.editedItem[evt + 1]);
                    this.$set(this.editedItem, evt+1, temp);
                }
            },
            send() {
                this.$emit('selectHeaders', this.selected);
                this.dialog = false;
            },
            changeItem() {
                this.changesMade = true;
            },
            addItem2() {
                this.editedItem.push('');
            },
            addItem() {
                this.selects.push({name: '', columns: [], removed: false, id: this.maxId + 1});
                this.maxId = this.maxId + 1;
                this.changesMade = true;
            },
            deleteItem(item) {
                item.removed = true;
                this.$set(this.selects, this.selects.indexOf(item), item);
                this.changesMade = true;
            },
            copyItem(item) {
                let it = Object.assign({}, item);
                it.id = ++this.maxId;
                this.selects.push(it);
                this.changesMade = true;
            },
            deleteItem2(item) {
               this.editedItem.splice(item.index, 1)
            },
            openHeaderDialog(item) {
                this.dialog2 = true;
                this.editedIndex = item.id;
                this.editedItem = item.columns.concat();
            },
            refreshHeaders() {
                this.$store.dispatch('GET_HEADERS')
                    .then(result => {
                        result.data.sort((a, b) => a.id > b.id ? 1 : -1);
                        this.selects = [];
                        this.selects = result.data;
                        this.maxId = result.data[result.data.length - 1].id;
                        if (this.defaultSelect !== -1) {
                            this.selected.push(this.selects.filter(s => s.id === this.defaultSelect)[0])
                        }
                    })
            },
            updateTable() {
                this.$store.dispatch('CHANGE_HEADERS', {data: this.selects})
                    .then(() => {
                        this.alertDialog = true;
                        this.refreshHeaders()
                    })
            },
            saveHeaders() {
                this.selects.filter(s => s.id === this.editedIndex)[0].columns = this.editedItem;
                this.dialog2 = false;
                this.changesMade = true;
            }
        }
    }
</script>

<style scoped>

</style>
