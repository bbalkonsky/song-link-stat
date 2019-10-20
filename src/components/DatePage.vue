<template>
    <div class="date-page">
        <b-button
                tag="router-link"
                to="/"
                type="is-link">
            Go back
        </b-button>

        <h1>{{today}}</h1>

        <template v-if="dayLog.length">
            <b-table :data="dayLog" :columns="columns"></b-table>

            <day-types
                    :log-slice="dayLog">
            </day-types>

            <day-services
                    :log-slice="dayLog">
            </day-services>
        </template>

        <b-loading :active="!dayLog.length"></b-loading>
    </div>
</template>

<script>
    import axios from 'axios';
    import DayTypes from "@/components/DayTypes";
    import DayServices from "@/components/DayServices";

    export default {
        name: "DatePage",
        components: {
            DayTypes,
            DayServices
        },
        data: () => ({
            dayLog: [],
            today: '',
            columns: [
                { field: 'id', label: 'id'},
                { field: 'username', label: 'username'},
                { field: 'name', label: 'name'},
                { field: 'surname', label: 'surname'},
                { field: 'language', label: 'language'},
                { field: 'time', label: 'time'},
                { field: 'service', label: 'service'},
                { field: 'type', label: 'type'}
            ]
        }),
        methods: {
            parseJson(json) {
                this.getFullData(json.split("', '"))
            },
            getFullData(rawArray) {
                rawArray.forEach(item => {
                    const oneLog = item.split(' | ');
                    const parseDate = oneLog[8].split(' ');

                    if (parseDate[0] != this.today) return;

                    this.dayLog.push(
                        {
                            type: oneLog[0],
                            id: oneLog[1],
                            username: oneLog[2],
                            name: oneLog[3],
                            surname: oneLog[4],
                            groupId: oneLog[5],
                            groupTitle: oneLog[6],
                            language: oneLog[7],
                            date: parseDate[0],
                            time:parseDate[1],
                            service: oneLog[9] == 'itunes' ? 'music.apple' : oneLog[9],
                            query: oneLog[10]
                        }
                    );
                });
            },
        },
        created() {
            axios.get('data.json').then(response => this.parseJson(response.data.logs));
            this.today = this.$route.params.id;
        }
    }
</script>

<style scoped>

</style>