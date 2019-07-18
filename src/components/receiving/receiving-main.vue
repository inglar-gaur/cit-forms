<template>
    <div>

        <form v-if="operations.length > 0" class="cit_form receiving_form">
            <div class="application_wrap">
                <div class="application">
                    <h2>Заявка на {{ mainOperationTextType }} контейнера <span class="application_number">№{{ 1 }}</span><small v-if="bid.WebInlandTransportation"> + автоперевозка</small></h2>

                    <div class="application_date">
                        <span>Дата подачи заявки: </span>
                        <input type="text" :value="nowDate" :placeholder="nowDate" readonly>
                    </div>

                    <div class="form_row">
                        <OperationsList :operations="operations"></OperationsList>
                        <TrackParameters
                            :size="bid.size"
                            :bidEmpty="bid.bidEmpty"
                        ></TrackParameters>
                        <CargoParameters
                            :dangerCargo="bid.dangerCargo"
                            :bidEmpty="bid.bidEmpty"
                            :mass="bid.mass"
                            :gross="bid.gross"
                        ></CargoParameters>
                    </div>

                    <BidDateAndFiles
                        :canLoadVicarious="bid.bidEmpty === true || operations.includes('WebGateOut')"
                        :canLoadDeclaration="operations.includes('WebGateIn')"
                        :hours="hours"
                        :minutes="minutes"
                        :bidDate="bid.bidDate"
                    ></BidDateAndFiles>


                    <WebInlandTransportation
                        v-if="operations.includes('WebInlandTransportation')"
                        :specialDemand="bid.specialDemand"
                    ></WebInlandTransportation>

                    <WebStaffingStripping
                        v-if="operations.includes('WebStaffingStripping')"
                        :bidGoods="bid.goods"
                    ></WebStaffingStripping>
                </div>

            </div>

            <button v-show="canAddContainer" @click.prevent="addContainer" class="cit_btn btn_add">+ Добавить контейнер</button>
            <br>
            <button :disabled="!activeSubmitButton" class="cit_btn btn_submit" @click.prevent="sendBid">Подписать и отправить</button>
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

    export default {
        name: "receiving-main",
        components: {
            BidDateAndFiles,
            CargoParameters,
            TrackParameters,
            OperationsList, receivingCreateForm, WebInlandTransportation, WebStaffingStripping},

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
                operations: [],
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

            },

            setBidProp: function (prop, value) {
                if(prop && this.bid.hasOwnProperty(prop)){
                    this.bid[prop] = value;
                }
            },

            setBidGoods: function (index, prop, value) {
                if(
                    this.bid &&
                    this.bid.goods &&
                    this.bid.goods[index] &&
                    this.bid.goods[index].hasOwnProperty(prop)
                ){
                    this.bid.goods[index][prop] = value;
                }
            },

            addBidGoods: function () {
                if(this.bid && Array.isArray(this.bid.goods)){
                    this.bid.goods.push(
                        {
                            name: null,
                            amount: null,
                            weight: null,
                            size: null,
                            pack: null,
                            dangerClass: null,
                            specialDemand: "",
                        }
                    );
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

</style>