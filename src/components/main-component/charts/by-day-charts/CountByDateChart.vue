<template>
    <div class="types-by-dates">
        <IEcharts :option="options" @click="$emit('on-chart-click', $event)"/>
    </div>
</template>

<script>
    import IEcharts from 'vue-echarts-v3/src/full.js';

    export default {
        name: "CountByDateChart",
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
                this.getTypesChart();
            }
        },
        data: () => ({
            byDate: [],
            options: {},
            trends: [],
            coefficients:
                {
                    0: 0.432,
                    1: 0.737,
                    2: 0.752,
                    3: 0.927,
                    4: 0.834,
                    5: 0.999,
                    6: 0.458,
                }
        }),
        mounted() {
            this.getTypesChart();
        },
        methods: {
            getTypesChart() {
                this.byDate = [];
                this.log.forEach(item => {
                    const dateCount = this.byDate.find(date => date.date === item.date);
                    if (dateCount) {
                        dateCount.count++;
                    } else {
                        this.byDate.push({
                            date: item.date,
                            count: 1
                        });
                    }
                });

                // here, the moving average is applied, multiplied by the average rate of contribution of the day of the week to the total number of users
                this.byDate.forEach(item => {
                    item.countByCoefficient = item.count * this.coefficients[new Date(`${item.date}`).getDay()];
                });

                if (['month', 'year'].includes(this.period)) {
                    const period = this.period === 'month' ? 6 : 30;
                    this.trends = [];

                    this.byDate.forEach((item, idx) => {
                        let trend = 0;
                        if (idx > period) {
                            for (let i = idx - period; i < idx; i++) {
                                trend += this.byDate[i].countByCoefficient;
                            }
                            this.trends.push(Math.floor(trend / period));
                        } else if (idx === 0) {
                            this.trends.push(Math.floor((this.byDate[0].countByCoefficient + this.byDate[1].countByCoefficient) / 2));
                        } else {
                            for (let i = 0; i < idx; i++) {
                                trend += this.byDate[i].countByCoefficient;
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
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis : [
                        {
                            type : 'category',
                            data : this.byDate.map(item => item.date),
                            axisTick: {
                                alignWithLabel: true
                            }
                        }
                    ],
                    yAxis : [
                        {
                            type : 'value'
                        },
                    ],
                    series : [
                        {
                            name:'users',
                            type:'bar',
                            data: this.byDate.map(item => item.count)
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
    .types-by-dates {
        width: 100%;
        height: 380px;
    }
</style>