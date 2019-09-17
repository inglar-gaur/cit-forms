<template>
    <div>

        <Messages></Messages>

        <form v-if="isWebGateIn || isWebGateOut" class="cit_form receiving_form" @submit.prevent="sendBid">
            <div class="application_wrap">
                <div class="application">
                    <h2>Заявка на {{ mainOperationTextType }} контейнера <span class="application_number">№{{ 1 }}</span>
<!--                        <small-->
<!--                            v-if="$store.state.SelectedBidPoints.list.includes('WebInlandTransportation')"> +-->
<!--                        автоперевозка</small>-->
                    </h2>

                    <div class="application_date">
                        <span>Дата подачи заявки: </span>
                        <input type="text" :value="nowDate" :placeholder="nowDate" readonly>
                    </div>

                    <BidDateAndFiles></BidDateAndFiles>

                    <WebGate
                            v-if="isWebGateIn"
                            WebGateTypePostfix="In"
                    ></WebGate>

                    <WebGate
                            v-if="isWebGateOut"
                            WebGateTypePostfix="Out"
                    ></WebGate>

                    <PriceServices></PriceServices>

                    <div class="form_row" v-if="false">
                        <label @click="$store.commit('openPopup', 'PriceSelectPopup')">
                            <input style="width: 240px" type="text" value="+ Заказать услугу по прайсу" disabled>
                        </label>
                    </div>

                    <div class="form_row flex-start">
                        <label>
                            <input style="border: 2px solid lightgray; margin-right: 10px; width: 300px" type="text"
                                   :value="'Итого стоимость услуг: '+$store.getters.getSelectedServices.TotalCost" disabled>
                            <span v-if="+$store.getters.getSelectedServices.TotalCost > 0">руб.</span>
                        </label>
                        <label @click="$store.commit('openPopup', 'PriceSelectedPopup')">
                            <input style="width: 270px; margin-left: 50px" type="text" value="Раскрыть список заказанных услуг" disabled>
                        </label>
                    </div>

                    <div class="form_row">
                        <label v-show="true" class="cit__form_attachment receiving_add_file">
                            <input type="file" name="receiving_declaration_file" placeholder="Приложить декларацию"
                                   @change="changeInputFileTitle">
                            <span class="cit__form_attachment__title">Приложить доверенность</span>
                        </label>
                    </div>
                </div>

            </div>

            <button v-show="canAddContainer" @click.prevent="addContainer" class="cit_btn btn_add">+ Добавить
                контейнер
            </button>
            <br>
            <!--            <button :disabled="!bidEmpty || !bidSize" class="cit_btn btn_submit" @click.prevent="sendBid">Подписать и отправить</button>-->
            <button :disabled="!$store.getters.canSubmitBid" class="cit_btn btn_submit"
                    type="submit">Подписать и отправить
            </button>
            <button @click="$store.commit('clearForm')" class="cit_btn btn_cancel">Отменить</button>
        </form>

        <receivingCreateForm
                v-else
        ></receivingCreateForm>


        <PriceSelectedPopup></PriceSelectedPopup>

    </div>
</template>

<script>

    import receivingCreateForm from "./ReceivingCreateForm";
    import BidDateAndFiles from "./BidDateAndFiles";
    import PriceSelectPopup from "../popups/PriceSelectPopup";
    import PriceSelectedPopup from "../popups/PriceSelectedPopup";
    import Messages from "../popups/Messages";
    import WebGate from "./WebGate";
    import PriceServices from "../forms/PriceServices";
    import { mapGetters } from 'vuex'

    export default {
        name: "receiving-main",
        components: {Messages, BidDateAndFiles, WebGate, receivingCreateForm, PriceSelectPopup, PriceSelectedPopup, PriceServices},

        data: function () {
            return {
                goods: [],
                operations: [],
                showCreateForm: true,
                bids: [],
                activeSubmitButton: false,
                canAddContainer: false,
                hours: [10, 12, 14],
                minutes: [10, 30, 45, 50],
                mess: [],
                clearMessTimer: null,
                PriceSelectPopup: false,
                PriceSelectedPopup: false,
            }
        },

        computed: {
            nowDate: function () {
                let date = new Date();
                return (+date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + '.' +
                    ((+date.getMonth() + 1) < 10 ? "0" + (+date.getMonth() + 1) : (+date.getMonth() + 1)) + '.' +
                    date.getFullYear()
            },

            mainOperationTextType: function () {
                if (this.$store.getters.isWebGateIn) {
                    return "прием";
                } else if (this.$store.getters.isWebGateOut){
                    return "выдачу";
                }
                return "";
            },

            ...mapGetters([
                'isWebGateIn',
                'isWebGateOut',
            ])
        },

        created(){
            this.$store.commit('addDefaultContainer');
        },

        methods: {

            sendBid() {

                // let originWebBid = this.$store.state.WebBid;

                // Формируем объект заявки для отправки на сервер
                let postWebBid = {
                    Id: 0,
                    gId: "00000000-0000-0000-0000-000000000000",
                    ApplicationDate: new Date(),
                    Account: null,
                    Status:  "Подана",
                    DangerousGoods: !!this.$store.state.WebBid.DangerousGoods,
                    Documents: this.$store.state.WebBid.Documents,
                    wGateOut: this.$store.state.WebBid.wGateOut,
                    wGateIn: this.$store.state.WebBid.wGateIn,
                    wShipping: this.$store.state.WebBid.wShipping,
                    wStaffingStripping: this.$store.state.WebBid.wStaffingStripping,
                    wInlandTransportationIn: this.$store.state.WebBid.wInlandTransportationIn,
                    wInlandTransportationOut: this.$store.state.WebBid.wInlandTransportationOut,
                    wCustomsRelease: this.$store.state.WebBid.wCustomsRelease,
                    wRepairContainer: this.$store.state.WebBid.wRepairContainer,
                };

                let container;

                // Добавляем данные из контейнера в заявку (состояние и размер)
                if(postWebBid.wGateIn){
                    container = this.$store.getters.WebGateInContainer;

                    postWebBid.wGateIn.DatePlan = this.$store.state.WebBid.ApplicationDate;
                    if(container){
                        postWebBid.wGateIn.State = container.State;
                        postWebBid.wGateIn.Size = container.Size;
                    }

                }
                if(postWebBid.wGateOut){
                    container = this.$store.getters.WebGateOutContainer;

                    postWebBid.wGateOut.DatePlan = this.$store.state.WebBid.ApplicationDate;
                    if(container){
                        postWebBid.wGateOut.State = container.State;
                        postWebBid.wGateOut.Size = container.Size;
                    }
                }

                // Создание заявки
                let FetchBody = new FormData();
                FetchBody.set('token', '50338070-7c76-477e-af2c-c86039f349c6');
                FetchBody.set('WebBid', JSON.stringify(postWebBid));
                fetch('http://api.cit-ekb.ru/CreateWebBid', {
                    method: 'post',
                    body: FetchBody,
                    // headers:{
                    //     'Content-Type': 'json'
                    // }
                }).then(CreateWebBidFetch => {
                    CreateWebBidFetch.json().then(resp => {
                        // resp = JSON.parse(resp);
                        if(resp && resp.status === 'ok' && +resp.bidId > 0){

                            this.$store.commit('addMessage', 'Заявка создана');
                            this.$store.commit('clearForm');

                            FetchBody = new FormData();
                            FetchBody.set('token', '50338070-7c76-477e-af2c-c86039f349c6');
                            FetchBody.set('idBid', resp.bidId);
                            fetch(
                                'http://api.cit-ekb.ru//GeneratePassCard?'+
                                'token=50338070-7c76-477e-af2c-c86039f349c6&'+
                                'idBid='+resp.bidId
                            ).then(GetBarCodeFetch => {
                                GetBarCodeFetch.json().then(resp => {
                                    // resp = JSON.parse(resp);

                                    if(resp && resp.PassCard){
                                        let printWindow = window.open('', 'PRINT', 'height=400,width=600');
                                        printWindow.document.write(resp.PassCard);
                                        printWindow.document.close(); // necessary for IE >= 10
                                        printWindow.focus(); // necessary for IE >= 10*/

                                        printWindow.print();
                                    }

                                })

                            });
                        }
                    });
                    // CreateWebBidResult = JSON.parse(CreateWebBidResult);
                });

                // CreateWebBidFetch.then(resp => {
                //
                //     console.log(resp);
                //     if(resp && resp.data && resp.data.status === 'ok' && +resp.data.bidId > 0){
                //         this.getBarCode(+resp.data.bidId);
                //         this.$store.commit('addMessage', 'Заявка создана');
                //         this.$store.commit('clearForm');
                //     }
                // });

            },

            createBid: function (operations) {
                if (Array.isArray(operations) && operations.length > 0) {
                    this.operations = operations;
                }
            },

            setEmpty: function (empty) {
                if (empty) {
                    this.bidEmpty = empty;
                }
            },

            setBidSize: function (size) {
                if (size) {
                    this.bidSize = size;
                }
            },

            setContainerNumber: function (containerNumber) {
                if (+containerNumber > 0) {
                    this.containerNumber = +containerNumber;
                }
            },

            addContainer: function () {

            },

            async getBarCode(payload){
                // console.log(context);
                /* eslint-disable no-console */
                console.log(payload);
                /* eslint-enable no-console */
                let getBarCodeFetch = await fetch(
                    'http://api.cit-ekb.ru/GeneratePassCard?token=50338070-7c76-477e-af2c-c86039f349c6&idBid='+'0',
                );
            },

            changeInputFileTitle: function (e) {
                e.target.parentElement.children[1].innerHTML = e.target.files[0].name;
            },

            setBidProp: function (prop, value) {
                if (prop && this.bid.hasOwnProperty(prop)) {
                    this.bid[prop] = value;
                }
            },

            setBidGoods: function (index, prop, value) {
                if (
                    this.goods[index] &&
                    this.goods[index].hasOwnProperty(prop)
                ) {
                    this.goods[index][prop] = value;
                    if (prop === 'weight' && +value > 1500) {
                        this.addMess('При дальнейшей отправке контейнера по ж/д со ст. Кольцово с заданными параметрами одного грузового места могут потребоваться особые условия перевозки.');
                    }
                }
            },

            addBidGoods: function () {
                this.goods.push({
                    name: null,
                    amount: null,
                    weight: null,
                    size: null,
                    pack: null,
                    dangerClass: null,
                    specialDemand: "",
                });
            },

            /**
             * Добавить сообщение
             * @param {string} mess
             */
            addMess: function (mess) {
                if (mess && !this.mess.includes(mess)) {

                    // Если сообщение есть, добавляем его список
                    this.mess.push(mess);

                    // Убираем интервал очистки списка сообщений
                    if (this.clearMessTimer) {
                        clearTimeout(this.clearMessTimer);
                    }

                    // Устанавливаем интервал чистки сообщений заново
                    this.clearMessTimer = setTimeout(() => this.mess = [], 4000);
                }
            },

            openPriceSelect: function () {

            },

            clearForm: function () {
                this.webGate = null;
            }
        },
    }
</script>

<style lang="scss">

    .price-select-popup {

        h2, h3, h4, h5{
            margin-bottom: 0.75em;
        }

        position: fixed;
        background-color: white;
        z-index: 1000;
        top: 2.5vh;

        width: 45vw;
        height: 95vh;
        padding: 75px 30px;
        border: 2px solid #DA2341;
        overflow: auto;

        &.select{
            left: 4vw;
        }
        &.selected{
            right: 4vw;
        }

        .close-cross{
            position: absolute;
            top: 5px;
            right: 15px;
            color: red;
            font-size: 30px;
            cursor: pointer;
            svg{
                width: 20px;
                fill: red;
                transition: all 0.1s ease-in-out;
            }
            &:hover{
                svg{
                    opacity: 0.7;
                    transform: scale(1.3) rotate(90deg);
                }
            }
        }

        table{
            border-collapse: collapse;
            margin-bottom: 30px;
            width: 100%;
            td{
                border: 1px solid lightgray;
                min-height: 40px;
                min-width: 40px;
                padding: 10px;

                .label_width_outside_input{
                    cursor: pointer;
                    justify-content: center;
                    .pseudo_checkbox{
                        margin-right: 0;
                    }
                }

            }


            // delete outer borders

            tr:first-child{
                td{
                    /*border-top: transparent;*/
                }
            }
            tr:last-child{
                td{
                    /*border-bottom: transparent;*/
                }
            }

            td:first-child{
                /*border-left: transparent;*/
            }
            td:last-child{
                /*border-right: transparent;*/
            }

        }

    }


</style>
