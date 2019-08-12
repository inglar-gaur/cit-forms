<template>
    <div class="truck_parameters form_row flex-start">
        <div class="input_in_bottom">
            <label class="label_width_outside_input">
                <input
                        required
                        name="receiving_form__truck_parameters_size"
                        :checked="containerSize === 20"
                        type="radio"
                        @input="$store.commit('setContainerValue', {WebGateType: WebGateType, index: 0, prop: 'Size', value: 20})">
                <span class="pseudo_checkbox"></span>
                <span class="title">20 фут</span>
            </label>
            <label class="label_width_outside_input">
                <input
                        required
                        name="receiving_form__truck_parameters_size"
                        :checked="containerSize === 40"
                        type="radio"
                        @input="$store.commit('setContainerValue', {WebGateType: WebGateType, index: 0, prop: 'Size', value: 40})"
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
                    :value="containerNumber"
                    @input="$store.commit('setContainerValue', {WebGateType: WebGateType, index: 0, prop: 'Number', value: $event.target.value})"
                    pattern="[A-Z]{4}[0-9]{7}"
                    required
            >
        </label>

        <label class="container_number" style="width: 150px; margin-left: 40px" v-if="isFullContainer">
            <span class="title">Номер ЗПУ</span>
            <input
                    type="text"
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

        props: {
            WebGateObject: {type: Object, default: null},
            WebGateType: {type: String, default: ''},
        },

        computed:{
            containerNumber(){
                return this.WebGateObject &&
                    this.WebGateObject.Containers &&
                    Array.isArray(this.WebGateObject.Containers.ContainerList) &&
                    this.WebGateObject.Containers.ContainerList[0] &&
                    this.WebGateObject.Containers.ContainerList[0].Number ?
                    this.WebGateObject.Containers.ContainerList[0].Number : '';
            },
            containerSize(){
                return this.WebGateObject &&
                this.WebGateObject.Containers &&
                Array.isArray(this.WebGateObject.Containers.ContainerList) &&
                this.WebGateObject.Containers.ContainerList[0] &&
                this.WebGateObject.Containers.ContainerList[0].Size ?
                    this.WebGateObject.Containers.ContainerList[0].Size : null;
            },
            isFullContainer(){
                return this.WebGateObject &&
                this.WebGateObject.Containers &&
                Array.isArray(this.WebGateObject.Containers.ContainerList) &&
                this.WebGateObject.Containers.ContainerList[0] &&
                this.WebGateObject.Containers.ContainerList[0].State === 'груженый';
            }

        }
    }
</script>

<style scoped>

</style>
