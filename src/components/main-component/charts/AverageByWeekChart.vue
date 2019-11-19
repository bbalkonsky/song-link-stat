<template>
    <div class="average-by-week-chart">
        <IEcharts :option="options" />
    </div>
</template>

<script>
    import IEcharts from 'vue-echarts-v3/src/full.js';

    export default {
        name: "AverageByWeekChart",
        components: {
            IEcharts
        },
        props: {
            log: Array
        },
        watch: {
            log: function () {
                this.getAverageByWeekChart();
            }
        },
        data: () => ({
            datesCount: [],
            weeksCounts: [],
            options: {},
            periods: []
        }),
        created() {
            this.getAverageByWeekChart();
        },
        methods: {
            getAverageByWeekChart() {
                this.datesCount = [];
                this.weeksCounts = [];
                this.periods = [];

                this.log.forEach(logItem => {
                    const date = this.datesCount.find(item => item.date === logItem.date);
                    if (date) {
                        date.count++;
                    } else {
                        this.datesCount.push({
                            'date': logItem.date,
                            'count': 1
                        });
                    }
                });

                let weekCount = 0;
                let period = this.datesCount[0].date;
                let daysCount = 0;

                this.datesCount.forEach(day => {
                    const date = day.date;
                    const weekDay = new Date(day.date).getDay();

                    weekCount += day.count;
                    daysCount ++;

                    if (weekDay == 0) {
                        this.weeksCounts.push(Math.floor(weekCount / daysCount));
                        this.periods.push(`${period} - ${date}`);
                        weekCount = 0;
                        daysCount = 0;
                    }
                    if (daysCount == 1) {
                        period = date;
                    }
                });

                if ( new Date(this.datesCount[this.datesCount.length - 1].date).getDay() !== 0) {
                    this.weeksCounts.push(Math.floor(weekCount / daysCount));
                    this.periods.push(`${period} - ${this.datesCount[this.datesCount.length - 1].date}`)
                }

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
                            data : this.periods,
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
                            data: this.weeksCounts
                        }
                    ]
                };
            }
        }
    }
</script>

<style scoped>
    .average-by-week-chart {
        width: 100%;
        height: 380px;
    }
</style>