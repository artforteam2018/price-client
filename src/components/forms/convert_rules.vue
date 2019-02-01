<template>

    <v-dialog v-model="dialog" scrollable>
        <v-btn slot="activator" @click="refreshReceivers" flat icon color="grey">
            <v-icon>ballot</v-icon>
        </v-btn>
        <v-card>
            <v-flex class="my-2 " layout row align-center justify-space-between>
                <v-card-title class="title">Получение прайсов</v-card-title>
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
                        <!--name, template, sender, filter, outer_name, title_filter, headers, in_use, removed-->
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
                            <v-layout row justify-space-between align-center>
                                {{props.item.template_name}}
                                <template_t :defaultSelect="props.item.template" @selectTemplate="selectTemplate($event, props.item)"></template_t>
                            </v-layout>
                        </td>
                        <td :class="props.item.removed ? 'grey' : ''">
                            <v-edit-dialog :return-value.sync="props.item.sender" large lazy>
                                {{props.item.sender}}
                                <v-text-field
                                    @change="changeItem"
                                    slot="input"
                                    v-model="props.item.sender"
                                    single-line
                                    autofocus
                                ></v-text-field>
                            </v-edit-dialog>
                        </td>
                        <td :class="props.item.removed ? 'grey' : ''">
                            <v-edit-dialog :return-value.sync="props.item.filter" large lazy>
                                {{props.item.filter}}
                                <v-text-field
                                    @change="changeItem"
                                    slot="input"
                                    v-model="props.item.filter"
                                    single-line
                                    autofocus
                                ></v-text-field>
                            </v-edit-dialog>
                        </td>
                        <td :class="props.item.removed ? 'grey' : ''">
                            <v-edit-dialog :return-value.sync="props.item['title_filter']" large lazy>
                                {{props.item['title_filter']}}
                                <v-text-field
                                    @change="changeItem"
                                    slot="input"
                                    v-model="props.item['title_filter']"
                                    single-line
                                    autofocus
                                ></v-text-field>
                            </v-edit-dialog>
                        </td>
                        <td :class="props.item.removed ? 'grey' : ''">
                            <v-layout row justify-space-between align-center>
                                {{props.item.headers_name}}
                                <headers :defaultSelect="props.item.headers" @selectHeaders="selectHeaders($event, props.item)"></headers>
                            </v-layout>
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
    </v-dialog>
</template>

<script>
    import headers from './headers'
    import template_t from './template'
    import {mapGetters} from 'vuex'

    export default {
        name: "convert_rules",
        props: ['defaultSelect'],
        data() {
            return {
                dialog: false,
                alertDialog: false,
                selects: [],
                selected: [],
                head: [
                    {text: "Имя", align: 'center', value: 'name'},
                    {text: "Шаблон формирования", align: 'center', value: 'template_name'},
                    {text: "Отправитель", align: 'center', value: 'sender'},
                    {text: "Фильтр заголовка файла", align: 'center', value: 'filter'},
                    {text: "Фильтр заголовка письма", align: 'center', value: 'title_filter'},
                    {text: "Заголовки", align: 'center', value: 'headers_name'},
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
        components: {headers, template_t},
        methods: {
            send() {
                this.$emit('selectConvertRules', this.selected);
                this.dialog = false;
            },
            changeItem() {
                this.changesMade = true;
            },
            addItem() {
                this.selects.push({
                    name: '',
                    template_name: '',
                    template: -1,
                    sender: '',
                    filter: '',
                    title_filter: '',
                    headers: -1,
                    headers_name: '',
                    id: this.maxId + 1
                });
                this.maxId = this.maxId + 1;
                this.changesMade = true;
            },
            deleteItem(item) {
                item.removed = true;
                this.$set(this.selects, this.selects.indexOf(item), item);
                this.changesMade = true;
            },
            refreshReceivers() {
                this.$store.dispatch('GET_TEMPLATES')
                    .then(async result => {
                        result.data.sort((a, b) => a.id > b.id ? 1 : -1);
                        let templatesComp = await this.getTemplatesComp(1);
                        let headersComp = await this.getHeadersComp(1);
                        this.selects = [];
                        await Promise.all(result.data.map(res => {
                            return new Promise(resolve => {
                                this.selects.push({
                                    name: res.name,
                                    sender: res.sender,
                                    filter: res.filter,
                                    title_filter: res.title_filter,
                                    id: res.id,
                                    template_name: templatesComp.filter(temp => temp.id === res.template)[0].pseudoname,
                                    template: res.template,
                                    headers: res.headers,
                                    removed: res.removed,
                                    headers_name: headersComp.filter(head => head.id === res.headers)[0].name
                                });
                                resolve();
                            })
                        }));
                        this.defaultSelect.forEach(select => {
                            this.selected.push(this.selects.filter(s => s.id === select.id)[0])
                        });

                        this.maxId = result.data[result.data.length - 1].id
                    })
            },
            updateTable() {
                this.$store.dispatch('CHANGE_TEMPLATES', {data: this.selects})
                    .then(() => {
                        this.alertDialog = true;
                        this.refreshReceivers()
                    })
            },
            async selectHeaders(evt, item) {
                let headersComp = await this.getHeadersComp(1);
                this.selects[this.selects.indexOf(item)].headers = evt[0].id;
                this.selects[this.selects.indexOf(item)].headers_name = headersComp.filter(head => head.id === evt[0].id)[0].name;
                this.changesMade = true;
            },
            async selectTemplate(evt, item) {
                let templatesComp = await this.getTemplatesComp(1);
                this.selects[this.selects.indexOf(item)].template = evt[0].id;
                this.selects[this.selects.indexOf(item)].template_name = templatesComp.filter(temp => temp.id === evt[0].id)[0].pseudoname;
                this.changesMade = true;
            }
        },
        computed:
            mapGetters([
                'getTemplatesComp',
                'getHeadersComp'
            ])
    }
</script>

<style scoped>

</style>
