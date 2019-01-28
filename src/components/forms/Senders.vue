<template>

    <v-dialog v-model="dialog" scrollable :width="imageHeight">
        <v-btn slot="activator" @click="refreshSenders" flat icon color="grey">
            <v-icon>ballot</v-icon>
        </v-btn>
        <v-card>
            <v-flex class="my-2 " layout row align-center justify-space-between>
                <v-card-title class="title">Отправители</v-card-title>
                <v-btn @click="addItem" flat color="green" small>
                    Добавить <v-icon>add</v-icon>
                </v-btn>
            </v-flex>
            <v-divider></v-divider>
            <v-card-text class="no-scroll-x">
                <v-data-table select-all hide-actions :headers="head" :items="selects" v-model="selected">
                    <template slot="items" slot-scope="props">
                        <td class="text-md-center" :class="props.item.removed ? 'grey' : ''">
                            <v-checkbox v-model="props.selected" hide-details></v-checkbox>
                        </td>
                        <td class="text-md-center" :class="props.item.removed ? 'grey' : ''">
                            {{props.item.name}}
                        </td>
                        <td class="text-md-center" :class="props.item.removed ? 'grey' : ''">
                            {{props.item.email}}
                        </td>
                        <td :class="props.item.removed ? 'grey' : ''" class="text-md-center px-2">
                            <v-icon small  @click="changeItem(props.item)">edit</v-icon>
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
        <v-dialog v-model="dialog2" max-width="500px">
            <v-card>
                <v-card-text>
                    <v-container grid-list-md>
                        <v-layout column>
                                <v-text-field v-model="editedItem.name" label="Имя"></v-text-field>
                                <v-text-field v-model="editedItem.email" label="Email"></v-text-field>
                                <v-text-field v-model="editedItem.host" label="Хост"></v-text-field>
                                <v-text-field v-model="editedItem.port" label="Порт"></v-text-field>
                                <v-text-field type="password" v-model="editedItem.password" label="Пароль"></v-text-field>
                        </v-layout>
                    </v-container>
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn flat @click="dialog2 = false">Закрыть</v-btn>
                    <v-btn flat @click="save">Сохранить</v-btn>
                </v-card-actions>
            </v-card>

        </v-dialog>
    </v-dialog>
</template>

<script>
    export default {
        name: "senders",
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
                    {text: "Email", align: 'center', value: 'email'},
                    {text: 'Удалить', align: 'center', value: true}
                ],
                defaultItem: {
                    name: '',
                    email: ''
                },
                editedItem: {
                    name: '',
                    email: '',
                    host: '',
                    port: '',
                    password: ''
                },
                editedIndex: -1,
                maxId: 0,
                changesMade: false
            }
        },
        methods: {
            save(){
                this.changesMade = true;
                this.$set(this.selects, this.selects.indexOf(this.selects.filter(s => s.id === this.editedIndex)[0]), this.editedItem);
                this.dialog2 = false;
            },
            send(){
                this.$emit('selectSenders', this.selected);
                this.dialog = false;
            },
            changeItem(item) {
                this.editedItem = Object.assign({}, item);
                this.dialog2 = true;
                this.editedIndex = item.id;
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
            refreshSenders(){
                this.$store.dispatch('GET_SENDERS')
                    .then(result => {
                        result.data.sort((a,b) => a.id > b.id ? 1 : -1);
                        this.selects = [];
                        this.selects = result.data;
                        this.maxId = result.data[result.data.length - 1].id;

                        this.selected.push(this.selects.filter(s => s.id === this.defaultSelect)[0])

                    })
            },
            updateTable(){
                this.$store.dispatch('CHANGE_SENDERS', {data: this.selects})
                    .then(() => {
                        this.alertDialog = true;
                        this.refreshSenders()
                    })
            }
        },
        computed: {
            imageHeight () {
                switch (this.$vuetify.breakpoint.name) {
                    case 'xs': return '100vw';
                    case 'sm': return '80vw';
                    case 'md': return '50vw';
                    case 'lg': return '50vw';
                    case 'xl': return '50vw';
                }
            }
        }
    }
</script>

<style scoped>

</style>
