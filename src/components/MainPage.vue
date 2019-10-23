<template>
    <div class="main-page">
        <div class="columns is-multiline">
            <template v-if="byDateChartsLoadReady">
                <div class="column is-half">
                    <uniq-users
                            :uniq-users-by-date="uniqUsersByDate"
                            @on-chart-click="onChartClickHandler">
                    </uniq-users>
                </div>
            </template>
            <template v-if="newUsersLoadReady">
                <div class="column is-half">
                    <new-users
                            :log-file="usersSignUp"
                            @on-chart-click="onChartClickHandler">
                    </new-users>
                </div>
            </template>
            <template v-if="byDateChartsLoadReady">
                <div class="column is-half">
                    <types-by-date
                          :types="types"
                          :dates="dates"
                          :types-by-date="typesByDate"
                          @on-chart-click="onChartClickHandler">
                    </types-by-date>
                </div>
            </template>
            <template v-if="byDateChartsLoadReady">
                <div class="column is-half">
                    <services-by-date
                          :services="services"
                          :dates="dates"
                          :services-by-date="servicesByDate"
                          @on-chart-click="onChartClickHandler">
                    </services-by-date>
                </div>
            </template>
        </div>
        <b-loading :active="!byDateChartsLoadReady || !newUsersLoadReady"></b-loading>
    </div>
</template>

<script type="text/babel">
    import axios from 'axios'
    import NewUsers from "@/components/NewUsers";
    import TypesByDate from "@/components/TypesByDate";
    import ServicesByDate from "@/components/ServicesByDate";
    import UniqUsers from "@/components/UniqUsers";

    export default {
        name: 'MainPage',
        components: {
            UniqUsers,
            NewUsers,
            TypesByDate,
            ServicesByDate,
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
                this.$router.push(`/date/${event.name}`)
            }

        },
        created() {
            axios.get('http://127.0.0.1:5000/').then(response => this.getFullData(response.data));
        },
    };
</script>

<style scoped>

</style>