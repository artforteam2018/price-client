<template>
    <div>
        <v-dialog v-model="dialog" scrollable>
            <v-btn slot="activator" @click="refreshHeaders" flat icon color="grey">
                <v-icon>ballot</v-icon>
            </v-btn>
            <v-card>
                <v-flex class="my-2 " layout row align-center justify-space-between>
                    <v-card-title class="title">Шаблоны</v-card-title>
                    <v-btn @click="addItem" flat color="green" small>
                        Добавить
                        <v-icon>add</v-icon>
                    </v-btn>
                </v-flex>
                <v-divider></v-divider>
                <v-card-text class="no-scroll-x">
                    <v-data-table hide-actions select-all :headers="head" :items="selects" v-model="selected">
                        <template slot="items" slot-scope="props">
                            <td :class="props.item.removed ? 'grey' : ''">
                                <v-checkbox v-model="props.selected" hide-details></v-checkbox>
                            </td>
                            <td :class="props.item.removed ? 'grey' : ''">
                                <v-edit-dialog :return-value.sync="props.item.pseudoname" large lazy>
                                    {{props.item.pseudoname}}
                                    <v-text-field
                                        @change="changeItem"
                                        slot="input"
                                        v-model="props.item.pseudoname"
                                        single-line
                                        autofocus
                                    ></v-text-field>
                                </v-edit-dialog>
                            </td>
                            <td class="text-truncate" style="max-width: 20vw" @click="openFilters(props.item)"
                                :class="props.item.removed ? 'grey' : ''">
                                {{props.item.filters ? props.item.filters.join(', ') : 'Нет фильтров'}}
                            </td>
                            <td class="text-truncate" style="max-width: 20vw" @click="openFormulas(props.item)"
                                :class="props.item.removed ? 'grey' : ''">
                                {{props.item.formulas ? props.item.formulas.join(', ') : 'Нет формул'}}
                            </td>
                            <td class="text-truncate" style="max-width: 20vw" @click="openUnions(props.item)"
                                :class="props.item.removed ? 'grey' : ''">
                                {{props.item.unions ? props.item.unions.join(', ') : 'Нет объединений'}}
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
        </v-dialog>
        <v-dialog v-model="alertDialog" width="500">
            <v-card>
                <v-card-title class="headline grey lighten-2" primary-title>Уведомление от сервера</v-card-title>
                <v-card-text>Изменения успешно внесены!</v-card-text>
            </v-card>
        </v-dialog>
        <v-dialog @input="clearParams" :width="imageHeight" v-model="dialog2" style="max-width: 50vw;" large lazy scrollable>
            <v-card>
                <v-flex class="my-2 " layout row align-center justify-space-between>
                    <div v-if="editedType === 1">
                        <v-card-title class="title">Фильтры</v-card-title>
                    </div>
                    <div v-if="editedType === 2">
                        <v-card-title class="title">Формулы</v-card-title>
                    </div>
                    <div v-if="editedType === 3">
                        <v-card-title class="title">Объединения</v-card-title>
                    </div>

                    <v-btn @click="addItem2" flat color="green" small>
                        Добавить
                        <v-icon>add</v-icon>
                    </v-btn>
                </v-flex>
                <v-divider></v-divider>
                <v-card-text>
                    <v-expansion-panel>
                        <v-expansion-panel-content v-if="editedType === 1">

                            <div slot="header">Справка по настройке фильтров</div>
                            <div class="mx-2">
                                <div class="body-2"><br>Настройка полей для фильтрации исходного файла. Каждая колонка
                                    будет
                                    обрабатывать колонку исходного файла под тем же номером.
                                </div>
                                <div class="title"><br>Описание ключевых команд для фильтрации:</div>
                                <div class="body-2"><br><kbd>ЗАПОЛНЕНО</kbd> - колонка исходного файла, соответствующая
                                    той, в
                                    которой находится эта команда, будет
                                    отфильтрована по заполненым значениям. Все незаполненные будут проигнорированы.
                                </div>
                                <div class="body-2"><br><kbd>ЗАПОЛНЕНОЧИСЛО</kbd> - колонка будет отфильтрована по
                                    заполненым
                                    значениям. Все незаполненные будут проигнорированы. Дополнительно проигнорируются
                                    все нечисловые значения
                                </div>
                                <div class="body-2"><br><kbd>ВКЛЮЧАЕТ(СТРОКА)</kbd> или <kbd>ИСКЛЮЧАЕТ (СТРОКА)</kbd> -
                                    в
                                    результирующий файл будут включены только те строки, которые включают строку, или
                                    исключают.
                                </div>
                                <div class="body-2"><br><kbd>НЕРАВНО(СТРОКА)</kbd> -
                                    исключает из результата все что не равно строке.
                                </div>
                                <div class="body-2"><br><kbd>ИСКЛЮЧАЕТСИНДЕКСОМ(А;0)</kbd> или <kbd>ВКЛЮЧАЕТСИНДЕКСОМ(А;0)</kbd>
                                    - в результирующий файл будут включены только те строки, в которых символ под
                                    номером 0
                                    соответствует или не соответствует А. <br>
                                    Пример: <kbd>ВКЛЮЧАЕТСИНДЕКСОМ(Ж;3)</kbd> - в результат не попадут строки, в которых
                                    в этой
                                    колонке четвертый символ - буква Ж. слова коЖа, ноЖ попадают под фильтр.
                                </div>
                            </div>
                        </v-expansion-panel-content>
                        <v-expansion-panel-content v-if="editedType === 2">

                            <div slot="header">Справка по настройке формул</div>
                            <div class="mx-2">
                                <div class="body-2"><br>Настройка полей для расчета формул исходного файла. Каждая
                                    колонка будет
                                    обрабатывать колонку исходного файла под тем же номером.
                                </div>
                                <div class="title"><br>Описание ключевых команд для расчета формул:</div>
                                <div class="body-2"><br>
                                    <kbd>A-Z</kbd> - буквы алфавита означают номер колонки. Номер буквы в алфавите
                                    соответствует
                                    номеру колонки в таблице 1-A, 2-B, 3-C, 4-D
                                </div>
                                <div class="body-2"><br>
                                    <kbd>ЕСЛИ(A>B;'А больше Б';'А меньше Б')</kbd> - формула - условие. Полностью
                                    соответствует
                                    формуле ЕСЛИ в excel.
                                </div>
                                <div class="body-2"><br><kbd>ЕЧИСЛО(ПОИСК('MOBIL';C))</kbd> - данная формула ищет строку
                                    MOBIL в
                                    колонке C, результат ИСТИНА или ЛОЖЬ, используется в связке с условием ЕСЛИ
                                </div>
                                <div class="body-2"><br><kbd>ОКРУГЛВВЕРХ(2.5;0)</kbd> или <kbd>ОКРУГЛВНИЗ(11.1;0)</kbd>
                                    - число до ; будет округлено вверх или вниз с точностью до того числа знаков,
                                    которое
                                    указано после ;
                                </div>
                                <div class="body-2"><br><kbd>КУРС(EUR)</kbd>
                                    - вместо этой надписи в формулу подставится текущий курс указанной в скобках валюты
                                    по отношению к рублю. Список валют, доступных к указанию и их написание можно увидеть
                                    на сайте <a href="http://www.cbr.ru/currency_base/daily/">Центробанка</a>
                                </div>
                                <div class="body-2"><br><kbd>ЗАМЕНА(А,строка1,строка2)</kbd>
                                    - Для записи <kbd>ЗАМЕНА(А,Привет,Пока)</kbd>, где А обозначает первую колонку,
                                    все записи "привет" заменятся на "пока". Кавычки ставить не нужно, замена производится без них
                                </div>
                                <div class="body-2"><br><kbd>ЭТОЧИСЛО(А)</kbd>
                                    - Заменяет строку вида 294,2 на число. Если преобразование в строку невозможно - будет нулевое значение.
                                </div>

                            </div>
                        </v-expansion-panel-content>
                        <v-expansion-panel-content v-if="editedType === 3">

                            <div slot="header">Справка по настройке объединений</div>
                            <div class="mx-2">
                                <div class="body-2"><br>Настройка полей для объединений. Объединения настраиваются
                                    отдельно, так
                                    как дополнительные таблицы заносятся в базу.
                                </div>
                            </div>
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                    <div class="mt-2"></div>
                    <v-select v-if="editedType === 2"
                        @change="getRow"
                        v-model="rulesSelect"
                        :items="rules"
                        item-text="name"
                        item-value="id"
                        label="Выберите прайс для демо просмотра"
                    ></v-select>
                    <v-divider v-if="editedType === 2" class="my-2"></v-divider>
                    <v-data-table v-if="editedType === 2" hide-actions @change="changeItem" slot="input" :items="threeRows">
                        <template slot="headers" slot-scope="props">
                            <td class="text-md-center light-green lighten-4"  v-for="prop, index in threeRows[0]">{{('ABCDEFGHIJKLMNOPQRSTUVWXYZ')[index]}}</td>
                        </template>
                        <template slot="items" slot-scope="props">
                            <td  class="text-md-center light-green lighten-5" v-for="i in props.item">{{i}}</td>
                        </template>
                    </v-data-table>
                    <v-divider v-if="editedType === 2" class="my-2"></v-divider>
                    <v-data-table hide-actions hide-headers @change="changeItem" slot="input" :items="editedItem">
                        <template slot="items" slot-scope="props">
                            <td class="layout" style="width: 5rem">
                                <v-icon class="text-md-center" @click="moveDown(props.index)">keyboard_arrow_down
                                </v-icon>
                                <v-icon class="text-md-center" @click="moveUp(props.index)">keyboard_arrow_up</v-icon>
                            </td>
                            <td>{{editedHeader[props.index]}}</td>
                            <td style="width: 55rem">
                                <v-edit-dialog :return-value.sync="editedItem[props.index]" large lazy>
                                    <div class="text-truncate" style="max-width: 30rem">{{editedItem[props.index]}}
                                    </div>
                                    <v-text-field
                                        slot="input"
                                        @change="getRow"
                                        v-model="editedItem[props.index]"
                                        single-line
                                        autofocus
                                    ></v-text-field>
                                </v-edit-dialog>
                            </td>
                            <td v-if="editedType === 2">{{editedResult[props.index]}}</td>
                            <td class="text-md-center px-2">
                                <v-icon small @click="deleteItem2(props)">delete</v-icon>
                            </td>
                        </template>
                    </v-data-table>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn flat @click="dialog2 = false">Закрыть</v-btn>
                    <v-btn v-if="editedType === 1" flat @click="saveFilters">Сохранить</v-btn>
                    <v-btn v-if="editedType === 2" flat @click="saveFormulas">Сохранить</v-btn>
                    <v-btn v-if="editedType === 3" flat @click="saveUnions">Сохранить</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
    export default {
        name: "headers",
        props: ['defaultSelect', 'header', 'rules'],
        data() {
            return {
                rulesSelect: {},
                headers: [],
                dialog: false,
                dialog2: false,
                alertDialog: false,
                selects: [],
                selected: [],
                head: [
                    {text: "Имя", align: 'center', value: 'pseudoname'},
                    {text: "Фильтры", align: 'center', value: 'filters'},
                    {text: "Формулы", align: 'center', value: 'formulas'},
                    {text: "Объединения", align: 'center', value: 'unions'},
                    {text: 'Скопировать', align: 'center', value: true},
                    {text: 'Удалить', align: 'center', value: true}
                ],
                defaultItem: {
                    name: '',
                    email: ''
                },
                maxId: 0,
                changesMade: false,
                editedItem: [],
                editedResult: [],
                editedHeader: [],
                editedIndex: -1,
                editedType: 0,
                threeRows: []
            }
        },
        methods: {
            clearParams(){
                this.threeRows = [];
                this.rulesSelect = {};
            },
            moveUp(evt) {
                if (evt > 0) {
                    let temp = this.editedItem[evt];
                    this.$set(this.editedItem, evt, this.editedItem[evt - 1]);
                    this.$set(this.editedItem, evt - 1, temp);
                }
                this.getRow()
            },
            moveDown(evt) {
                if (evt < this.editedItem.length - 1) {

                    let temp = this.editedItem[evt];
                    this.$set(this.editedItem, evt, this.editedItem[evt + 1]);
                    this.$set(this.editedItem, evt + 1, temp);
                }
                this.getRow()
            },
            send() {
                this.$emit('selectTemplate', this.selected);
                this.dialog = false;
            },
            changeItem() {
                this.changesMade = true;
            },
            addItem2() {
                this.editedItem.push('');
            },
            addItem() {
                this.selects.push({pseudoname: '', filters: [], formulas: [], unions: null});
                this.maxId = ++this.maxId;
                this.changesMade = true;
            },
            copyItem(item) {
                let it = Object.assign({}, item);
                it.id = ++this.maxId;
                this.selects.push(it);
                this.changesMade = true;
            },
            deleteItem(item) {
                item.removed = true;
                this.$set(this.selects, this.selects.indexOf(item), item);
                this.changesMade = true;
            },
            deleteItem2(item) {
                this.editedItem.splice(item.index, 1)
            },
            openUnions(item) {
                this.dialog2 = true;
                this.editedIndex = item.id;
                this.editedItem = item.unions === null ? [] : item.unions.concat();
                this.editedType = 3;
            },
            openFormulas(item) {
                this.dialog2 = true;
                this.editedIndex = item.id;
                this.editedItem = item.formulas === null ? [] : item.formulas.concat();
                this.editedResult = this.editedItem.concat();
                this.editedType = 2;
                this.editedHeader = [];
                for (let i = 0; i < this.editedItem.length; i++) {
                    this.editedHeader[i] = this.headers.filter(head => head.id === this.header)[0].columns[i]
                }
            },
            openFilters(item) {
                this.dialog2 = true;
                this.editedIndex = item.id;
                this.editedItem = item.filters === null ? [] : item.filters.concat();
                this.editedType = 1;
                this.editedHeader = [];
                for (let i = 0; i < this.editedItem.length; i++) {
                    this.editedHeader[i] = this.headers.filter(head => head.id === this.header)[0].columns[i]
                }
            },
            refreshHeaders() {
                this.$store.dispatch('GET_HEADERS')
                    .then(result => {
                        result.data.sort((a, b) => a.id > b.id ? 1 : -1);
                        this.headers = [];
                        this.headers = result.data;
                    });
                this.$store.dispatch('GET_TEMPLATE')
                    .then(result => {
                        result.data.sort((a, b) => a.id > b.id ? 1 : -1);
                        this.selects = [];
                        this.selects = result.data;
                        this.maxId = result.data[result.data.length - 1].id + 1
                        if (this.defaultSelect !== -1) {
                            this.selected.push(this.selects.filter(s => s.id === this.defaultSelect)[0])
                        }
                    })
            },
            updateTable() {
                this.$store.dispatch('CHANGE_TEMPLATE', {data: this.selects})
                    .then(() => {
                        this.alertDialog = true;
                        this.refreshHeaders()
                    })
            },
            saveFilters() {
                this.selects.filter(s => s.id === this.editedIndex)[0].filters = this.editedItem;
                this.dialog2 = false;
                this.changesMade = true;
            },
            saveFormulas() {
                this.selects.filter(s => s.id === this.editedIndex)[0].formulas = this.editedItem;
                this.dialog2 = false;
                this.changesMade = true;
            },
            saveUnions() {
                this.selects.filter(s => s.id === this.editedIndex)[0].unions = this.editedItem;
                this.dialog2 = false;
                this.changesMade = true;
            },
            getRow() {
                if (this.editedType === 2) {
                    this.$store.dispatch('GET_ONE_ROW', {data: {item: this.editedItem, rule: this.rulesSelect}})
                        .then(result => {
                            this.editedResult = result.data.data;
                            this.threeRows = result.data.threeRows;
                        });
                }
            }
        },
        computed: {
            imageHeight() {
                switch (this.$vuetify.breakpoint.name) {
                    case 'xs':
                        return '100vw';
                    case 'sm':
                        return '80vw';
                    case 'md':
                        return '50vw';
                    case 'lg':
                        return '50vw';
                    case 'xl':
                        return '50vw';
                }
            }
        }
    }
</script>

<style scoped>

</style>
