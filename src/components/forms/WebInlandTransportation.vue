<template>
    <div v-if="WebInlandTransportationObject">
        <div class="form_row input_in_bottom all-inputs-absolute">
            <div class="arrive_address" style="position: relative">
                <span class="title">{{ addressTitle }}</span>
                <div style="position: absolute; left: 0; bottom: 0; width: 70%">
                    <EmulateSelect
                            :placeholder="WebInlandTransportationObject.street ? WebInlandTransportationObject.street : 'Улица'"
                            :elementsList="$store.getters.getStreetsList"
                            @selectElement="$store.commit('setWebObjectValue', {WebObjectType: wInlandTransportationType, PropName: 'street', PropValue: $event})"
                    ></EmulateSelect>
                </div>
                <div style="width: 30%;position: absolute;bottom: 0;right: 0;">
                    <input
                            type="text"
                            :placeholder="WebInlandTransportationObject.house ? WebInlandTransportationObject.house : 'Дом'"
                            @input="$store.commit('setWebObjectValue', {WebObjectType: wInlandTransportationType, PropName: 'houseNumber', PropValue: $event.target.value})"
                    >
                </div>
            </div>
            <label class="contact_person">
                <span class="title">{{ contactsPersonTitle }}</span>
                <input
                        :value="WebInlandTransportationObject.Contacts"
                        type="text"
                        @input="$store.commit('setWebObjectValue', {WebObjectType: wInlandTransportationType, PropName: 'Contacts', PropValue: $event.target.value})"
                >
            </label>
            <label class="phone_number">
                <span class="title">Телефон</span>
                <input
                        required
                        placeholder="+79999999999"
                        pattern="\+7[0-9]{10}"
                        :value="WebInlandTransportationObject.Phone"
                        type="text"
                        @input="$store.commit('setWebObjectValue', {WebObjectType: wInlandTransportationType, PropName: 'Phone', PropValue: $event.target.value})"
                >
            </label>
            <label v-if="Container.Full" style="width: 150px">
                <span class="title">Вес контейнера (т)</span>
                <input
                        :value="Container.WeightGross"
                        type="text"
                        @input="$store.commit('setContainerValue', {WebObjectType: 'wGate'+WebGateTypePostfix, ElementIndex: 0, PropName: 'WeightGross', PropValue: +$event.target.value})"
                >
            </label>
            <label class="waiting_time">
                <span class="title">{{ waitingTimeTitle }}</span>
                <input :value="Container ? Container.WaitingTime : ''" type="text" disabled>
<!--                <span class="minutes title">мин</span>-->
            </label>
        </div>

        <!--
            Таблица с описанием груза доступна в трёх вариантах
            1. Если это форма доставки входящей заявки, есть объект с грузом и выбраны погрузочно-разгрузочные работы
            2. Если это форма доставки исходящей заявки, контейнер пуст и выбрана обратная доставка контейнера (груженого)
            3. Если это форма доставки входящей заявки, выбрана сдвоенная операция, контейнер груженый и выбрана автоперевозка
        -->
        <CargoDetails
                v-if="
                    (WebGateTypePostfix === 'In' && $store.state.WebBid.wGateIn && $store.state.WebBid.wGateIn.Cargo && !$store.state.WebBid.wStaffingStripping) ||
                    (WebGateTypePostfix === 'Out' && Container && Container.Empty && WebInlandTransportationObject.ReturnContainer) ||
                    (WebGateTypePostfix === 'In' && $store.getters.isWebGateIn && $store.getters.isWebGateOut && Container && Container.Full && WebInlandTransportationObject)
                "
                :elements="$store.state.WebBid.wGateIn ? $store.state.WebBid.wGateIn.Cargo.Elements : []"
                @changeCargoElement="$store.commit('changeCargoElement', {WebObjectType: 'wGateIn', ElementIndex:$event.index,  PropName:$event.prop,  PropValue:$event.value})"
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
              container: null,
          }
        },

        props:{
            WebGateTypePostfix: {type: String, default: ''},
            WebGateObject: {type: Object, default: null},
            WebInlandTransportationObject: {type: Object, default: null},
            Container: {type: Object, default: null}
        },

        components: {EmulateSelect, CargoDetails},

        created(){
            this.$store.dispatch('getStreets');
        },

        computed:{
            addressTitle: function () {
                let tableTitle = 'Адрес места';

                switch (this.WebGateTypePostfix) {
                    case 'In':
                        tableTitle += ' погрузки (прибытия)';
                        break;
                    case 'Out':
                        tableTitle += ' разгрузки (прибытия)';
                        break;
                }

                return tableTitle;
            },

            contactsPersonTitle: function () {
                let contactsPersonTitle = 'Контактное лицо';

                switch (this.WebGateTypePostfix) {
                    case 'In':
                        contactsPersonTitle += ' в месте прибытия';
                        break;
                    case 'Out':
                        contactsPersonTitle += ' в месте прибытия';
                        break;
                }

                return contactsPersonTitle;
            },

            waitingTimeTitle: function () {
                let waitingTimeTitle = 'Время';

                if(
                    this.WebGateTypePostfix === 'Out' && this.Container && this.Container.Empty && this.WebInlandTransportationObject.ReturnContainer
                ){
                    waitingTimeTitle += ' ожидания получения груженого';
                }else if(this.WebGateTypePostfix === 'In'){
                    waitingTimeTitle += ' на погрузку';
                }else if(this.WebGateTypePostfix === 'Out'){
                    waitingTimeTitle += ' на выгрузку';
                }

                return waitingTimeTitle;
            },

            wInlandTransportationType(){return  'wInlandTransportation'+this.WebGateTypePostfix;}
        },
    }
</script>

<style scoped>

</style>
