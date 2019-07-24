<template>
    <div>

        <div v-show="mess.length > 0" class="form_message success">
            <svg @click="mess = []" class="close-cross" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path fill="gray" d="M193.94 256L296.5 153.44l21.15-21.15c3.12-3.12 3.12-8.19 0-11.31l-22.63-22.63c-3.12-3.12-8.19-3.12-11.31 0L160 222.06 36.29 98.34c-3.12-3.12-8.19-3.12-11.31 0L2.34 120.97c-3.12 3.12-3.12 8.19 0 11.31L126.06 256 2.34 379.71c-3.12 3.12-3.12 8.19 0 11.31l22.63 22.63c3.12 3.12 8.19 3.12 11.31 0L160 289.94 262.56 392.5l21.15 21.15c3.12 3.12 8.19 3.12 11.31 0l22.63-22.63c3.12-3.12 3.12-8.19 0-11.31L193.94 256z" class=""></path></svg>
            <p v-for="message in mess">{{ message }}</p>
        </div>

        <form v-if="operations.length > 0" class="cit_form receiving_form">
            <div class="application_wrap">
                <div class="application">
                    <h2>Заявка на {{ mainOperationTextType }} контейнера <span class="application_number">№{{ 1 }}</span><small v-if="bid.WebInlandTransportation"> + автоперевозка</small></h2>

                    <div class="application_date">
                        <span>Дата подачи заявки: </span>
                        <input type="text" :value="nowDate" :placeholder="nowDate" readonly>
                    </div>

                    <div class="form_row flex-start left-margin-30">
                        <OperationsList :operations="operations"></OperationsList>
                        <TrackParameters
                            :size="bidSize"
                            :bidEmpty="bidEmpty"
                        ></TrackParameters>
                        <CargoParameters
                            v-if="bidEmpty === 'full'"
                            :dangerCargo="bid.dangerCargo"
                            :bidEmpty="bid.bidEmpty"
                            :mass="bid.mass"
                            :gross="bid.gross"
                        ></CargoParameters>
                    </div>

                    <BidDateAndFiles
                        :operations="operations"
                        :canLoadVicarious="bid.bidEmpty === true || operations.includes('WebGateOut')"
                        :canLoadDeclaration="operations.includes('WebGateIn')"
                        :hours="hours"
                        :minutes="minutes"
                        :bidDate="bid.bidDate"
                    ></BidDateAndFiles>

                    <CustomRelease
                        v-if="operations.includes('WebCustomsRelease')"
                        :operations="operations"
                    ></CustomRelease>

                    <WebInlandTransportation
                        v-if="operations.includes('WebInlandTransportation')"
                        :operations="operations"
                        :specialDemand="bid.specialDemand"
                    ></WebInlandTransportation>

                    <WebStaffingStripping
                        v-if="operations.includes('WebStaffingStripping')"
                        :operations="operations"
                        :bidGoods="goods"
                    ></WebStaffingStripping>
                </div>

            </div>

            <button v-show="canAddContainer" @click.prevent="addContainer" class="cit_btn btn_add">+ Добавить контейнер</button>
            <br>
            <button :disabled="!bidEmpty || !bidSize" class="cit_btn btn_submit" @click.prevent="sendBid">Подписать и отправить</button>
            <button class="cit_btn btn_cancel">Отменить</button>
        </form>

        <receivingCreateForm
            v-if="operations.length <= 0"
            :mess="mess"
        >
        </receivingCreateForm>
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

    export default {
        name: "receiving-main",
        components: {
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
                bid: {
                    size: null,
                    bidEmpty: null,
                    mass: null,
                    gross: null,
                    dangerCargo: null,
                    container: null,
                    bidDate: null,
                    specialDemand: '',
                    goods: []
                },
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
                bidEmpty: '',
                bidSize: null,
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

            mainOperationTextType: function () {
                if(this.WebGateIn) {
                    return "прием";
                }else if(this.WebGateOut){
                    return "выдачу";
                }
                return "";
            },
        },

        methods: {
            createBid: function (operations) {
                if(Array.isArray(operations) && operations.length > 0){
                    this.operations = operations;
                }
            },

            setEmpty: function (empty) {
                if(empty){
                    this.bidEmpty = empty;
                }
            },

            setBidSize: function (size) {
                if(size){
                    this.bidSize = size;
                }
            },

            addContainer: function () {

            },

            sendBid: function () {
                this.addMess("Заявка отправлена");
                this.operations = [];

            },

            changeInputFileTitle: function(e){
                // console.dir(e.target);
                // e.target.files[0];
                e.target.parentElement.children[1].innerHTML = e.target.files[0].name;

            },

            setBidProp: function (prop, value) {
                if(prop && this.bid.hasOwnProperty(prop)){
                    this.bid[prop] = value;
                }
            },

            setBidGoods: function (index, prop, value) {
                if(
                    this.goods[index] &&
                    this.goods[index].hasOwnProperty(prop)
                ){
                    this.goods[index][prop] = value;
                    if(prop === 'weight' && +value > 1500){
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
                if(mess && !this.mess.includes(mess)){

                    // Если сообщение есть, добавляем его список
                    this.mess.push(mess);

                    // Убираем интервал очистки списка сообщений
                    if(this.clearMessTimer){
                        clearTimeout(this.clearMessTimer);
                    }

                    // Устанавливаем интервал чистки сообщений заново
                    this.clearMessTimer = setTimeout(() => this.mess = [], 4000);
                }
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
    .close-cross{
        width: 25px;
        height: 25px;
        position: absolute;
        top: 10px;
        right: 10px;
        cursor: pointer;
    }
</style>