<template>
    <div class="day-types">
        <IEcharts :option="options" />
    </div>
</template>

<script>
    import IEcharts from 'vue-echarts-v3/src/full.js';

    export default {
        name: "DayTypes",
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
                this.getDayTypes()
            }
        },
        mounted() {
            this.getDayTypes();
        },
        methods: {
            getDayTypes() {
                const typeOptions = [];
                this.logSlice.forEach(item => {
                    const types = typeOptions.find(type => type.name == item.type);

                    if (types) {
                        types.value++;
                    } else {
                        typeOptions.push({
                            name: item.type,
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
                            data: typeOptions
                        }
                    ]
                };
            }
        }
    }
</script>

<style scoped>
    .day-types {
        width: 100%;
        height: 250px;
    }
</style>