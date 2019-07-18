<template>
    <div class="form_row">

        <label class="service_date">
            <span class="title">Дата услуги</span>
            <!--                            <input type="text" name="application_date">-->
            <!--                            <v-date-picker v-model="bid.bidDate"></v-date-picker>-->
            <datepicker
                    v-model="bidDate"
                    name="bid_date"
                    lang="ru"
                    format="DD.MM.YYYY"
                    valueType="format"
                    :first-day-of-week="1"
                    width="150px"
            ></datepicker>
        </label>
        <label class="container_number">
            <span class="title">Номер контейнера</span>
            <input type="text" :value="container" @input="$parent.setBidProp('container', $event.target.value)">
        </label>

        <div class="time_interval">
            <div class="title">Время прибытия</div>
            <div class="labels">
                <label>
                    <!--                                <span class="label_title title">с</span>-->
                    <!--                                    <input name="arrive_time_less" type="text">-->
                    <select>
                        <option>--</option>
                        <option v-for="hour in hours">{{ hour }}</option>
                    </select>
                    <span class="hours title">час.</span>
                </label>
                <label>
                    <!--                                <span class="label_title title">до</span>-->
                    <!--                                    <input name="arrive_time_up" type="text">-->
                    <select>
                        <option>--</option>
                        <option v-for="minute in minutes">{{ minute }}</option>
                    </select>
                    <span class="hours title">мин.</span>
                </label>
            </div>
        </div>

        <!-- todo ЭТО БУДЕТ КНОПКА ЗАГРУЗКИ ФАЙЛА, name будет меняться в зависимости о выбранных условий погрузки-разгрузки  -->

        <!--                        <input v-if="bid.bidEmpty === true || bid.bidType === 'WebGateOut'" class="cit__form_attachment receiving_add_file" type="file" name="receiving_proxy_file" placeholder="Приложить доверенность">-->
        <!--                        <input v-if="bid.bidType !== 'WebGateIn'" class="cit__form_attachment receiving_add_file" type="file" name="receiving_declaration_file" placeholder="Приложить декларацию">-->

        <label v-show="canLoadVicarious" class="cit__form_attachment receiving_add_file">
            <input type="file" name="receiving_proxy_file" placeholder="Приложить доверенность" @change="changeInputFileTitle">
            <span class="cit__form_attachment__title">Приложить доверенность</span>
        </label>

        <label v-show="canLoadDeclaration" class="cit__form_attachment receiving_add_file">
            <input type="file" name="receiving_declaration_file" placeholder="Приложить декларацию" @change="changeInputFileTitle">
            <span class="cit__form_attachment__title">Приложить декларацию</span>
        </label>
    </div>
</template>

<script>
    export default {
        name: "BidDateAndFiles",

        props: {
            bidDate:            {type: String,  default: ""},
            container:          {type: Number,  default: null},
            hours:              {type: Array,   default: []},
            minutes:            {type: Array,   default: []},
            canLoadVicarious:   {type: Boolean, default: false},
            canLoadDeclaration: {type: Boolean, default: false},
        },
        
        methods: {
            changeInputFileTitle: function () {
                
            }
        }
    }
</script>

<style scoped>

</style>