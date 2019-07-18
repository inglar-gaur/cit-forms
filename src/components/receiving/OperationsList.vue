<template>
    <fieldset class="chosen_parameters">
        <label class="label_width_outside_input" v-if="operations && operations.includes('WebGateInt')">
            <!-- // todo here inputs should be always checked and disabled       -->
            <input name="" type="radio" checked readonly>
            <span class="pseudo_checkbox"></span>
            <span class="title">Принять на терминал</span>
        </label>
        <label class="label_width_outside_input" v-if="operations && operations.includes('WebGateOut')">
            <!-- // todo here inputs should be always checked and disabled       -->
            <input name="" type="radio" checked readonly>
            <span class="pseudo_checkbox"></span>
            <span class="title">Выдать с терминала</span>
        </label>
        <label class="label_width_outside_input" v-if="operations && operations.includes('WebInlandTransportation')">
            <!-- // todo here inputs should be always checked and disabled       -->
            <input name="" type="radio" checked readonly>
            <span class="pseudo_checkbox"></span>
            <span class="title">Заказать автоперевозку</span>
        </label>
        <label class="label_width_outside_input" v-if="operations && operations.includes('WebStaffingStripping')">
            <!-- // todo here inputs should be always checked and disabled       -->
            <input name="" type="radio" checked readonly>
            <span class="pseudo_checkbox"></span>
            <span class="title">Заказать погрузо-разгрузочные работы</span>
        </label>
    </fieldset>
</template>

<script>
    export default {
        name: "OperationsList",

        props: {
            operations: {type: Array, default: []}
        }
    }
</script>

<style scoped>

</style>