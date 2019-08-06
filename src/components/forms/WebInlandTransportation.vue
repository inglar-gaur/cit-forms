<template>
    <div>
        <div class="form_row input_in_bottom all-inputs-absolute">
            <label class="arrive_address">
                <span class="title">{{ addressTitle }}</span>
                <input
                        :value="$store.state.WebInlandTransportation.Address"
                        type="text"
                        @input="$store.commit('setTransportationProp', {prop: 'Address', value: $event.target.value})"
                >
            </label>
            <label class="contact_person">
                <span class="title">{{ contactsPersonTitle }}</span>
                <input
                        :value="$store.state.WebInlandTransportation.Contacts"
                        type="text"
                        @input="$store.commit('setTransportationProp', {prop: 'Contacts', value: $event.target.value})"
                >
            </label>
            <label class="phone_number">
                <span class="title">Телефон</span>
                <input
                        :value="$store.state.WebInlandTransportation.Phone"
                        type="text"
                        @input="$store.commit('setTransportationProp', {prop: 'Phone', value: $event.target.value})"
                >
            </label>
            <label class="waiting_time">
                <span class="title">{{ waitingTimeTitle }}</span>
                <input value="180" type="text">
                <span class="minutes title">мин</span>
            </label>
        </div>

        <CargoDetails
            v-if="$store.state.SelectedBidPoints.list.includes('full') && !$store.state.SelectedBidPoints.list.includes('WebStaffingStripping')"
        ></CargoDetails>
<!--        <div class="form_row">-->
<!--            <div class="receiving__time_interval_and_special_demand">-->
<!--                <div class="time_interval">-->
<!--                    <div class="title">Интервал времени прибытия</div>-->
<!--                    <div class="labels">-->
<!--                        <label>-->
<!--                            <span class="label_title title">с</span>-->
<!--                            <input name="arrive_time_less" type="text">-->
<!--                            <span class="hours title">час.</span>-->
<!--                        </label>-->
<!--                        <label>-->
<!--                            <span class="label_title title">до</span>-->
<!--                            <input name="arrive_time_up" type="text" value="12:00" disabled>-->
<!--                            <span class="hours title">час.</span>-->
<!--                        </label>-->
<!--                    </div>-->
<!--                </div>-->

<!--                <label class="special_demand">-->
<!--                    <span class="title">Особые требования</span>-->
<!--                    <textarea :value="specialDemand" type="text" @input="$parent.setBidProp('specialDemand', $event.target.value)"></textarea>-->
<!--                </label>-->
<!--            </div>-->
<!--        </div>-->
    </div>
</template>

<script>

    import CargoDetails from "./subForms/CargoDetails";

    export default {
        name: "WebInlandTransportation",

        data: function(){
          return {
              address: '',
              contactsPerson: '',
              contactsPhone: '',
          }
        },

        components: {CargoDetails},

        computed:{
            addressTitle: function () {
                let tableTitle = 'Адрес места';

                if(this.$store.state.SelectedBidPoints.list.includes('full')) {
                    tableTitle += ' прибытия';
                }else if(this.$store.state.SelectedBidPoints.list.includes('WebGateIn')){
                    tableTitle += ' погрузки';
                }else if(this.$store.state.SelectedBidPoints.list.includes('WebGateOut')){
                    tableTitle += ' разгрузки';
                }

                return tableTitle;
            },

            contactsPersonTitle: function () {
                let contactsPersonTitle = 'Контактное лицо';

                if(this.$store.state.SelectedBidPoints.list.includes('WebGateIn')){
                    contactsPersonTitle += ' в месте прибытия';
                }else if(this.$store.state.SelectedBidPoints.list.includes('WebGateOut')){
                    contactsPersonTitle += ' в месте получения';
                }

                return contactsPersonTitle;
            },

            waitingTimeTitle: function () {
                let waitingTimeTitle = 'Время';

                if(this.$store.state.SelectedBidPoints.list.includes('WebGateIn')){
                    waitingTimeTitle += ' на погрузку';
                }else if(this.$store.state.SelectedBidPoints.list.includes('WebGateOut')){
                    waitingTimeTitle += ' в месте получения';
                }

                return waitingTimeTitle;
            },
        },
    }
</script>

<style scoped>

</style>
