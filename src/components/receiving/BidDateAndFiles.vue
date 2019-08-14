<template>
    <div class="form_row input_in_bottom left-margin-label-30 flex-start">

        <label class="service_date">
            <span class="title">{{ tableTitle }}</span>
            <!--                            <input type="text" name="application_date">-->
            <!--                            <v-date-picker v-model="bid.bidDate"></v-date-picker>-->
            <datepicker
                    :value="$store.state.WebBid.ApplicationDate"
                    name="bid_date"
                    lang="ru"
                    format="DD.MM.YYYY"
                    valueType="date"
                    :first-day-of-week="1"
                    width="150px"
                    @change="$store.commit('setBidDate', $event)"
            ></datepicker>
        </label>

        <div class="time_interval" style="position: relative">
            <div class="title">{{timeIntervalTitle}}</div>
            <div class="labels" style="position: absolute; bottom: 0; left: 0; width: 700px">
                <div>
                    <span class="label_title title" v-if="setTimeIntervalTitle">с</span>
                    <!--                                    <input name="arrive_time_less" type="text">-->
<!--                    <select>-->
<!--                        <option>&#45;&#45;</option>-->
<!--                        <option v-for="hour in []">{{ hour }}</option>-->
<!--                    </select>-->
<!--                    <span class="hours title">час.</span>-->
                    <div style="display: inline-block; width: 75px">
                        <EmulateSelect
                                v-if="$store.state.WebBid.ApplicationDate && $store.state.ReferenceData.Hours"
                                :placeholder="BidSelectedHours"
                                :elementsList="$store.state.ReferenceData.Hours"
                                @selectElement="$store.commit('setBidTime', {hours: $event})"
                        ></EmulateSelect>
                        <input
                            v-else
                            type="text"
                            disabled
                        >
                    </div>

                    <span class="hours title">час.</span>
                </div>
                <div>
                    <span class="label_title title" v-if="setTimeIntervalTitle">до</span>
                    <div style="display: inline-block; width: 75px">
                        <input v-if="setTimeIntervalTitle || !$store.state.WebBid.ApplicationDate || !$store.state.ReferenceData.Minutes" type="text" disabled>
                        <EmulateSelect
                                :placeholder="BidSelectedMinutes"
                                :elementsList="$store.state.ReferenceData.Minutes"
                                @selectElement="$store.commit('setBidTime', {minutes: $event})"
                                v-else
                        ></EmulateSelect>
                    </div>
                    <span class="hours title">{{ setTimeIntervalTitle ? 'час.' : 'мин.'}}</span>
                    <!--                                    <input name="arrive_time_up" type="text">-->
<!--                    <select>-->
<!--                        <option>&#45;&#45;</option>-->
<!--                        <option v-for="minute in []">{{ minute }}</option>-->
<!--                    </select>-->
<!--                    <span class="hours title">{{ setTimeIntervalTitle ? 'час.' : 'мин.'}}</span>-->
                </div>
            </div>
        </div>

        <!-- todo ЭТО БУДЕТ КНОПКА ЗАГРУЗКИ ФАЙЛА, name будет меняться в зависимости о выбранных условий погрузки-разгрузки  -->

        <!--                        <input v-if="bid.bidEmpty === true || bid.bidType === 'WebGateOut'" class="cit__form_attachment receiving_add_file" type="file" name="receiving_proxy_file" placeholder="Приложить доверенность">-->
        <!--                        <input v-if="bid.bidType !== 'WebGateIn'" class="cit__form_attachment receiving_add_file" type="file" name="receiving_declaration_file" placeholder="Приложить декларацию">-->

        <label v-show="false" class="cit__form_attachment receiving_add_file">
            <input type="file" name="receiving_proxy_file" placeholder="Приложить доверенность" @change="changeInputFileTitle">
            <span class="cit__form_attachment__title">Приложить декларацию</span>
        </label>

    </div>
</template>

<script>
    import EmulateSelect from "../forms/subForms/EmulateSelect";
    export default {
        name: "BidDateAndFiles",
        components: {EmulateSelect},

        computed:{
            tableTitle: function () {
                let tableTitle = 'Дата ';

                if(this.$store.getters.isWebGateIn && this.$store.getters.isWebGateOut){
                    tableTitle += 'услуги';
                }else if(this.$store.getters.isWebGateIn){
                    tableTitle += 'приема ктк на терминал';
                }else if(this.$store.getters.isWebGateOut){
                    tableTitle += 'выдачи ктк с терминала';
                }

                return tableTitle;
            },

            timeIntervalTitle: function () {
                let timeIntervalTitle = 'Время прибытия';

                if(this.$store.state.WebBid.wInlandTransportationIn && this.$store.getters.isWebGateIn){
                    timeIntervalTitle += ' на погрузку';
                }else if(this.$store.state.WebBid.wInlandTransportationOut && this.$store.getters.isWebGateOut){
                    timeIntervalTitle += ' на разгрузку';
                // }else if(this.$store.getters.isWebGateOut && (this.$store.state.WebBid.wStaffingStripping || (this.$store.isFullOutGateContainer))){
                }else if(this.$store.getters.isWebGateIn && this.$store.getters.isWebGateOut){
                    timeIntervalTitle += ' на терминал';
                }

                return timeIntervalTitle;
            },

            setTimeIntervalTitle: function () {
                // return false;
                return (this.$store.state.WebBid.wInlandTransportationIn || this.$store.state.WebBid.wInlandTransportationOut) && !(this.$store.getters.isWebGateIn && (this.$store.getters.WebGateInContainer && this.$store.getters.WebGateInContainer.Empty));
            },

            BidSelectedHours(){
                return this.$store.state.WebBid.ApplicationDate ? String(this.$store.state.WebBid.ApplicationDate.getHours()) : '--';
            },
            BidSelectedMinutes(){
                return this.$store.state.WebBid.ApplicationDate ? String(this.$store.state.WebBid.ApplicationDate.getMinutes()) : '--';
            },
        },

        methods: {
            changeInputFileTitle(){

            }
        }
    }
</script>

<style scoped>

</style>
