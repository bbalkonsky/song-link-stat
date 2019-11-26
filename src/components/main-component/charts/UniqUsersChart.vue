<template>
    <div class="uniq">
        <IEcharts :option="options" @click="$emit('on-chart-click', $event)"/>
    </div>
</template>

<script>
    import IEcharts from 'vue-echarts-v3/src/full.js';

    export default {
        name: "UniqUsers",
        components: {
            IEcharts
        },
        props: {
            log: Array,
            period: String,
            chartsColor: String
        },
        watch: {
            log: function () {
                this.getUniqChart();
            }
        },
        data: () => ({
            uniqUsersByDate: [],
            options: {},
            trends: []
        }),
        mounted() {
             this.getUniqChart();
        },
        methods: {
            getUniqChart() {
                this.uniqUsersByDate = [];
                this.log.forEach(item => {
                    const uniqUsers = this.uniqUsersByDate.find(uniq => uniq.date === item.date);
                    if (uniqUsers) {
                        if (!uniqUsers.users.includes(item.id)) {
                            uniqUsers.users.push(item.id);
                            uniqUsers.count++;
                        }
                    } else {
                        this.uniqUsersByDate.push({
                            date: item.date,
                            users: [item.id],
                            count: 1
                        });
                    }
                });

                if (['month', 'year'].includes(this.period)) {
                    const period = this.period === 'month' ? 6 : 30;
                    this.trends = [];

                    this.uniqUsersByDate.forEach((item, idx) => {
                        let trend = 0;
                        if (idx > period) {
                            for (let i = idx - period; i < idx; i++) {
                                trend += this.uniqUsersByDate[i].count;
                            }
                            this.trends.push(Math.floor(trend / period));
                        } else if (idx === 0) {
                            this.trends.push(Math.floor((this.uniqUsersByDate[0].count + this.uniqUsersByDate[1].count) / 2));
                        } else {
                            for (let i = 0; i < idx; i++) {
                                trend += this.uniqUsersByDate[i].count;
                            }
                            this.trends.push(Math.floor(trend / (idx + 1)));
                        }
                    });
                }

                this.options = {
                    color: [this.chartsColor, '#555555'],
                    tooltip : {
                        trigger: 'axis',
                        axisPointer : {
                            type : 'shadow'
                        }
                    },
                    // dataZoom: [{
                    //     type: 'inside',
                    //     start: 80,
                    //     end: 100
                    // }, {
                    //     type: 'slider'
                    // }],
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis : [
                        {
                            type : 'category',
                            data : this.uniqUsersByDate.map(item => item.date),
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
                            name:'uniq users',
                            type:'bar',
                            barWidth: '60%',
                            data: this.uniqUsersByDate.map(item => item.count)
                        },
                        {
                            name:'trend',
                            type:'line',
                            data: this.trends
                        }
                    ]
                };
            }
        }
    }
</script>

<style scoped>
    .uniq {
        width: 100%;
        height: 300px;
    }
</style>