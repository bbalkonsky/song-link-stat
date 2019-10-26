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
                            <h2 class="navbar-item subtitle">best unused service</h2>
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
                }
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
            }
        }
    }
</script>

<style scoped>
    .header-hero {
        margin-bottom: 30px;
    }
</style>