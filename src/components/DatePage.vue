<template>
    <div class="date-page">
        <div class="columns is-multiline">
            <div class="column is-full">
                <b-button
                        tag="router-link"
                        to="/"
                        type="is-link">
                    Go back
                </b-button>

                <h1>{{today}}</h1>
            </div>

            <template v-if="dayLog.length">
                <div class="column is-full">
                    <b-table :data="dayLog" :columns="columns"></b-table>
                </div>
                <div class="column is-half">
                    <day-types :log-slice="dayLog"></day-types>
                </div>
                <div class="column is-half">
                    <day-services :log-slice="dayLog"></day-services>
                </div>
            </template>
        </div>

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
            getFullData(rawArray) {
                rawArray.forEach(item => {
                    const parseDate = item.time.split(' ');
                    this.dayLog.push(
                        {
                            type: item.type,
                            id: item.user_id,
                            username: item.username,
                            name: item.first_name,
                            surname: item.last_name,
                            groupId: item.chat_id,
                            groupTitle: item.chat_title,
                            language: item.language,
                            date: parseDate[0],
                            time:parseDate[1],
                            service: item.service == 'itunes' ? 'music.apple' : item.service,
                            query: item.query
                        }
                    );
                });
            },
        },
        created() {
            this.today = this.$route.params.id;
            axios.get(`http://127.0.0.1:5000/day/${this.today}`).then(response => this.getFullData(response.data));
        }
    }
</script>

<style scoped>

</style>