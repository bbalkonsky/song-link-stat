<template>
    <div class="new-users" v-if="logLoaded">
        <IEcharts :option="options" @click="$emit('on-chart-click', $event)"/>
    </div>
</template>

<script>
    import axios from 'axios'
    import IEcharts from 'vue-echarts-v3/src/full.js';
    import date from 'date-and-time';

    export default {
        name: "NewUsers",
        components: {
            IEcharts
        },
        props: {
            period: String
        },
        watch: {
            period: () => {
            }
        },
        data: () => ({
            options: {},
            usersSignUp: {},
            logLoaded: false,
            fittedUsersSignUp: []
        }),
        created() {
            this.getDataFromServer();
        },
        methods: {
            getDataFromServer() {
                axios.get(`http://80.211.14.35/period/year`)
                    .then(response => this.getNewUsers(response.data))
                    .then(() => this.logLoaded = true)
            },
            getNewUsers(rawLog) {
                rawLog.forEach(item => {
                    if (!this.usersSignUp[item.user_id]) {
                        this.usersSignUp[item.user_id] = item.time.split(' ')[0];
                        // this.usersSignUp[item.user_id] = new Date(item.time);
                    }
                });

                this.getUniqChart();
                this.periodChanged();
            },
            getUniqChart() {
                let newUsersByDate = [];
                for (let key in this.usersSignUp) {
                    const uniqDate =  newUsersByDate.find(uniq => uniq.date === this.usersSignUp[key] );
                    if (uniqDate) {
                        uniqDate.count++;
                    } else {
                        newUsersByDate.push({
                            date: this.usersSignUp[key],
                            count: 1
                        });
                    }
                }

                if (this.period === 'month') {
                    newUsersByDate = this.filterData(newUsersByDate, 30);
                } else if (this.period === 'week') {
                    newUsersByDate = this.filterData(newUsersByDate, 7);
                }

                newUsersByDate.sort((a, b) => {
                    const aDate = Date.parse(`${a.date.split('.')[2]}-${a.date.split('.')[1]}-${a.date.split('.')[0]}`);
                    const bDate = Date.parse(`${b.date.split('.')[2]}-${b.date.split('.')[1]}-${b.date.split('.')[0]}`);
                    return aDate > bDate ? 1 : -1;
                });
                this.options = {
                    // color: ['#3398DB'],
                    tooltip : {
                        trigger: 'axis',
                        axisPointer : {
                            type : 'shadow'
                        }
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis : [
                        {
                            type : 'category',
                            data : newUsersByDate.map(item => item.date),
                            axisTick: {
                                alignWithLabel: true
                            }
                        }
                    ],
                    yAxis : [
                        {
                            type : 'value'
                        }
                    ],
                    series : [
                        {
                            name:'new users',
                            type:'bar',
                            barWidth: '60%',
                            data: newUsersByDate.map(item => item.count)
                        }
                    ]
                };

                this.logLoaded = true;
            },
            filterData(list, days) {
                let now = date.addDays(new Date(), -days).getTime();
                return list.filter(item => date.parse(item.date, 'YYYY-MM-DD').getTime() > now);
            },
            periodChanged() {
                // const now = new Date();
                // now.setDate(now.getDate() - 30);
                //
                // this.fittedUsersSignUp = this.usersSignUp.filter(user => {
                //     const userDate = date.parse(user, 'YYYY-MM-DD');
                //
                //     // eslint-disable-next-line no-console
                //     console.log( userDate >= now);
                // });
            }
        }
    }
</script>

<style scoped>
    .new-users {
        width: 100%;
        height: 500px;
    }
</style>