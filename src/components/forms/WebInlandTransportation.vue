<template>
    <div v-if="$store.state.WebBid.wInlandTransportation">
        <div class="form_row input_in_bottom all-inputs-absolute">
            <div class="arrive_address" style="position: relative">
                <span class="title">{{ addressTitle }}</span>
                <div style="position: absolute; left: 0; bottom: 0; width: 100%">
                    <EmulateSelect
                            :placeholder="$store.state.WebBid.wInlandTransportation.street ? $store.state.WebBid.wInlandTransportation.street : 'Улица'"
                            :elementsList="$store.state.ReferenceData.Streets"
                            @selectElement="$store.commit('setWebObjectValue', {WebObjectType: 'wInlandTransportation', prop: 'street', value: $event})"
                    ></EmulateSelect>
                </div>
            </div>
            <label class="contact_person">
                <span class="title">{{ contactsPersonTitle }}</span>
                <input
                        :value="$store.state.WebBid.wInlandTransportation.Contacts"
                        type="text"
                        @input="$store.commit('setWebObjectValue', {WebObjectType: 'wInlandTransportation', prop: 'Contacts', value: $event.target.value})"
                >
            </label>
            <label class="phone_number">
                <span class="title">Телефон</span>
                <input
                        :value="$store.state.WebBid.wInlandTransportation.Phone"
                        type="text"
                        @input="$store.commit('setWebObjectValue', {WebObjectType: 'wInlandTransportation', prop: 'Phone', value: $event.target.value})"
                >
            </label>
            <label class="waiting_time">
                <span class="title">{{ waitingTimeTitle }}</span>
                <input :value="waitingTimeValue" type="text" disabled>
<!--                <span class="minutes title">мин</span>-->
            </label>
        </div>

        <!-- todo Надо выяснить где лежит список товаров при обратной доставке -->

        <CargoDetails
                v-if="($store.state.WebBid.wGateIn && $store.state.WebBid.wGateIn.Cargo && !$store.state.WebBid.wStaffingStripping) || ($store.getters.isEmptyOutGateContainer && $store.state.WebBid.wInlandTransportation.ReturnContainer)"
                :elements="$store.state.WebBid.wGateIn ? $store.state.WebBid.wGateIn.Cargo.Elements : []"
                @changeCargoElement="$store.commit('changeCargoElement', {WebObjectType: 'wGateIn', index:$event.index,  prop:$event.prop,  value:$event.value})"
                @addDefaultCargoElement="$store.commit('addDefaultCargoElement', 'wGateIn')"
        ></CargoDetails>
    </div>
</template>

<script>

    import CargoDetails from "./subForms/CargoDetails";
    import EmulateSelect from "./subForms/EmulateSelect";

    export default {
        name: "WebInlandTransportation",

        data: function(){
          return {
              address: '',
              contactsPerson: '',
              contactsPhone: '',
          }
        },

        components: {EmulateSelect, CargoDetails},

        computed:{
            addressTitle: function () {
                let tableTitle = 'Адрес места';

                if(this.$store.getters.isWebGateIn){
                    tableTitle += ' погрузки (прибытия)';
                }else if(this.$store.getters.isWebGateOut){
                    tableTitle += ' разгрузки (прибытия)';
                }

                return tableTitle;
            },

            contactsPersonTitle: function () {
                let contactsPersonTitle = 'Контактное лицо';

                if(this.$store.getters.isWebGateIn){
                    contactsPersonTitle += ' в месте прибытия';
                }else if(this.$store.getters.isWebGateOut){
                    contactsPersonTitle += ' в месте прибытия';
                }

                return contactsPersonTitle;
            },

            waitingTimeTitle: function () {
                let waitingTimeTitle = 'Время';

                if(
                    this.$store.getters.isWebGateOut && this.$store.getters.isEmptyOutGateContainer && this.$store.state.WebBid.wInlandTransportation.ReturnContainer
                ){
                    waitingTimeTitle += ' ожидания получения груженого';
                }else if(this.$store.getters.isWebGateIn){
                    waitingTimeTitle += ' на погрузку';
                }else if(this.$store.getters.isWebGateOut){
                    waitingTimeTitle += ' на выгрузку';
                }

                return waitingTimeTitle;
            },

            waitingTimeValue(){
                let WebGate = null;
                if(this.$store.getters.isWebGateIn){
                    WebGate = this.$store.getters.getWebBidOperation('wGateIn');
                }else if(this.$store.getters.isWebGateOut){
                    WebGate = this.$store.getters.getWebBidOperation('wGateOut');
                }

                if(WebGate && WebGate.Containers && Array.isArray(WebGate.Containers.ContainerList) && WebGate.Containers.ContainerList[0]){
                    switch (WebGate.Containers.ContainerList[0].Size) {
                        case 20:
                            return '90 мин';
                        case 40:
                            return '180 мин';
                    }
                }

                return '';
            }
        },
    }
</script>

<style scoped>

</style>
