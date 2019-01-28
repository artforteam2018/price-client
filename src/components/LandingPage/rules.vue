<template>

    <div class="h-100">
        <v-flex class="mx-4">
            <v-flex md4  class="mb-4 mx-auto">
                <v-img src="static/img/logo/logo_all_planeta.png"></v-img>
            </v-flex>
            <v-flex row layout align-center>
                <v-btn flat>Текущий пользователь: {{getUsername}}</v-btn>
                <v-spacer></v-spacer>
                <v-btn flat @click="addItem">Добавить правило</v-btn>
                <v-btn v-if="changesMade" flat @click="updateTable">Сохранить изменения</v-btn>
                <v-btn flat @click="quit">Выйти</v-btn>
            </v-flex>
            <v-data-table item-key="id" ref="tt" data-app :headers="headers" :items="send_rules">
                <template slot="items" slot-scope="props">
                    <td :class="props.item.removed ? 'grey' : ''">
                        <v-edit-dialog :return-value.sync="props.item.rule_name" large lazy>
                            <v-layout column>
                                {{ props.item.rule_name }}
                                <div>
                                    <span v-for="bar in props.item.statusBar"
                                          :style="bar === 'success' ? 'color :green' : bar === 'pending' ? 'color: yellow' : 'color :red'"
                                          class="title font-weight-black">–</span>
                                </div>
                            </v-layout>
                            <v-text-field
                                slot="input"
                                v-model="props.item.rule_name"
                                @change="changesMade = true"
                                single-line
                                autofocus
                                class="offset-md3"
                            ></v-text-field>
                        </v-edit-dialog>
                    </td>
                    <td class="text-md-center" :class="props.item.removed ? 'grey' : ''">
                        <v-layout row justify-space-between align-center>
                            {{props.item.sender_name}}
                            <v-spacer></v-spacer>
                            <senders @selectSenders="selectSenders($event, props.item)"></senders>
                        </v-layout>
                    </td>
                    <td class="text-md-center" :class="props.item.removed ? 'grey' : ''">
                        <v-edit-dialog :return-value.sync="props.item.result_name" large lazy>
                            {{ props.item.result_name }}
                            <v-text-field
                                slot="input"
                                @change="changesMade = true"
                                v-model="props.item.result_name"
                                single-line
                                autofocus
                            ></v-text-field>
                        </v-edit-dialog>
                    </td>
                    <td class="text-md-center" :class="props.item.removed ? 'grey' : ''">
                        <v-edit-dialog :return-value.sync="props.item.title" large lazy>
                            {{ props.item.title }}
                            <v-text-field
                                slot="input"
                                @change="changesMade = true"
                                v-model="props.item.title"
                                single-line
                                autofocus
                            ></v-text-field>
                        </v-edit-dialog>
                    </td>
                    <td class="text-md-center" :class="props.item.removed ? 'grey' : ''">
                        <v-layout row justify-space-between align-center>
                            {{getTemplateStr(props.item.templatesComp)}}
                            <v-spacer></v-spacer>
                            <convert_rules @selectConvertRules="selectConvertRules($event, props.item)"></convert_rules>
                        </v-layout>
                    </td>
                    <td class="text-md-center" :class="props.item.removed ? 'grey' : ''">
                        <v-layout row justify-space-between align-center>
                            {{getReceiverStr(props.item.receiversComp)}}
                            <v-spacer></v-spacer>
                            <receivers @selectReceivers="selectReceivers($event, props.item)"></receivers>
                        </v-layout>
                    </td>
                    <td class="text-md-center" :class="props.item.removed ? 'grey' : ''">
                        <v-checkbox @change="changesMade = true" class="justify-center" hide-details
                                    v-model="props.item.subscribe_to_update"></v-checkbox>
                    </td>
                    <td class="text-md-center" :class="props.item.removed ? 'grey' : ''">
                        <datePicker @saveTime="saveTime($event, props.item)" :index="props.index"
                                    :intervals="props.item.intervals"
                                    :frequency="props.item.frequency"
                                    :intervalStr="getIntervalStr(props.item)"></datePicker>
                    </td>
                    <td class="text-md-center" :class="props.item.removed ? 'grey' : ''">
                        <v-checkbox @change="changesMade = true" class="justify-center" hide-details
                                    v-model="props.item.in_use"></v-checkbox>
                    </td>
                    <td class="text-md-center" :class="props.item.removed ? 'grey' : ''">
                        <v-select
                            v-model="props.item.region"
                            @change="changesMade = true"
                            :items="['MSK', 'UrFO', 'KZ']"
                        ></v-select>
                    </td>
                    <td class="text-md-center" :class="props.item.removed ? 'grey' : ''">
                        <v-icon small @click="getHistory(props)">history</v-icon>
                        <v-icon small @click="deleteItem(props.item)">delete</v-icon>
                    </td>
                </template>
                <template slot="expand" slot-scope="props">
                    <v-data-table hide-actions hide-headers slot="input" :items="props.item.expandLog">
                        <template slot="items" slot-scope="props">
                            <td :class="props.item.success ? 'green lighten-5' : 'red lighten-5'">{{new
                                Date(props.item.date).toLocaleString()}}
                            </td>
                        </template>
                    </v-data-table>
                </template>
            </v-data-table>
        </v-flex>
    </div>
</template>

<script>
    import datePicker from '../forms/date-picker'
    import receivers from '../forms/receivers'
    import senders from '../forms/senders'
    import convert_rules from '../forms/convert_rules'
    import {mapGetters} from 'vuex'

    export default {
        name: "rules",
        data() {
            return {
                defaultItem: {
                    rule_name: '',
                    sender: '',
                    subscribe_to_update: false,
                    result_name: '',
                    in_use: true,
                    intervals: [],
                    frequency: {days: 0, hours: 0, minutes: 0},
                    sender_name: '',
                    title: '',
                    templates: [],
                    templatesComp: [],
                    receivers: [],
                    receiversComp: [],
                    removed: false,
                    expandLog: [],
                    statusBar: []
                },
                data: null,
                changesMade: false,
                send_rules: [],
                thisReceiver: '',
                thisNum: 0,
                headers: [
                    {text: 'Прайс', align: 'center', value: 'rule_name'},
                    {text: 'Почта отправитель', align: 'center', value: 'sender'},
                    {text: 'Имя файла', align: 'center', value: 'resultName'},
                    {text: 'Тема письма', align: 'center', value: 'title'},
                    {text: 'Шаблоны', align: 'center', value: 'templates'},
                    {text: 'Получатели', align: 'center', value: 'receivers'},
                    {text: 'Отслеживать', align: 'center', value: 'subscribeToUpdate'},
                    {text: 'Частота отправки', align: 'center', value: 'frequency'},
                    {text: 'Использовать', align: 'center', value: 'inUse'},
                    {text: 'Регион', align: 'center', value: 'region'},
                    {text: 'Удалить', align: 'center', value: true}
                ],
                showSetPrices: false,
                mailTransport: null,
                refreshInterval: null,
                select: [],
            }
        },
        components: {datePicker, receivers, convert_rules, senders},
        methods: {
            getTemplateStr(templates) {
                let str = '';
                templates.forEach(t => {
                    str += t.name + ', '
                });
                return str.substring(0, str.length - 2)
            },
            getReceiverStr(receivers) {
                let str = '';
                receivers.forEach(t => {
                    str += t.name + ', '
                });
                return str.substring(0, str.length - 2)
            },
            async selectSenders(evt, item) {
                let sendersComp = await this.getSendersComp(1);
                evt.forEach(e => {
                    this.send_rules[this.send_rules.indexOf(item)].sender_name = sendersComp.filter(send => send.id === e.id)[0].name;
                    this.send_rules[this.send_rules.indexOf(item)].sender = e.id;
                });
                this.changesMade = true;

            },
            selectConvertRules(evt, item) {
                let templatesCompColumn = [];
                let idColumn = [];
                console.log(evt.map(e => e.id))
                evt.forEach(e => {
                    templatesCompColumn.push({id: e.id, name: e.name});
                    idColumn.push(e.id);
                });
                this.send_rules[this.send_rules.indexOf(item)].templatesComp = templatesCompColumn;
                this.send_rules[this.send_rules.indexOf(item)].templates = idColumn;
                this.changesMade = true;
            },
            selectReceivers(evt, item) {
                let receiversCompColumn = [];
                let newReceiverColumn = [];
                evt.forEach(e => {
                    newReceiverColumn.push({name: e.name});
                    receiversCompColumn.push(e.id);
                });
                this.send_rules[this.send_rules.indexOf(item)].receiversComp = newReceiverColumn;
                this.send_rules[this.send_rules.indexOf(item)].receivers = receiversCompColumn;
                this.changesMade = true;
            },
            getIntervalStr(item) {
                let intervalStr = '';
                if (item.intervals.length > 0) {
                    item.intervals.forEach(val => {
                        intervalStr += new Date(val).toLocaleTimeString() + ' '
                    })
                } else {
                    intervalStr =
                        (item.frequency.days ? item.frequency.days +
                            (item.frequency.days < 2 ? ' день ' : item.frequency.days < 5 ? ' дня ' : ' дней ') : '') +
                        (item.frequency.hours ? item.frequency.hours +
                            (item.frequency.hours < 2 ? ' час ' : item.frequency.hours < 5 ? ' часа ' : ' часов ') : '') +
                        (item.frequency.minutes ? item.frequency.minutes +
                            (item.frequency.minutes < 2 ? ' минута ' : item.frequency.minutes < 5 ? ' минуты ' : ' минут ') : '')
                }
                return intervalStr;
            },
            addItem() {
                this.send_rules.push(this.defaultItem);
                this.changesMade = true;
            },
            deleteItem(item) {
                item.removed = true;
                this.$set(this.send_rules, this.send_rules.indexOf(item), item);
                this.changesMade = true;
            },

            updateTable() {
                this.$store.dispatch('CHANGE_TABLE', {data: this.send_rules})
                    .then(() => {
                        this.alertDialog = true;
                        this.$socket.emit("loadTable", {
                            token: this.getToken,
                            username: this.getUsername,
                            region: this.getRegion
                        })
                    })
            },

            saveTime(evt, item) {
                item.intervals = evt.intervals;
                item.frequency = evt.frequency;
                this.changesMade = true;
            },

            getHistory(props) {
                props.expanded = !props.expanded;
                this.$store.dispatch('GET_SEND_LOG', {rule: props.item.id, columns: 7})
                    .then(result => {
                        this.send_rules.filter(send => send.id === props.item.id)[0].expandLog = result.data;
                    })
            },
            quit(){
                this.$store.dispatch('AUTH_LOGOUT')
            }
        },
        sockets: {
            async loadTableAnswer(answer) {

                let ConvertRulesComp = await this.getConvertRulesComp(1);
                let sendersComp = await this.getSendersComp(1);
                let receiversComp = await this.getReceiversComp(1);
                this.send_rules = [];
                answer.table.forEach(tab => {

                    tab.templatesComp = [];
                    tab.templates.forEach(template => {
                        tab.templatesComp.push(ConvertRulesComp.filter(comp => comp.id === template)[0]);
                    });
                    tab.receiversComp = [];
                    tab.receivers.forEach(receive => {
                        tab.receiversComp.push(receiversComp.filter(rec => rec.id === receive)[0]);
                    });
                    this.send_rules.push({
                        rule_name: tab['rule_name'],
                        sender: tab.sender,
                        id: tab.id,
                        subscribe_to_update: tab.subscribe_to_update,
                        result_name: tab.result_name,
                        in_use: tab.in_use,
                        intervals: tab.intervals === null ? [] : tab.intervals,
                        frequency: tab.frequency === null ? {days: 0, hours: 0, minutes: 0} : tab.frequency,
                        sender_name: sendersComp.filter(send => send.id === tab.sender)[0].name,
                        title: tab.title,
                        region: tab.region,
                        templates: tab.templates,
                        templatesComp: tab.templatesComp,
                        receivers: tab.receivers,
                        receiversComp: tab.receiversComp,
                        removed: tab.removed,
                        expandLog: [],
                        statusBar: []
                    });
                });
            },
            async updateSendLog(answer) {
                if (answer.log.length > 0) {
                    let filtered_rules = this.send_rules.filter(send => send.id === answer.log[0].send_rule);
                    if (filtered_rules.length > 0) filtered_rules[0].statusBar = [];
                    answer.log.forEach(log => {
                        if (filtered_rules.length > 0) filtered_rules[0].statusBar.push(log.success);
                    })
                }
            }
        },
        computed:
            mapGetters([
                'getConvertRulesComp',
                'getSendersComp',
                'getReceiversComp',
                'getUsername',
                'getToken',
                'getRegion'
            ])
    }

</script>

<style scoped>
</style>
