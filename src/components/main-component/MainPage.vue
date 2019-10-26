<template>
    <div class="main-page">
        <header-hero></header-hero>

        <div class="container">
            <div class="columns is-multiline">
                <template v-if="byDateChartsLoadReady">
                    <div class="column is-half">
                        <h4 class="title is-4">Unique users</h4>
                        <uniq-users-chart
                                :uniq-users-by-date="uniqUsersByDate"
                                @on-chart-click="onChartClickHandler">
                        </uniq-users-chart>
                    </div>
                </template>
                <template v-if="newUsersLoadReady">
                    <div class="column is-half">
                        <h4 class="title is-4">New users</h4>
                        <new-users-chart
                                :log-file="usersSignUp"
                                @on-chart-click="onChartClickHandler">
                        </new-users-chart>
                    </div>
                </template>
                <template v-if="byDateChartsLoadReady">
                    <div class="column is-half">
                        <h4 class="title is-4">Chat types</h4>
                        <types-by-date-chart
                              :types="types"
                              :dates="dates"
                              :types-by-date="typesByDate"
                              @on-chart-click="onChartClickHandler">
                        </types-by-date-chart>
                    </div>
                </template>
                <template v-if="byDateChartsLoadReady">
                    <div class="column is-half">
                        <h4 class="title is-4">Service types</h4>
                        <services-by-date-chart
                              :services="services"
                              :dates="dates"
                              :services-by-date="servicesByDate"
                              @on-chart-click="onChartClickHandler">
                        </services-by-date-chart>
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
    import TypesByDateChart from "@/components/main-component/charts/TypesByDateChart";
    import ServicesByDateChart from "@/components/main-component/charts/ServicesByDateChart";
    import UniqUsersChart from "@/components/main-component/charts/UniqUsersChart";
    import HeaderHero from "@/components/HeaderHero";

    export default {
        name: 'MainPage',
        components: {
            HeaderHero,
            UniqUsersChart,
            NewUsersChart,
            TypesByDateChart,
            ServicesByDateChart,
        },
        data: () => ({
            normLog: [],
            usersSignUp: {},
            newUsersLoadReady: false,
            types: [],
            services: [],
            dates: [],
            typesByDate: [],
            servicesByDate: [],
            byDateChartsLoadReady: false,
            uniqUsersByDate: []
        }),
        methods: {
            getFullData(rawArray) {
                rawArray.forEach(item => {
                    const parseDate = item.time.split(' ')[0];
                    this.normLog.push(
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
                    if (!this.usersSignUp[item.user_id]) {
                        this.usersSignUp[item.user_id] = parseDate;
                    }
                });

                this.newUsersLoadReady = true;
                this.getMetaDataArrays(this.normLog);
            },
            getMetaDataArrays(logArray) {
                logArray.forEach(item => {
                    if (!this.types.find(type => type == item.type)) {
                        this.types.push(item.type);
                    }
                    if (!this.services.find(service => service == item.service)) {
                        this.services.push(item.service);
                    }
                    if (!this.dates.find(date => date == item.date)) {
                        this.dates.push(item.date);
                    }

                    const type = this.typesByDate.find(type => type.type == item.type && type.date == item.date);
                    if (type) {
                        type.count++;
                    } else {
                        this.typesByDate.push({
                            type: item.type,
                            count: 1,
                            date: item.date
                        });
                    }

                    const service = this.servicesByDate.find(type => type.service == item.service && type.date == item.date);
                    if (service) {
                        service.count++;
                    } else {
                        this.servicesByDate.push({
                            service: item.service,
                            count: 1,
                            date: item.date
                        });
                    }

                    const uniqUsers = this.uniqUsersByDate.find(uniq => uniq.date == item.date);
                    if (uniqUsers) {
                        if (!uniqUsers.users.includes(item.id)) {
                            uniqUsers.users.push(item.id);
                        }
                    } else {
                        this.uniqUsersByDate.push({
                            date: item.date,
                            users: [item.id]
                        });
                    }
                });
                this.byDateChartsLoadReady = true;
            },
            onChartClickHandler: function (event) {
                this.$router.push(`/day/${event.name}`)
            }

        },
        created() {
            axios.get('http://127.0.0.1:5000/').then(response => this.getFullData(response.data));
        },
    };
</script>

<style scoped>

</style>