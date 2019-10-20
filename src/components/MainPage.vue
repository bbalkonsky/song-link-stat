<template>
    <div class="main-page">
        <template v-if="newUsersLoadReady">
          <new-users
                  :log-file="usersSignUp"
                  @on-chart-click="onChartClickHandler">
          </new-users>
        </template>
        <template v-if="byDateChartsLoadReady">
          <types-by-date
                  :types="types"
                  :dates="dates"
                  :types-by-date="typesByDate"
                  @on-chart-click="onChartClickHandler">
          </types-by-date>
        </template>
        <template v-if="byDateChartsLoadReady">
          <services-by-date
                  :services="services"
                  :dates="dates"
                  :services-by-date="servicesByDate"
                  @on-chart-click="onChartClickHandler">
          </services-by-date>
        </template>

        <b-loading :active="!byDateChartsLoadReady || !newUsersLoadReady"></b-loading>
    </div>
</template>

<script type="text/babel">
    import axios from 'axios'
    import NewUsers from "@/components/NewUsers";
    import TypesByDate from "@/components/TypesByDate";
    import ServicesByDate from "@/components/ServicesByDate";

    export default {
        name: 'MainPage',
        components: {
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
            byDateChartsLoadReady: false

        }),
        methods: {
            parseJson(json) {
                this.getFullData(json.split("', '"))
            },
            getFullData(rawArray) {
                rawArray.forEach(item => {
                    const oneLog = item.split(' | ');
                    const parseDate = oneLog[8].split(' ')[0];

                    this.normLog.push(
                        {
                            type: oneLog[0],
                            id: oneLog[1],
                            username: oneLog[2],
                            name: oneLog[3],
                            surname: oneLog[4],
                            groupId: oneLog[5],
                            groupTitle: oneLog[6],
                            language: oneLog[7],
                            date: parseDate,
                            service: oneLog[9] == 'itunes' ? 'music.apple' : oneLog[9],
                            query: oneLog[10]
                        }
                    );
                    if (!this.usersSignUp[oneLog[1]]) {
                        this.usersSignUp[oneLog[1]] = parseDate;
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
                });
                this.byDateChartsLoadReady = true;
            },
            onChartClickHandler: function (event) {
                this.$router.push(`/date/${event.name}`)
            }

        },
        created() {
            axios.get('data.json').then(response => this.parseJson(response.data.logs))
        }
    };
</script>

<style scoped>

</style>