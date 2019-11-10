<template>
    <div class="types-by-dates">
        <IEcharts :option="options" @click="$emit('on-chart-click', $event)"/>
    </div>
</template>

<script>
    import IEcharts from 'vue-echarts-v3/src/full.js';

    export default {
        name: "TypesByDate",
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
            seriesData: {},
            options: {},
            types: [],
            dates: [],
            typesByDate: []
        }),
        mounted() {
           this.getTypesChart();
        },
        methods: {
            getTypesChart() {
                this.types = [];
                this.dates = [];
                this.typesByDate = [];

                this.log.forEach(item => {
                    if (!this.types.find(type => type === item.type)) {
                        this.types.push(item.type);
                    }

                    if (!this.dates.find(date => date === item.date)) {
                        this.dates.push(item.date);
                    }

                    const type = this.typesByDate.find(type => type.type === item.type && type.date === item.date);
                    if (type) {
                        type.count++;
                    } else {
                        this.typesByDate.push({
                            type: item.type,
                            count: 1,
                            date: item.date
                        });
                    }
                });



                this.types.forEach(type => {
                    this.seriesData[type] = [];
                    this.dates.forEach(date => {
                        const typeDate = this.typesByDate.find(item => item.type === type && item.date === date);
                        if (typeDate) {
                            this.seriesData[type].push(typeDate.count);
                        } else {
                            this.seriesData[type].push(null);
                        }
                    });
                });
                this.options = {
                    tooltip: {
                        trigger: 'axis',
                        axisPointer : {
                            type : 'shadow'
                        }
                    },
                    legend: {
                        show: true
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
                    xAxis:  {
                        type: 'category',
                        data: this.dates
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: this.types.map(type => {
                        return {
                            name: type,
                            type: 'bar',
                            stack: 'stack1',
                            label: {
                                normal: {
                                    show: false,
                                    position: 'insideRight'
                                }
                            },
                            data: this.seriesData[type]
                        }
                    })
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