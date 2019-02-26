<template>

    <v-dialog v-model="dialog" width="60vw" scrollable>
        <v-btn slot="activator" @click="refreshHeaders" flat icon color="grey">
            <v-icon>ballot</v-icon>
        </v-btn>
        <v-card>
            <v-card-text class="no-scroll-x">
                <v-data-table select-all hide-actions :headers="head" :items="selects" v-model="selected">
                    <template slot="items" slot-scope="props">
                        <td class="text-md-center" width="5px">
                            <v-checkbox v-model="props.selected" hide-details></v-checkbox>
                        </td>
                        <td class="text-md-center">{{props.item.name}}</td>
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
                    {text: "Имя", align: 'center', value: 'name'}

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
            send() {
                this.$emit('selectAddTables', this.selected);
                this.dialog = false;
            },
            openHeaderDialog(item) {
                this.dialog2 = true;
                this.editedIndex = item.id;
                this.editedItem = item.columns.concat();
            },
            refreshHeaders() {
                this.$store.dispatch('GET_ADD')
                    .then(result => {
                        result.data.sort((a, b) => a.id > b.id ? 1 : -1);
                        this.selects = [];
                        this.selects = result.data;
                        this.maxId = result.data[result.data.length - 1].id;
                        if (this.defaultSelect !== -1) {
                            this.selected = this.selects.filter(s => this.defaultSelect.includes(s.id))
                            console.log(this.selected)
                        }
                    })
            },
        }
    }
</script>

<style scoped>

</style>
