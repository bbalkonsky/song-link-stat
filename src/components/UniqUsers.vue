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
            logFile: Object
        },
        data: () => ({
            options: {}
        }),
        mounted() {
            const uniqUsersByDate = [];
            for (let key in this.logFile) {
                const uniqDate =  uniqUsersByDate.find(uniq => uniq.date == this.logFile[key] );
                if (uniqDate) {
                    uniqDate.count++;
                } else {
                    uniqUsersByDate.push({
                        date: this.logFile[key],
                        count: 1
                    });
                }
            }
            uniqUsersByDate.sort((a, b) => {
                const aDate = Date.parse(`${a.date.split('.')[2]}-${a.date.split('.')[1]}-${a.date.split('.')[0]}`);
                const bDate = Date.parse(`${b.date.split('.')[2]}-${b.date.split('.')[1]}-${b.date.split('.')[0]}`);
                return aDate > bDate ? 1 : -1;
            });
            this.options = this.getUniqChart(uniqUsersByDate);
        },
        methods: {
            getUniqChart(uniqUsersByDate) {
                return {
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
                            data : uniqUsersByDate.map(item => item.date),
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
                            name:'uniq',
                            type:'bar',
                            barWidth: '60%',
                            data: uniqUsersByDate.map(item => item.count)
                        }
                    ]
                };
            }
        }
    }
</script>

<style scoped>
    .uniq {
        width: 1000px;
        height: 500px;
    }
</style>