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
            uniqUsersByDate: Array
        },
        data: () => ({
            options: {}
        }),
        mounted() {
            this.options = this.getUniqChart(this.uniqUsersByDate);
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
                    dataZoom: [{
                        type: 'inside',
                        start: 80,
                        end: 100
                    }, {
                        type: 'slider'
                    }],
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
                            name:'uniq users',
                            type:'bar',
                            barWidth: '60%',
                            data: uniqUsersByDate.map(item => item.users.length)
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
        height: 500px;
    }
</style>