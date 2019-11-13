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
            log: Array
        },
        watch: {
            log: function () {
                this.getTypesChart();
            }
        },
        data: () => ({
            byDate: [],
            options: {},
            trends: []
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

                this.trends = [];
                this.byDate.forEach((item, idx) => {
                    let trend = 0;
                    if (idx > 6) {
                        for (let i = idx - 6; i < idx; i++) {
                            trend += this.byDate[i].count;
                        }
                        this.trends.push(Math.floor(trend / 7));
                    } else if (idx === 0) {
                        this.trends.push(Math.floor((this.byDate[0].count + this.byDate[1].count) / 2));
                    } else {
                        for (let i = 0; i < idx; i++) {
                            trend += this.byDate[i].count;
                        }
                        this.trends.push(Math.floor(trend / (idx + 1)));
                    }
                });


                this.options = {
                    // color: ['#262edb'],
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
                            barWidth: '60%',
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
        height: 500px;
    }
</style>