<template>
    <div class="new-users">
        <IEcharts :option="options" @click="$emit('on-chart-click', $event)"/>
    </div>
</template>

<script>
    import IEcharts from 'vue-echarts-v3/src/full.js';

    export default {
        name: "NewUsers",
        components: {
            IEcharts
        },
        props: {
            log: Array
        },
        watch: {
            log: function () {
                this.getUniqChart();
            }
        },
        data: () => ({
            options: {},
            usersSignUp: []
        }),
        mounted() {
            this.getUniqChart();
        },
        methods: {
            getUniqChart() {
                this.usersSignUp = [];

                this.log.forEach(item => {
                    if (!this.usersSignUp[item.id]) {
                        this.usersSignUp[item.id] = item.date;
                    }
                });

                const newUsersByDate = [];
                for (let key in this.usersSignUp) {
                    const uniqDate =  newUsersByDate.find(uniq => uniq.date == this.usersSignUp[key] );
                    if (uniqDate) {
                        uniqDate.count++;
                    } else {
                        newUsersByDate.push({
                            date: this.usersSignUp[key],
                            count: 1
                        });
                    }
                }
                newUsersByDate.sort((a, b) => {
                    const aDate = Date.parse(`${a.date.split('.')[2]}-${a.date.split('.')[1]}-${a.date.split('.')[0]}`);
                    const bDate = Date.parse(`${b.date.split('.')[2]}-${b.date.split('.')[1]}-${b.date.split('.')[0]}`);
                    return aDate > bDate ? 1 : -1;
                });
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
                            data : newUsersByDate.map(item => item.date),
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
                            name:'new users',
                            type:'bar',
                            barWidth: '60%',
                            data: newUsersByDate.map(item => item.count)
                        }
                    ]
                };
            }
        }
    }
</script>

<style scoped>
    .new-users {
        width: 100%;
        height: 500px;
    }
</style>