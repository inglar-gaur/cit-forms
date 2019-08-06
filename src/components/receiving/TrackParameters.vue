<template>
    <div class="truck_parameters form_row flex-start">
        <div class="input_in_bottom">
            <label class="label_width_outside_input">
                <input
                        required
                        name="receiving_form__truck_parameters_size"
                        :checked="$store.state.WebBid.BidSize === 20"
                        type="radio"
                        @input="$store.commit('setBidProp', {prop: 'BidSize', value: 20})">
                <span class="pseudo_checkbox"></span>
                <span class="title">20 фут</span>
            </label>
            <label class="label_width_outside_input">
                <input
                        required
                        name="receiving_form__truck_parameters_size"
                        :checked="$store.state.WebBid.BidSize === 40"
                        type="radio"
                        @input="$store.commit('setBidProp', {prop: 'BidSize', value: 40})"
                >
                <span class="pseudo_checkbox"></span>
                <span class="title">40 фут</span>
            </label>
        </div>

        <label class="container_number" style="width: 150px">
            <span class="title">Номер контейнера</span>
            <input
                    placeholder="AAAA9999999"
                    type="text"
                    :value="$store.state.WebBid.ContainerNumber"
                    @input="$store.commit('setBidProp', {prop: 'ContainerNumber', value: $event.target.value})"
                    pattern="[A-Z]{4}[0-9]{7}"
                    required
            >
        </label>
<!--        <label class="label_width_outside_input">-->
<!--            <input name="receiving_form__truck_parameters_state" checked type="radio" readonly>-->
<!--            <span class="pseudo_checkbox"></span>-->
<!--            <span class="title" v-if="bidEmpty === 'empty'">Порожний</span>-->
<!--            <span class="title" v-if="bidEmpty === 'full'">Груженый</span>-->
<!--        </label>-->
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
