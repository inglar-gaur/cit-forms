<template>
    <div class="container">
        <h1>Прием, выдача</h1>
        <receivingCreate
                v-show="showCreateForm"
        >
        </receivingCreate>
    </div>
</template>

<script>
    import receivingCreate from "./receiving-create"

    export default {
        name: "receiving-main",
        components: {receivingCreate},

        data: function () {
            return {
                showCreateForm: true,
            }
        },

        methods: {
            createBid: function (bidObject) {
                console.log(bidObject);
            }
        }
    }
</script>

<style scoped>

</style>