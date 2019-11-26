<template>
    <section class="header-hero hero is-bold" :class="color">
        <div class="hero-head">
            <nav class="navbar">
                <div class="container">
                    <div class="navbar-brand">
                        <div v-if="subPageHeader">
                            <h1 class="navbar-item title">{{subPageHeader}}</h1>
                            <h2 class="navbar-item subtitle">{{subPageSubHeader}}</h2>
                        </div>
                        <div v-else>
                            <h1 class="navbar-item title">SongLink bot statistics</h1>
                            <h2 class="navbar-item subtitle">best useless service</h2>
                        </div>
                    </div>

                    <div v-if="isSubPage" id="navbarMenuHeroA" class="navbar-menu">
                        <div class="navbar-end">
                            <span class="navbar-item">
                                <b-button
                                        tag="router-link"
                                        to="/"
                                        type="is-medium is-dark">
                                    Go to main
                                </b-button>
                            </span>
                        </div>
                    </div>
                    <div v-else class="navbar-menu">
                        <div class="navbar-end">
                            <span class="navbar-item">
                                <b-dropdown aria-role="list" @change="periodSelectHandler($event)">
                                    <button class="button is-dark" slot="trigger">
                                        <span>{{period}}</span>
<!--                                        <b-icon icon="menu-down"></b-icon>-->
                                    </button>

                                    <b-dropdown-item aria-role="listitem" value="month">Month</b-dropdown-item>
                                    <b-dropdown-item aria-role="listitem" value="week">Week</b-dropdown-item>
                                    <b-dropdown-item aria-role="listitem" value="year">Year</b-dropdown-item>
                                    <b-dropdown-item aria-role="listitem" value="all">All time</b-dropdown-item>
                                </b-dropdown>
                            </span>
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    </section>
</template>

<script>
    export default {
        name: "Header",
        data() {
            return {
                colors: {
                    'is-info': false,
                    'is-success': false,
                    'is-warning': false,
                    'is-danger': false,
                    'is-light': false,
                    'is-dark': false
                },
                period: 'Month'
            }
        },
        computed: {
            color: function () {
                const colorsLength = Object.keys(this.colors).length - 1;
                const newColor = Object.keys(this.colors)[[this.getRndInteger(0, colorsLength)]];
                return {
                    [newColor]: true
                }
            }
        },
        props: {
            isSubPage: Boolean,
            subPageHeader: String,
            subPageSubHeader: String
        },
        methods: {
            getRndInteger(min, max) {
                return Math.floor(Math.random() * (max - min + 1) ) + min;
            },
            periodSelectHandler(period) {
                this.$emit('period-changed', period);
                this.period = period.charAt(0).toUpperCase() + period.slice(1);
            }
        }
    }
</script>

<style scoped>
    .header-hero {
        margin-bottom: 30px;
    }
</style>