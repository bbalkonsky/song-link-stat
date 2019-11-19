<template>
    <div class="user-page">
        <template v-if="userLog.length">
            <header-hero
                    :is-sub-page="true"
                    :sub-page-header="userLog[userLog.length - 1].username"
                    :sub-page-sub-header="userLog[userLog.length - 1].name + ' ' + userLog[userLog.length - 1].surname">
            </header-hero>
        </template>

        <div class="container">
            <user-dates-chart :dates="dates" :user-log="userLog" @on-chart-click="onChartClickHandler"/>

            <template v-if="userLog.length">
                <b-table :data="userLog"
                         :striped="true"
                         :hoverable="true"
                         :paginated="isPaginated"
                         :per-page="perPage"
                         :current-page.sync="currentPage"
                         :pagination-position="paginationPosition">
                    <template slot-scope="props">
                        <b-table-column field="date" label="Date" sortable>
                            <b-button tag="router-link"
                                      :to="'/day/' + props.row.date"
                                      type="is-light" inverted outlined>
                                {{props.row.date}}
                            </b-button>
                        </b-table-column>
                        <b-table-column field="service" label="Service" sortable>
                            <span class="tag" :class="getTagClass(props.row.service)">
                                {{ props.row.service }}
                            </span>
                        </b-table-column>
                        <b-table-column field="type" label="Type" sortable>
                            {{ props.row.type }}
                        </b-table-column>
                        <b-table-column field="query" label="Query">
                            {{ props.row.query }}
                        </b-table-column>
                    </template>
                </b-table>
            </template>
        </div>

        <b-loading :active="!userLog.length"></b-loading>
    </div>
</template>

<script>
    import axios from 'axios';
    import HeaderHero from "@/components/HeaderHero";
    import UserDatesChart from "@/components/user-component/charts/UserDatesChart";

    export default {
        name: "UserPage",
        components: {
            UserDatesChart,
            HeaderHero
        },
        data: () => ({
            userLog: [],
            user: '',
            dates: [],
            chartsData: [],
            options: {},
            isChartReadyToShow: false,
            isPaginated: true,
            paginationPosition: 'bottom',
            currentPage: 1,
            perPage: 7
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
                    if (!this.dates.includes(parseDate[0])) {
                        this.dates.push(parseDate[0])
                    }
                });
            },
            onChartClickHandler: function (event) {
                this.$router.push(`/day/${event.name}`)
            },
            getTagClass(service){
                return {
                    'is-success': service == 'spotify',
                    'is-info': service == 'music.apple',
                    'is-primary': service == 'deezer',
                    'is-warning': service == 'yandex',
                    'is-danger': service == 'music.youtube' || service == 'youtube',
                    'is-dark': service == 'soundcloud',
                }
            },
        },
        created() {
            this.user = this.$route.params.id;
            axios.get(`http://80.211.14.35/user/${this.user}`).then(response => this.getFullData(response.data));
        }
    }
</script>

<style scoped>

</style>