<template>
    <div class="day-services">
        <IEcharts :option="options" />
    </div>
</template>

<script>
    import IEcharts from 'vue-echarts-v3/src/full.js';

    export default {
        name: "DayServices",
        components: {
            IEcharts
        },
        props: {
            logSlice: Array
        },
        data: () => ({
            options: {}
        }),
        watch: {
            logSlice: function () {
                this.getDayServices()
            }
        },
        mounted() {
            this.getDayServices();
        },
        methods: {
            getDayServices() {
                const serviceOptions = [];
                this.logSlice.forEach(item => {
                    const services = serviceOptions.find(service => service.name == item.service);

                    if (services) {
                        services.value++;
                    } else {
                        serviceOptions.push({
                            name: item.service,
                            value: 1,
                        });
                    }
                });

                this.options = {
                    tooltip: {
                        trigger: 'item',
                        formatter: "{b}: {c} ({d}%)"
                    },
                    series: [
                        {
                            name:'item.name',
                            type:'pie',
                            radius: ['0%', '70%'],
                            avoidLabelOverlap: false,
                            data: serviceOptions
                        }
                    ]
                };
            }
        }
    }
</script>

<style scoped>
    .day-services {
        width: 1000px;
        height: 500px;
    }
</style>