<template>
    <div class="services-by-dates">
        <IEcharts :option="options" @click="$emit('on-chart-click', $event)"/>
    </div>
</template>

<script>
    import IEcharts from 'vue-echarts-v3/src/full.js';

    export default {
        name: "ServicesByDate",
        components: {
            IEcharts
        },
        props: {
            dates: Array,
            services: Array,
            servicesByDate: Array
        },
        data: () => ({
            seriesData: {},
            options: {}
        }),
        mounted() {
            this.services.forEach(service => {
                this.seriesData[service] = [];
                this.dates.forEach(date => {
                    const serviceDate = this.servicesByDate.find(item => item.service == service && item.date == date);
                    if (serviceDate) {
                        this.seriesData[service].push(serviceDate.count);
                    } else {
                        this.seriesData[service].push(null);
                    }
                });
            });
            this.options = this.getServicesChart();
        },
        methods: {
            getServicesChart() {
                return {
                    tooltip: {
                        trigger: 'axis',
                        axisPointer : {
                            type : 'shadow'
                        }
                    },
                    legend: {
                        show: true
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
                    xAxis:  {
                        type: 'category',
                        data: this.dates
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: this.services.map(service => {
                        return {
                            name: service,
                            type: 'bar',
                            stack: 'stack1',
                            label: {
                                normal: {
                                    show: false,
                                    position: 'insideRight'
                                }
                            },
                            data: this.seriesData[service]
                        }
                    })
                };
            }
        }
    }
</script>

<style scoped>
    .services-by-dates {
        width: 100%;
        height: 500px;
    }
</style>