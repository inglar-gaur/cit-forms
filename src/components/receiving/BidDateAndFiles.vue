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
                    valueType="format"
                    :first-day-of-week="1"
                    width="150px"
                    @change="$store.commit('setBidProp', {prop: 'ApplicationDate', value: $event})"
            ></datepicker>
        </label>

        <div class="time_interval">
            <div class="title">{{timeIntervalTitle}}</div>
            <div class="labels">
                <label>
                    <span class="label_title title" v-if="setTimeIntervalTitle">с</span>
                    <!--                                    <input name="arrive_time_less" type="text">-->
                    <select>
                        <option>--</option>
                        <option v-for="hour in []">{{ hour }}</option>
                    </select>
                    <span class="hours title">час.</span>
                </label>
                <label>
                    <span class="label_title title" v-if="setTimeIntervalTitle">до</span>
                    <!--                                    <input name="arrive_time_up" type="text">-->
                    <select>
                        <option>--</option>
                        <option v-for="minute in []">{{ minute }}</option>
                    </select>
                    <span class="hours title">{{ setTimeIntervalTitle ? 'час.' : 'мин.'}}</span>
                </label>
            </div>
        </div>

        <!-- todo ЭТО БУДЕТ КНОПКА ЗАГРУЗКИ ФАЙЛА, name будет меняться в зависимости о выбранных условий погрузки-разгрузки  -->

        <!--                        <input v-if="bid.bidEmpty === true || bid.bidType === 'WebGateOut'" class="cit__form_attachment receiving_add_file" type="file" name="receiving_proxy_file" placeholder="Приложить доверенность">-->
        <!--                        <input v-if="bid.bidType !== 'WebGateIn'" class="cit__form_attachment receiving_add_file" type="file" name="receiving_declaration_file" placeholder="Приложить декларацию">-->

        <label v-show="canLoadVicarious" class="cit__form_attachment receiving_add_file">
            <input type="file" name="receiving_proxy_file" placeholder="Приложить доверенность" @change="changeInputFileTitle">
            <span class="cit__form_attachment__title">Приложить декларацию</span>
        </label>

    </div>
</template>

<script>
    export default {
        name: "BidDateAndFiles",

        props: {
            canLoadVicarious:   {type: Boolean, default: false},
            canLoadDeclaration: {type: Boolean, default: false},
        },

        computed:{
            tableTitle: function () {
                let tableTitle = 'Дата ';

                if(this.$store.state.SelectedBidPoints.list.includes('WebGateIn')){
                    tableTitle += 'приема ктк на терминал';
                }else if(this.$store.state.SelectedBidPoints.list.includes('WebGateOut')){
                    tableTitle += 'выдачи ктк с терминала';
                }else if(this.$store.state.SelectedBidPoints.list.includes('WebGateInOut')){
                    tableTitle += 'приема/выдачи ктк';
                }

                return tableTitle;
            },

            timeIntervalTitle: function () {
                let timeIntervalTitle = 'Время прибытия';

                if(this.$store.state.SelectedBidPoints.list.includes('WebInlandTransportation') && this.$store.state.SelectedBidPoints.list.includes('WebGateIn')){
                    timeIntervalTitle += ' на погрузку';
                }else if(this.$store.state.SelectedBidPoints.list.includes('WebInlandTransportation') && this.$store.state.SelectedBidPoints.list.includes('WebGateOut')){
                    timeIntervalTitle += ' в место разггрузки';
                }else if((this.$store.state.SelectedBidPoints.list.includes('WebStaffingStripping') || this.$store.state.SelectedBidPoints.list.includes('full')) && this.$store.state.SelectedBidPoints.list.includes('WebGateIn')){
                    timeIntervalTitle += ' на терминал';
                }

                return timeIntervalTitle;
            },

            setTimeIntervalTitle: function () {
                return this.$store.state.SelectedBidPoints.list.includes('WebGateIn') && this.$store.state.SelectedBidPoints.list.includes('full') && this.$store.state.SelectedBidPoints.list.includes('WebInlandTransportation');
            }
        },

        methods: {
            changeInputFileTitle: function () {

            }
        }
    }
</script>

<style scoped>

</style>
