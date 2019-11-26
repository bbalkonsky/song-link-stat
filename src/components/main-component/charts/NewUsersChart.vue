<template>
    <div class="new-users" v-if="logLoaded">
        <IEcharts :option="options" @click="$emit('on-chart-click', $event)"/>
    </div>
</template>

<script>
    import axios from 'axios'
    import IEcharts from 'vue-echarts-v3/src/full.js';

    export default {
        name: "NewUsers",
        components: {
            IEcharts
        },
        props: {
            period: String,
            chartsColor: String
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
                axios.get(`http://80.211.14.35/usersFirst/${this.period}`)
                    .then(response => this.getNewUsers(response.data))
                    .then(() => this.logLoaded = true)
            },
            getNewUsers(rawLog) {
                this.usersSignUp = rawLog;

                this.getUniqChart();
                this.periodChanged();
            },
            getUniqChart() {
                this.options = {
                    color: [this.chartsColor, '#555555'],
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
                            data : this.usersSignUp.map(item => item.time),
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
                            data: this.usersSignUp.map(item => item.count)
                        }
                    ]
                };

                this.logLoaded = true;
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
        height: 300px;
    }
</style>