<template>
    <div>

        <Messages></Messages>

        <form v-if="$store.state.SelectedBidPoints.list.length > 0" class="cit_form receiving_form" @submit="sendBid">
            <div class="application_wrap">
                <div class="application">
                    <h2>Заявка на {{ mainOperationTextType }} контейнера <span
                            class="application_number">№{{ 1 }}</span><small
                            v-if="$store.state.SelectedBidPoints.list.includes('WebInlandTransportation')"> +
                        автоперевозка</small></h2>

                    <div class="application_date">
                        <span>Дата подачи заявки: </span>
                        <input type="text" :value="nowDate" :placeholder="nowDate" readonly>
                    </div>

                    <div>
                        <OperationsList></OperationsList>
                        <TrackParameters></TrackParameters>
                        <CargoParameters
                                v-if="$store.state.WebBid.bidEmpty === 'full'"
                        ></CargoParameters>
                    </div>

                    <BidDateAndFiles
                            :canLoadVicarious="$store.state.WebBid.bidEmpty === true || $store.state.SelectedBidPoints.list.includes('WebGateOut')"
                            :canLoadDeclaration="$store.state.SelectedBidPoints.list.includes('WebGateIn')"
                    ></BidDateAndFiles>

                    <CustomRelease
                            v-if="$store.state.SelectedBidPoints.list.includes('WebCustomsRelease')"
                    ></CustomRelease>

                    <WebInlandTransportation
                            v-if="$store.state.SelectedBidPoints.list.includes('WebInlandTransportation')"
                    ></WebInlandTransportation>

                    <WebStaffingStripping
                            v-if="$store.state.SelectedBidPoints.list.includes('WebStaffingStripping')"
                    ></WebStaffingStripping>

                    <Repair
                            v-if="$store.state.SelectedBidPoints.list.includes('RepairContainer')"
                    ></Repair>

                    <div class="form_row">
                        <label @click="$store.commit('openPopup', 'PriceSelectPopup')">
                            <input style="width: 240px" type="text" value="+ Заказать услугу по прайсу" disabled>
                        </label>
                    </div>

                    <div class="form_row flex-start">
                        <label>
                            <input style="border: 2px solid lightgray; margin-right: 10px; width: 300px" type="text"
                                   value="Итого стоимость услуг:" disabled><span>руб.</span>
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
            <button :disabled="!$store.state.WebBid.bidEmpty || !$store.state.WebBid.bidSize" class="cit_btn btn_submit"
                    type="submit">Подписать и отправить
            </button>
            <button @click="clearForm" class="cit_btn btn_cancel">Отменить</button>
        </form>

        <receivingCreateForm
                v-else
        ></receivingCreateForm>

        <PriceSelectPopup></PriceSelectPopup>
        <PriceSelectedPopup></PriceSelectedPopup>

    </div>
</template>

<script>

    import receivingCreateForm from "./receiving-create-form";
    import WebInlandTransportation from "./../forms/WebInlandTransportation";
    import WebStaffingStripping from "./../forms/WebStaffingStripping";
    import OperationsList from "./OperationsList";
    import TrackParameters from "./TrackParameters";
    import CargoParameters from "./CargoParameters";
    import BidDateAndFiles from "./BidDateAndFiles";
    import CustomRelease from "./CustomRelease";
    import PriceSelectPopup from "../popups/PriceSelectPopup";
    import PriceSelectedPopup from "../popups/PriceSelectedPopup";
    import Messages from "../popups/Messages";
    import Repair from "../forms/Repair";

    export default {
        name: "receiving-main",
        components: {
            Repair,
            Messages,
            PriceSelectPopup,
            PriceSelectedPopup,
            BidDateAndFiles,
            CargoParameters,
            TrackParameters,
            OperationsList,
            receivingCreateForm,
            WebInlandTransportation,
            WebStaffingStripping,
            CustomRelease
        },

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

        watch: {
            "bids": {
                handler: function () {
                    if (this.bids.length > 0) {
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
                            (this.bids[0].bidType === "WebGateIn" || (this.bids[0].bidType === "WebGateOut" && this.bids[0].bidEmpty)) &&
                            !this.bids[0].WebInlandTransportation && !this.bids[0].WebStaffingStripping;
                    } else {
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
                return (+date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + '.' +
                    ((+date.getMonth() + 1) < 10 ? "0" + (+date.getMonth() + 1) : (+date.getMonth() + 1)) + '.' +
                    date.getFullYear()
            },

            mainOperationTextType: function () {
                if (this.WebGateIn) {
                    return "прием";
                } else if (this.WebGateOut) {
                    return "выдачу";
                }
                return "";
            },
        },

        methods: {
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

            sendBid: function () {
                this.addMess("Заявка отправлена");
                this.operations = [];

            },

            changeInputFileTitle: function (e) {
                // console.dir(e.target);
                // e.target.files[0];
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
    .close-cross {
        width: 25px;
        height: 25px;
        position: absolute;
        top: 10px;
        right: 10px;
        cursor: pointer;
    }
</style>
