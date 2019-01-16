<template>

    <div class="h-100">
        <v-flex md4>
            <v-img
                src="static/img/logo/logo_all_planeta.png"
            ></v-img>

        </v-flex>
        <div>
            <v-data-table data-app :headers="headers" :items="send_rules">
                <template slot="items" slot-scope="props">
                    <td>{{ props.item.ruleName }}</td>
                    <td class="text-md-center">{{ props.item.sender }}</td>
                    <td class="text-md-center">{{ props.item.resultName }}</td>
                    <td class="text-md-center">{{ props.item.receivers.join(', ') }}</td>
                    <td class="text-md-center">{{ props.item.subscribeToUpdate }}</td>
                    <td class="text-md-center"><datePicker v-model="props.item.frequency"></datePicker></td>
                    <td class="text-md-center">{{ props.item.inUse }}</td>
                    <td class="text-md-center px-2">
                        <v-icon small  @click="deleteItem(props.item)">delete</v-icon>
                    </td>
                </template>
            </v-data-table>
        </div>
    </div>
</template>

<script>
    import datePicker from '../forms/date-picker'
    export default {
        name: "Receivers",
        data() {
            return {
                data: null,
                send_rules: [],
                thisReceiver: '',
                thisNum: 0,
                headers: [
                    {text: 'Прайс', align: 'center', value: 'ruleName'},
                    {text: 'Почта отправитель', align: 'center', value: 'sender'},
                    {text: 'Имя файла', align: 'center', value: 'resultName'},
                    {text: 'Получатели', align: 'center', value: 'receivers'},
                    {text: 'Отслеживать', align: 'center', value: 'subscribeToUpdate'},
                    {text: 'Частота отправки', align: 'center', value: 'frequency'},
                    {text: 'Использовать', align: 'center', value: 'inUse'},
                    {text: 'Удалить', align: 'center', value: true}
                ],
                showSetPrices: false,
                mailTransport: null,
                refreshInterval: null
            }
        },
        components: {datePicker},
        methods: {
            deleteItem(item) {
                const index = this.receivers.indexOf(item);
                this.receivers.splice(index, 1)
            }
        },
        sockets: {
            loadTableAnswer(answer) {
                console.log(answer)
                answer.table.forEach(tab => {
                    this.send_rules.push({
                        ruleName: tab['rule_name'],
                        sender: tab.sender,
                        resultName: tab['result_name'],
                        receivers: tab.receivers,
                        subscribeToUpdate: tab['subscribe_to_update'],
                        inUse: tab['in_use'],
                        frequency: tab.frequency
                    })
                });
                console.log(this.send_rules)
            }
        }
    }

</script>

<style scoped>
</style>
