<template>
    <div class="truck_parameters">
        <label class="label_width_outside_input">
            <input name="receiving_form__truck_parameters_size" :checked="+size === 20" type="radio" @input="$parent.setBidProp('size', 20)">
            <span class="pseudo_checkbox"></span>
            <span class="title">20 фут</span>
        </label>
        <label class="label_width_outside_input">
            <input name="receiving_form__truck_parameters_size" :checked="+size === 40" type="radio" @input="$parent.setBidProp('size', 40)">
            <span class="pseudo_checkbox"></span>
            <span class="title">40 фут</span>
        </label>
        <label class="label_width_outside_input">
            <input name="receiving_form__truck_parameters_state" :checked="bidEmpty" type="radio" @input="$parent.setBidProp('bidEmpty', true)">
            <span class="pseudo_checkbox"></span>
            <span class="title">Порожний</span>
        </label>
        <label class="label_width_outside_input">
            <input name="receiving_form__truck_parameters_state" :checked="!bidEmpty" type="radio" @input="$parent.setBidProp('bidEmpty', false)">
            <span class="pseudo_checkbox"></span>
            <span class="title">Груженый</span>
        </label>
    </div>
</template>

<script>
    export default {
        name: "TrackParameters",

        props: [
                'size',
                'bidEmpty'
        ]
    }
</script>

<style scoped>

</style>