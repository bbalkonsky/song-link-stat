<template>
    <div class="user-page">
        <b-button
                tag="router-link"
                to="/"
                type="is-link">
            Go back
        </b-button>

        <h1>{{user}}</h1>

        <template v-if="userLog.length">
            <b-table :data="userLog" :columns="columns"></b-table>
        </template>

        <b-loading :active="!userLog.length"></b-loading>
    </div>
</template>

<script>
    import axios from 'axios';

    export default {
        name: "UserPage",
        data: () => ({
            userLog: [],
            user: '',
            columns: [
                { field: 'username', label: 'username'},
                { field: 'name', label: 'name'},
                { field: 'surname', label: 'surname'},
                { field: 'language', label: 'language'},
                { field: 'date', label: 'date'},
                { field: 'service', label: 'service'},
                { field: 'type', label: 'type'},
                { field: 'query', label: 'query'}
            ]
        }),
        methods: {
            getFullData(rawArray) {
                rawArray.forEach(item => {
                    const parseDate = item.time.split(' ');
                    this.userLog.push(
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
            this.user = this.$route.params.id;
            axios.get(`http://127.0.0.1:5000/user/${this.user}`).then(response => this.getFullData(response.data));
        }
    }
</script>

<style scoped>

</style>