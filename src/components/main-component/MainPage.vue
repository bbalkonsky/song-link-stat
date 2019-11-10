<template>
    <div class="main-page">
        <header-hero @period-changed="dropdownClickHandler" />

        <div class="container">
            <div class="columns is-multiline">
                <template v-if="parsedLog.length">
                    <div class="column is-half">
                        <h4 class="title is-4">Average by week</h4>
                        <average-by-week-chart
                                :log="parsedLog" />
                    </div>
                </template>

                <template v-if="byDateChartsLoadReady">
                    <div class="column is-half">
                        <h4 class="title is-4">Unique users</h4>
                        <uniq-users-chart
                                :log="parsedLog"
                                @on-chart-click="onChartClickHandler">
                        </uniq-users-chart>
                    </div>
                </template>
                <template v-if="newUsersLoadReady">
                    <div class="column is-half">
                        <h4 class="title is-4">New users</h4>
                        <new-users-chart
                                :log="parsedLog"
                                @on-chart-click="onChartClickHandler">
                        </new-users-chart>
                    </div>
                </template>

                <template v-if="byDateChartsLoadReady">
                    <div class="column is-half">
                        <h4 class="title is-4">
                            <section style="display: inline-block; height: 0;">
                                <b-field>
                                    <b-radio-button v-model="dayCountRadio"
                                                    name="name"
                                                    native-value="count-by-date-chart">
                                        Summ
                                    </b-radio-button>
                                    <b-radio-button v-model="dayCountRadio"
                                                    name="name"
                                                    native-value="services-by-date-chart">
                                        Services
                                    </b-radio-button>
                                    <b-radio-button v-model="dayCountRadio"
                                                    name="name"
                                                    native-value="types-by-date-chart">
                                        Types
                                    </b-radio-button>
                                </b-field>
                            </section>
                        </h4>

                        <keep-alive>
                            <component v-bind:is="dayCountRadio"
                                  :log="this.parsedLog"
                                  @on-chart-click="onChartClickHandler">
                            </component>
                        </keep-alive>
                    </div>
                </template>
            </div>
        </div>
        <b-loading :active="!byDateChartsLoadReady || !newUsersLoadReady"></b-loading>
    </div>
</template>

<script type="text/babel">
    import axios from 'axios'
    import NewUsersChart from "@/components/main-component/charts/NewUsersChart";
    import TypesByDateChart from "@/components/main-component/charts/by-day-charts/TypesByDateChart";
    import ServicesByDateChart from "@/components/main-component/charts/by-day-charts/ServicesByDateChart";
    import UniqUsersChart from "@/components/main-component/charts/UniqUsersChart";
    import HeaderHero from "@/components/HeaderHero";
    import AverageByWeekChart from "@/components/main-component/charts/AverageByWeekChart";
    import CountByDateChart from "@/components/main-component/charts/by-day-charts/CountByDateChart";

    export default {
        name: 'MainPage',
        components: {
            CountByDateChart,
            AverageByWeekChart,
            HeaderHero,
            UniqUsersChart,
            NewUsersChart,
            TypesByDateChart,
            ServicesByDateChart,
        },
        data: () => ({
            parsedLog: [],
            newUsersLoadReady: false,
            byDateChartsLoadReady: false,
            dayCountRadio: 'count-by-date-chart'
        }),
        methods: {
            getFullData(rawLog) {
                this.componentInitialization();

                rawLog.forEach(item => {
                    const parseDate = item.time.split(' ')[0];
                    this.parsedLog.push(
                        {
                            type: item.type,
                            id: item.user_id,
                            username: item.username,
                            name: item.first_name,
                            surname: item.last_name,
                            groupId: item.chat_id,
                            groupTitle: item.chat_title,
                            language: item.language,
                            date: parseDate,
                            service: item.service == 'itunes' ? 'music.apple' : item.service,
                            query: item.query
                        }
                    );
                });

                this.newUsersLoadReady = true;
                this.byDateChartsLoadReady = true;
            },
            onChartClickHandler: function (event) {
                this.$router.push(`/day/${event.name}`)
            },
            dropdownClickHandler: function (event) {
                this.getDataFromServer(event);
            },
            componentInitialization() {
                this.parsedLog = [];
                this.byDateChartsLoadReady = false;
                this.newUsersLoadReady = false;
            },
            getDataFromServer(period) {
                axios.get(`http://80.211.14.35/period/${period}`).then(response => this.getFullData(response.data));
            }
        },
        created() {
            this.getDataFromServer('month');
        },
    };
</script>

<style scoped>

</style>