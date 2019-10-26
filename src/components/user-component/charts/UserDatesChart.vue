<template>
    <div class="user-dates-chart">
        <IEcharts :option="options" @click="$emit('on-chart-click', $event)"/>
    </div>
</template>

<script>
    import IEcharts from 'vue-echarts-v3/src/full.js';

    export default {
        name: "UserDatesChart",
        components: {
            IEcharts
        },
        props: {
            dates: Array,
            userLog: Array
        },
        data: () => ({
            options: {}
        }),
        watch: {
            userLog: function () {
                this.getDatesChart();
            }
        },
        created() {
            this.getDatesChart();
        },
        methods: {
            getDatesChart() {
                const chartsData = [];
                this.userLog.forEach(item => {
                    const date = chartsData.find(chartItem => chartItem.date == item.date);
                    if (date) {
                        date.count ++;
                    } else {
                        chartsData.push({
                            'date': item.date,
                            'count': 1
                        });
                    }
                });

                this.options = {
                    color: ['#3398DB'],
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
                            data : this.dates,
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
                            name:'count',
                            type:'bar',
                            barWidth: '60%',
                            data: chartsData.map(item => item.count)
                        }
                    ]
                };
            }
        }
    }
</script>

<style scoped>
    .user-dates-chart {
        width: 100%;
        height: 250px;
    }
</style>