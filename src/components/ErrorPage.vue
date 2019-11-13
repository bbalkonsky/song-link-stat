<template>
    <div class="container">
        <template v-if="errorData.length">
            <b-table :data="errorData" :striped="true" :hoverable="true">
                <template slot-scope="props">
                    <b-table-column field="message" label="Message">
                        {{props.row.message}}
                    </b-table-column>
                    <b-table-column field="error" label="Error">
                        {{props.row.error}}
                    </b-table-column>
                </template>
            </b-table>
        </template>
    </div>
</template>

<script>
    import axios from 'axios'

    export default {
        name: "ErrorPage",
        data: () => ({
            errorData: []
        }),
        methods: {
            getErrorData(rawErrorLog) {
                rawErrorLog.forEach(item => {
                    this.errorData.push({
                        'message': item.message,
                        'error': item.error
                    })
                })
                // eslint-disable-next-line no-console
                console.log(typeof this.errorData[0].message)
            }
        },
        created() {
            axios.get(`http://localhost:3000/errors`).then(response => this.getErrorData(response.data));
        },
    }
</script>

<style scoped>

</style>