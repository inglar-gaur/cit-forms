<template>
    <div>
        <div class="form_row">
            <label class="arrive_address">
                <span class="title">{{ addressTitle }}</span>
                <input v-model="address" type="text">
            </label>
            <label class="contact_person">
                <span class="title">{{ contactsPersonTitle }}</span>
                <input v-model="contactsPerson" type="text">
            </label>
            <label class="phone_number">
                <span class="title">Телефон</span>
                <input v-model="contactsPhone" type="text">
            </label>
            <label class="waiting_time">
                <span class="title">{{ waitingTimeTitle }}</span>
                <input value="180" type="text">
                <span class="minutes title">мин</span>
            </label>
        </div>
        <div class="form_row">
            <div class="receiving__time_interval_and_special_demand">
                <div class="time_interval">
                    <div class="title">Интервал времени прибытия</div>
                    <div class="labels">
                        <label>
                            <span class="label_title title">с</span>
                            <input name="arrive_time_less" type="text">
                            <span class="hours title">час.</span>
                        </label>
                        <label>
                            <span class="label_title title">до</span>
                            <input name="arrive_time_up" type="text" value="12:00" disabled>
                            <span class="hours title">час.</span>
                        </label>
                    </div>
                </div>

                <label class="special_demand">
                    <span class="title">Особые требования</span>
                    <textarea :value="specialDemand" type="text" @input="$parent.setBidProp('specialDemand', $event.target.value)"></textarea>
                </label>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "WebInlandTransportation",

        data: function(){
          return {
              address: '',
              contactsPerson: '',
              contactsPhone: '',
          }
        },

        props: {
            operations: {type: Array, default: []},
            specialDemand: {type: String, default: ""}
        },

        computed:{
            addressTitle: function () {
                let tableTitle = 'Адрес места';

                if(this.operations.includes('WebGateIn')){
                    tableTitle += ' подачи а/м под погрузку';
                }else if(this.operations.includes('WebGateOut')){
                    tableTitle += ' подачи а/м под разгрузку';
                }

                return tableTitle;
            },

            contactsPersonTitle: function () {
                let contactsPersonTitle = 'Контактное лицо';

                if(this.operations.includes('WebGateIn')){
                    contactsPersonTitle += ' в месте подачи';
                }else if(this.operations.includes('WebGateOut')){
                    contactsPersonTitle += ' в месте получения';
                }

                return contactsPersonTitle;
            },

            waitingTimeTitle: function () {
                let waitingTimeTitle = 'Время ожидания';

                if(this.operations.includes('WebGateIn')){
                    waitingTimeTitle += ' в месте подачи';
                }else if(this.operations.includes('WebGateOut')){
                    waitingTimeTitle += ' в месте получения';
                }

                return waitingTimeTitle;
            },
        },
    }
</script>

<style scoped>

</style>