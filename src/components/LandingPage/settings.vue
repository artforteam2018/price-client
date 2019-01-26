<template xmlns="http://www.w3.org/1999/html">
    <div class="h-100">
        <v-flex md10 offset-md1>
                    <v-list v-for="key in Object.keys(settings)" :key="key" three-line subheader>
                        <v-subheader>{{key}}</v-subheader>
                        <v-divider class="mb-3"></v-divider>

                        <v-layout wrap>
                        <v-list-tile avatar v-for="set in settings[key]" :key="set.name">
                            <v-list-tile-content>
                                <v-text-field :label="set.name" :hint="set.hint" persistent-hint v-model="set.param"></v-text-field>
                            </v-list-tile-content>
                        </v-list-tile>
                        </v-layout>
                    </v-list>
            <v-layout row>
                <v-btn flat @click="$emit('save',settings)">Сохранить</v-btn>
            </v-layout>
        </v-flex>
    </div>
</template>

<script>
    export default {
        name: "settings",
        props: ['settings'],
    }
</script>

<style scoped>

</style>
