<template>
    <div>

        <form v-if="bids.length > 0" class="cit_form receiving_form">
            <div class="application_wrap">
                <div v-for="(bid, index) in bids" class="application">
                    <h2>Заявка на {{ getTextType(bid.bidType) }} контейнера <span class="application_number">№{{ index + 1 }}</span><small v-if="bid.WebInlandTransportation"> + автоперевозка</small></h2>
                    <div class="application_date">
                        <span>Дата подачи заявки: </span>
                        <input type="text" :value="nowDate" :placeholder="nowDate" disabled>
                    </div>

                    <div class="form_row">

                        <fieldset class="chosen_parameters">
                            <label class="label_width_outside_input" v-if="bid.bidType === 'WebGateIn'">
                                <!-- // todo here inputs should be always checked and disabled       -->
                                <input name="" type="radio" checked disabled>
                                <span class="pseudo_checkbox"></span>
                                <span class="title">Принять на терминал</span>
                            </label>
                            <label class="label_width_outside_input" v-if="bid.bidType === 'WebGateOut'">
                                <!-- // todo here inputs should be always checked and disabled       -->
                                <input name="" type="radio" checked disabled>
                                <span class="pseudo_checkbox"></span>
                                <span class="title">Выдать с терминала</span>
                            </label>
                            <label class="label_width_outside_input" v-if="bid.WebInlandTransportation">
                                <!-- // todo here inputs should be always checked and disabled       -->
                                <input name="" type="radio" checked disabled>
                                <span class="pseudo_checkbox"></span>
                                <span class="title">Заказать автоперевозку</span>
                            </label>
                            <label class="label_width_outside_input" v-if="bid.WebStaffingStripping">
                                <!-- // todo here inputs should be always checked and disabled       -->
                                <input name="" type="radio" checked disabled>
                                <span class="pseudo_checkbox"></span>
                                <span class="title">Заказать погрузо-разгрузочные работы</span>
                            </label>
                        </fieldset>

                        <div class="truck_parameters">
                            <label class="label_width_outside_input" @click.prevent="setSize(index, 20)">
                                <input name="receiving_form__truck_parameters_size" :checked="bid.size === 20" type="checkbox">
                                <span class="pseudo_checkbox"></span>
                                <span class="title">20 фут</span>
                            </label>
                            <label class="label_width_outside_input" @click.prevent="setSize(index, 40)">
                                <input name="receiving_form__truck_parameters_size" :checked="bid.size === 40" type="checkbox">
                                <span class="pseudo_checkbox"></span>
                                <span class="title">40 фут</span>
                            </label>
                            <label class="label_width_outside_input" @click.prevent="setEmpty(index)">
                                <input name="receiving_form__truck_parameters_state" :checked="bid.bidEmpty === true" type="checkbox">
                                <span class="pseudo_checkbox"></span>
                                <span class="title">Порожний</span>
                            </label>
                            <label class="label_width_outside_input" @click.prevent="setEmpty(index, false)">
                                <input name="receiving_form__truck_parameters_state" :checked="bid.bidEmpty === false" type="checkbox">
                                <span class="pseudo_checkbox"></span>
                                <span class="title">Груженый</span>
                            </label>
                        </div>

                        <div class="cargo_parameters">
                            <label v-if="!bid.bidEmpty">
                                <span class="title">Масса груза, кг</span>
                                <input type="number" v-model="bid.massa">
                                <span class="or">или</span>
                            </label>
                            <label v-if="!bid.bidEmpty">
                                <span class="title">Брутто контейнера, кг</span>
                                <input type="number" v-model="bid.brutto">
                            </label>
                            <label v-if="bid.dangerCargo">
                                <span class="title">Класс опасности</span>
                                <input type="text" name="receiving_form__cargo_parameters__danger_class">

                                <!--                            <label class="is_cargo_danger label_width_outside_input">-->
                                <!--                                <input name="receiving_form__danger_cargo" type="checkbox">-->
                                <!--                                <span class="pseudo_checkbox"></span>-->
                                <!--                                <span class="title">Опасный груз</span>-->
                                <!--                            </label>-->
                            </label>
                        </div>

                    </div>

                    <div class="form_row">

                        <label class="service_date">
                            <span class="title">Дата услуги</span>
<!--                            <input type="text" name="application_date">-->
<!--                            <v-date-picker v-model="bid.bidDate"></v-date-picker>-->
                            <datepicker
                                v-model="bid.bidDate"
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
                            <input type="text" v-model="bid.container">
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

                        <label v-show="bid.bidEmpty === true || bid.bidType === 'WebGateOut'" class="cit__form_attachment receiving_add_file">
                            <input type="file" name="receiving_proxy_file" placeholder="Приложить доверенность" @change="changeInputFileTitle">
                            <span class="cit__form_attachment__title">Приложить доверенность</span>
                        </label>

                        <label v-show="bid.bidType !== 'WebGateIn'" class="cit__form_attachment receiving_add_file">
                            <input type="file" name="receiving_declaration_file" placeholder="Приложить декларацию" @change="changeInputFileTitle">
                            <span class="cit__form_attachment__title">Приложить декларацию</span>
                        </label>
                    </div>

                    <div class="form_row" v-if="bid.WebInlandTransportation">
                        <label class="arrive_address">
                            <span v-if="bid.bidType === 'WebGateIn'" class="title">Адрес места подачи а/м под погрузку</span>
                            <span v-if="bid.bidType === 'WebGateOut'" class="title">Адрес места прибытия</span>
                            <input type="text" v-model="bid.placeInput">
                        </label>
                        <label class="contact_person">
                            <span class="title">Контактное лицо в месте {{ bid.bidType === 'WebGateIn' ? 'подачи' : 'прибытия' }}</span>
                            <input type="text" v-model="bid.contactPerson">
                        </label>
                        <label class="phone_number">
                            <span class="title">Телефон</span>
                            <input type="text" v-model="bid.contactPhone">
                        </label>
                        <label class="waiting_time">
                            <span class="title">Время ожидания в месте {{ bid.bidType === 'WebGateIn' ? 'подачи' : 'прибытия' }}</span>
                            <input type="text" v-model="bid.waitingTime">
                            <span class="minutes title">мин</span>
                        </label>
                    </div>

                    <div class="form_row" v-if="bid.WebInlandTransportation">
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
                                <textarea v-model="bid.specialDemand" type="text"></textarea>
                            </label>
                        </div>
                    </div>

                    <div class="form_row" v-if="bid.WebStaffingStripping">
                        <table class="load_unload_table">
                            <tr>
                                <th></th>
                                <th>Вагон</th>
                                <th>Контейнер</th>
                                <th>Автотранспорт</th>
                                <th>Склад</th>
                                <th>Площадка</th>
                            </tr>
                            <tr>
                                <th>Разгрузка из</th>
                                <td>
                                    <label class="label_width_outside_input">
                                        <input name="loading_out" type="radio">
                                        <span class="pseudo_checkbox"></span>
                                    </label>
                                </td>
                                <td>
                                    <label class="label_width_outside_input">
                                        <input name="loading_out" type="radio">
                                        <span class="pseudo_checkbox"></span>
                                    </label>
                                </td>
                                <td>
                                    <label class="label_width_outside_input">
                                        <input name="loading_out" type="radio">
                                        <span class="pseudo_checkbox"></span>
                                    </label>
                                </td>
                                <td>
                                    <label class="label_width_outside_input">
                                        <input name="loading_out" type="radio">
                                        <span class="pseudo_checkbox"></span>
                                    </label>
                                </td>
                                <td>
                                    <label class="label_width_outside_input">
                                        <input name="loading_out" type="radio">
                                        <span class="pseudo_checkbox"></span>
                                    </label>
                                </td>
                            </tr>
                            <tr>
                                <th>Погрузка в</th>
                                <td>
                                    <label class="label_width_outside_input">
                                        <input name="loading_in" type="radio">
                                        <span class="pseudo_checkbox"></span>
                                    </label>
                                </td>
                                <td>
                                    <label class="label_width_outside_input">
                                        <input name="loading_in" type="radio">
                                        <span class="pseudo_checkbox"></span>
                                    </label>
                                </td>
                                <td>
                                    <label class="label_width_outside_input">
                                        <input name="loading_in" type="radio">
                                        <span class="pseudo_checkbox"></span>
                                    </label>
                                </td>
                                <td>
                                    <label class="label_width_outside_input">
                                        <input name="loading_in" type="radio">
                                        <span class="pseudo_checkbox"></span>
                                    </label>
                                </td>
                                <td>
                                    <label class="label_width_outside_input">
                                        <input name="loading_in" type="radio">
                                        <span class="pseudo_checkbox"></span>
                                    </label>
                                </td>
                            </tr>

                        </table>
                    </div>

                    <div class="form_row" v-if="bid.WebStaffingStripping">
                        <table class="full_table receiving_cargo_information">
                            <tr><th colspan="9">Сведения о грузе</th></tr>
                            <tr>
                                <th class="wide" colspan="3">Наименование груза (место)</th>
                                <th>Кол-во мест</th>
                                <th>Масса места, брутто (кг)</th>
                                <th>Габарит места Д/Ш/В, (мм)</th>
                                <th>Упаковка места (описание)</th>
                                <th>Класс опасности</th>
                                <th>Особые требования к обращению с грузом</th>
                            </tr>
                            <tr v-for="goods in bid.goods">
                                <td colspan="3"><input type="text" v-model="goods.name"></td>
                                <td><input type="text" v-model="goods.amount"></td>
                                <td><input type="number" v-model="goods.weight"></td>
                                <td><input type="number" v-model="goods.size"></td>
                                <td><input type="text" v-model="goods.pack"></td>
                                <td><input type="text" v-model="goods.dangerClass"></td>
                                <td><input type="text" v-model="goods.specialDemand"></td>
                            </tr>
                            <tr>
                                <td><button @click.prevent="addGood(index)" class="cit_btn btn_add">+ Добавить строку</button></td>
                                <td colspan="2"><div class="sum">Итого:</div></td>
                                <td><input type="text" :value="bid.goods.reduce((sum, elem) => sum + (+elem.amount), 0)" disabled></td>
                                <td><input type="text" :value="bid.goods.reduce((sum, elem) => sum + (+elem.weight), 0)" disabled></td>
                            </tr>
                        </table>
                    </div>

                </div>
            </div>

            <button v-show="canAddContainer" @click.prevent="addContainer" class="cit_btn btn_add">+ Добавить контейнер</button>
            <br>
            <button :disabled="!activeSubmitButton" class="cit_btn btn_submit" @click.prevent="sendBid">Подписать и отправить</button>
            <button class="cit_btn btn_cancel">Отменить</button>
        </form>

        <receivingCreateForm
            v-if="showCreateForm"
            :mess="mess"
        >
        </receivingCreateForm>
    </div>
</template>

<script>
    import receivingCreateForm from "./receiving-create-form"
    import Datepicker from 'vue2-datepicker';

    export default {
        name: "receiving-main",
        components: {receivingCreateForm, Datepicker},

        data: function () {
            return {
                showCreateForm: true,
                bids: [],
                activeSubmitButton: false,
                canAddContainer: false,
                hours: [10, 12, 14],
                minutes: [10, 30, 45, 50],
                mess: ''
            }
        },

        watch: {
            "bids": {
                handler: function () {
                    if(this.bids.length > 0){
                        this.activeSubmitButton = this.bids.every(bid => {
                            return (bid.bidType === "WebGateIn" || bid.bidType === "WebGateOut") &&
                                (bid.bidEmpty === true || bid.bidEmpty === false) &&
                                (bid.size === 20 || bid.size === 40) &&
                                bid.container &&
                                (bid.bidEmpty || (bid.massa && bid.brutto)) &&
                                (!bid.WebInlandTransportation || (bid.placeInput && bid.contactPerson && bid.contactPhone && bid.waitingTime))
                                // bid.bidDate
                        });
                        this.canAddContainer = this.bids[0] &&
                            (this.bids[0].bidType === "WebGateIn" || (this.bids[0].bidType === "WebGateOut" && this.bids[0].bidEmpty))  &&
                            !this.bids[0].WebInlandTransportation && !this.bids[0].WebStaffingStripping;
                    }else{
                        this.activeSubmitButton = false;
                        this.canAddContainer = false;
                    }
                },
                deep: true
            }
        },

        computed: {
            nowDate: function () {
                let date = new Date();
                return (+date.getDate() < 10 ? "0"+date.getDate() : date.getDate())+'.'+
                    ((+date.getMonth() + 1) < 10 ? "0"+(+date.getMonth() + 1) : (+date.getMonth() + 1))+'.'+
                    date.getFullYear()
            },
        },

        methods: {
            createBid: function (bidObject) {
                this.bids.push(bidObject);
                this.showCreateForm = false;
            },

            setEmpty: function (index, empty = true) {
                if(this.bids[index]){
                    this.bids[index]["bidEmpty"] = !!empty;
                }
            },

            setSize: function (index, size) {
                if(this.bids[index]){
                    this.bids[index]["size"] = +size;
                }
            },

            getTextType: function (type) {
                switch (type) {
                    case "WebGateIn":
                        return "прием";
                    case "WebGateOut":
                        return "выдачу";
                    default:
                        return "";
                }
            },

            addContainer: function () {

            },

            sendBid: function () {
                this.mess = "Заявка отправлена";
                this.bids = [];
                this.showCreateForm = true;
                setTimeout(() => this.mess = "", 5000);

            },

            addGood: function (index) {
                if(this.bids[index] && this.bids[index].goods){
                    this.bids[index].goods.push({
                        name: "",
                        amount: 0,
                        weight: 0,
                        size: "",
                        pack: "",
                        dangerClass: "",
                        specialDemand: "",
                    });
                }
            },
            changeInputFileTitle: function(e){
                // console.dir(e.target);
                // e.target.files[0];
                e.target.parentElement.children[1].innerHTML = e.target.files[0].name;

            }
        },
        // mounted: function() {
        //    let fileInputs = document.querySelectorAll('.cit__form_attachment');
        //    console.log(fileInputs);
        //
        //    for(let i=0; i<fileInputs.length; i++){
        //        console.log(fileInputs[i].querySelector('input'));
        //        fileInputs[i].querySelector('input').addEventListener('change', e => console.log(e, i));
        //    }
        // }
    }
</script>

<style scoped>

</style>