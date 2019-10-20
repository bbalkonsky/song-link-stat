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
            parseJson(json) {
                this.getFullData(json.split("', '"))
            },
            getFullData(rawArray) {
                rawArray.forEach(item => {
                    const oneLog = item.split(' | ');
                    const parseDate = oneLog[8].split(' ');

                    if (oneLog[1] != this.user) return;

                    this.userLog.push(
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
                            service: oneLog[9] == 'itunes' ? 'music.apple' : oneLog[9],
                            query: oneLog[10]
                        }
                    );
                });
            },
        },
        created() {
            axios.get('data.json').then(response => this.parseJson(response.data.logs));
            this.user = this.$route.params.id;
        }
    }
</script>

<style scoped>

</style>