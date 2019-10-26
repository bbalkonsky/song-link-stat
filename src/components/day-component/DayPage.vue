<template>
    <div class="date-page">
        <header-hero :is-sub-page="true" :sub-page-header="today" :sub-page-sub-header="'smth'"></header-hero>

        <div class="container">
            <div class="columns is-multiline">
                <template v-if="dayLog.length">
                    <div class="column is-half">
                        <day-types-chart :log-slice="dayLog"></day-types-chart>
                    </div>
                    <div class="column is-half">
                        <day-services-chart :log-slice="dayLog"></day-services-chart>
                    </div>

                    <div class="column is-full">
                        <b-table :data="dayLog" :striped="true" :hoverable="true">
                            <template slot-scope="props">
                                <b-table-column field="id" label="ID" width="100" sortable>
                                    <b-button tag="router-link"
                                              :to="'/user/' + props.row.id"
                                              type="is-light" inverted outlined>
                                        {{props.row.id}}
                                    </b-button>
                                </b-table-column>
                                <b-table-column field="username" label="Username" sortable>
                                    {{ props.row.username }}
                                </b-table-column>
                                <b-table-column field="name" label="Name" sortable>
                                    {{ props.row.name }}
                                </b-table-column>
                                <b-table-column field="surname" label="Surname" sortable>
                                    {{ props.row.surname }}
                                </b-table-column>
                                <b-table-column field="language" label="Language" sortable>
                                    {{ props.row.language }}
                                </b-table-column>
                                <b-table-column field="time" label="Time" sortable>
                                    {{ props.row.time }}
                                </b-table-column>
                                <b-table-column field="service" label="Service" sortable>
                                    {{ props.row.service }}
                                </b-table-column>
                                <b-table-column field="type" label="Type" sortable>
                                    {{ props.row.type }}
                                </b-table-column>
                            </template>
                        </b-table>
                    </div>
                </template>
            </div>
        </div>

        <b-loading :active="!dayLog.length"></b-loading>
    </div>

</template>

<script>
    import axios from 'axios';
    import DayTypesChart from "@/components/day-component/charts/DayTypesChart";
    import DayServicesChart from "@/components/day-component/charts/DayServicesChart";
    import HeaderHero from "@/components/HeaderHero";

    export default {
        name: "DatePage",
        components: {
            DayTypesChart,
            DayServicesChart,
            HeaderHero
        },
        data: () => ({
            dayLog: [],
            today: ''
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