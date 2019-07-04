<template>
    <form class="cit_form receiving_form">

        <div v-show="mess" class="form_message success">
            {{ mess }}
        </div>

        <div class="application_wrap">
            <div class="application">
                <h2>Заявка на прием/выдачу контейнера</h2>
                <div class="form_row">
                    <div class="receiving_form_starting">

                        <!-- //todo проставить names в зависимости от того чекбоксы это или радио батоны -->
                        <div class="labels">
                            <label class="label_width_outside_input">
                                <input type="radio" v-model="bidType" value="WebGateIn">
                                <span class="pseudo_checkbox"></span>
                                <span class="title">Принять на терминал</span>
                            </label>
                            <label class="label_width_outside_input">
                                <input type="radio" v-model="bidType" value="WebGateOut">
                                <span class="pseudo_checkbox"></span>
                                <span class="title">Выдать с терминала</span>
                            </label>
                        </div>

                        <div class="labels" v-if="selectedBidType">
                            <label class="label_width_outside_input">
                                <input type="checkbox" v-model="dangerCargo">
                                <span class="pseudo_checkbox"></span>
                                <span class="title">Опасный груз</span>
                            </label>
                        </div>

                        <div class="labels"  v-if="selectedBidType">
                            <label class="label_width_outside_input">
                                <input v-model="WebInlandTransportation" type="checkbox">
                                <span class="pseudo_checkbox"></span>
                                <span class="title">Заказать автоперевозку</span>
                            </label>
                            <label class="label_width_outside_input">
                                <input v-model="WebStaffingStripping" type="checkbox">
                                <span class="pseudo_checkbox"></span>
                                <span class="title">Заказать погрузо-разгрузочные работы</span>
                            </label>
                        </div>

                        <div class="labels" v-if="selectedBidType">
                            <label class="label_width_outside_input">
                                <input v-model="WebCustomsRelease" type="checkbox">
                                <span class="pseudo_checkbox"></span>
                                <span v-if="bidType === 'WebGateIn'" class="title">Заказать перемещение из СВХ</span>
                                <span v-if="bidType === 'WebGateOut'" class="title">Переместить в СВХ</span>
                            </label>

<!--                            <label class="label_width_outside_input">-->
<!--                                <input v-if="" v-model="WebCustomsRelease" type="radio" value="to">-->
<!--                                <span class="pseudo_checkbox"></span>-->
<!--                                <span class="title">Переместить в СВХ</span>-->
<!--                            </label>-->
                        </div>

                    </div>
                </div>
            </div>
        </div>
        <button @click.prevent="createBid" :disabled="!selectedBidType" class="cit_btn btn_submit" type="submit">Создать заявку</button>
    </form>
</template>

<script>
    export default {
        name: "receiving-create-form",

        props: [
            "mess"
        ],

        data: function () {
            return {
                bidType: "",
                dangerCargo: false,
                WebInlandTransportation: false,
                WebCustomsRelease: false,
                WebStaffingStripping: false,
            }
        },

        computed: {
            selectedBidType: function(){
                return this.bidType === "WebGateIn" || this.bidType === "WebGateOut"
            },
        },

        methods: {
            createBid: function () {
                let bidObject = {};
                for (let propName in this.$data){
                    if(this.$data.hasOwnProperty(propName)){
                        bidObject[propName] = this.$data[propName];
                    }
                }
                bidObject.bidEmpty = null;
                bidObject.size = null;
                bidObject.bidDate = null;
                bidObject.container = "";
                bidObject.massa = null;
                bidObject.brutto = null;
                bidObject.placeInput = "";
                bidObject.contactPerson = "";
                bidObject.contactPhone = "";
                bidObject.waitingTime = "";
                bidObject.specialDemand = "";

                if(this.WebStaffingStripping){
                    bidObject.goods = [{
                        name: "",
                        amount: 0,
                        weight: 0,
                        size: "",
                        pack: "",
                        dangerClass: "",
                        specialDemand: "",
                    }];
                }
                this.$parent.createBid(bidObject);
            }
        }
    }
</script>

<style scoped>

</style>