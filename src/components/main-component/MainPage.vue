<template>
    <div class="main-page">
        <header-hero @period-changed="dropdownClickHandler" @header-color="headerColorHandler($event)"/>

        <error-page v-if="false">

        </error-page>

        <div class="container" v-if="true">
            <div class="columns is-multiline">
                <template v-if="logLoaded">
                    <div class="column is-half">
                        <h4 class="title is-4">Unique users</h4>
                        <uniq-users-chart
                                :log="parsedLog"
                                :period="period"
                                :chartsColor="chartsColor"
                                @on-chart-click="onChartClickHandler">
                        </uniq-users-chart>
                    </div>
                </template>
                <template v-if="logLoaded">
                    <div class="column is-half">
                        <h4 class="title is-4">New users</h4>
                        <new-users-chart
                                :period="period"
                                :chartsColor="chartsColor"
                                @on-chart-click="onChartClickHandler">
                        </new-users-chart>
                    </div>
                </template>

                <template v-if="logLoaded">
                    <div class="column is-full">
                        <h4 class="title is-4">
                            <section style="display: inline-block; height: 0;">
                                <b-field>
                                    <b-radio-button :type=headerColorType
                                                    v-model="dayCountRadio"
                                                    name="name"
                                                    native-value="count-by-date-chart">
                                        Summ
                                    </b-radio-button>
                                    <b-radio-button :type=headerColorType
                                                    v-model="dayCountRadio"
                                                    name="name"
                                                    native-value="services-by-date-chart">
                                        Services
                                    </b-radio-button>
                                    <b-radio-button :type=headerColorType
                                                    v-model="dayCountRadio"
                                                    name="name"
                                                    native-value="types-by-date-chart">
                                        Types
                                    </b-radio-button>
                                    <b-radio-button :type=headerColorType
                                                    v-model="dayCountRadio"
                                                    name="name"
                                                    native-value="average-by-week-chart">
                                        Week avg.
                                    </b-radio-button>
                                </b-field>
                            </section>
                        </h4>

                        <keep-alive>
                            <component :is="dayCountRadio"
                                       :log="parsedLog"
                                       :period="period"
                                       :chartsColor="chartsColor"
                                  @on-chart-click="onChartClickHandler">
                            </component>
                        </keep-alive>
                    </div>
                </template>
            </div>
        </div>
        <b-loading :active="!logLoaded"></b-loading>
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

    import ErrorPage from "@/components/ErrorPage";

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

            ErrorPage
        },
        data: () => ({
            parsedLog: [],
            newUsersLoadReady: false,
            logLoaded: false,
            dayCountRadio: 'count-by-date-chart',
            period: 'month',
            headerColorType: 'is-info',
            chartsColor: '#3298dc',
            headerColors: {
                'is-info': '#0386d3',
                'is-success': '#48c774',
                'is-warning': '#ffb227',
                'is-danger': '#ff0761',
                'is-dark': '#363636'
            }
        }),
        methods: {
            getFullData(rawLog) {
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
                            service: item.service === 'music.apple' ? 'appleMusic' : item.service === 'itunes' ? 'appleMusic' : item.service === 'music.youtube' ? 'youtubeMusic' : item.service,
                            query: item.query
                        }
                    );
                });
            },
            onChartClickHandler: function (event) {
                this.$router.push(`/day/${event.name}`);
            },
            dropdownClickHandler: function (event) {
                this.logLoaded = false;
                this.parsedLog = [];
                this.period = event;
                this.getDataFromServer(event);
            },
            getDataFromServer(period) {
                axios.get(`http://80.211.14.35/period/${period}`)
                    .then(response => this.getFullData(response.data))
                    .then(() => this.logLoaded = true)
            },
            headerColorHandler(color) {
                this.chartsColor = this.headerColors[color];
                this.headerColorType = color;
            }
        },
        created() {
            this.getDataFromServer('month');
        },
    };
</script>

<style scoped>

</style>