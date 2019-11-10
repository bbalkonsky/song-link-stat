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
            log: Array
        },
        watch: {
            log: function () {
                this.getServicesChart()
            }
        },
        data: () => ({
            seriesData: {},
            options: {},
            services: [],
            dates: [],
            servicesByDate: []
        }),
        mounted() {
            this.getServicesChart()
        },
        methods: {
            getServicesChart() {
                this.services = [];
                this.dates = [];
                this.servicesByDate = [];

                this.log.forEach(item => {
                    if (!this.services.find(service => service === item.service)) {
                        this.services.push(item.service);
                    }

                    if (!this.dates.find(date => date === item.date)) {
                        this.dates.push(item.date);
                    }

                    const service = this.servicesByDate.find(type => type.service === item.service && type.date === item.date);
                    if (service) {
                        service.count++;
                    } else {
                        this.servicesByDate.push({
                            service: item.service,
                            count: 1,
                            date: item.date
                        });
                    }
                });



                this.services.forEach(service => {
                    this.seriesData[service] = [];
                    this.dates.forEach(date => {
                        const serviceDate = this.servicesByDate.find(item => item.service === service && item.date === date);
                        if (serviceDate) {
                            this.seriesData[service].push(serviceDate.count);
                        } else {
                            this.seriesData[service].push(null);
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