<template>
    <div>
        <div>
            <fieldset class="chosen_parameters">
                <label v-for="(operation, index) in operationList" :key="index" class="label_width_outside_input">
                    <!-- // todo here inputs should be always checked and disabled       -->
                    <input name="" type="radio" checked readonly>
                    <span class="pseudo_checkbox"></span>
                    <span class="title">{{ operation }}</span>
                </label>
            </fieldset>

            <TrackParameters
                    :WebGateTypePostfix="WebGateTypePostfix"
                    :Container="Container"
            ></TrackParameters>
            <CargoParameters
                    v-if="WebGateTypePostfix === 'In' && Container && Container.Full"
            ></CargoParameters>
        </div>

        <WebInlandTransportation
                :WebGateTypePostfix="WebGateTypePostfix"
                :WebInlandTransportationObject="WebInlandTransportationObject"
                :Container="Container"
        ></WebInlandTransportation>

        <WebStaffingStripping></WebStaffingStripping>

        <Repair
                v-if="$store.state.WebBid.wRepairContainer"
        ></Repair>
    </div>
</template>

<script>

    import WebInlandTransportation from "./../forms/WebInlandTransportation";
    import WebStaffingStripping from "./../forms/WebStaffingStripping";
    import OperationsList from "./OperationsList";
    import TrackParameters from "./TrackParameters";
    import CargoParameters from "./CargoParameters";
    import Repair from "../forms/Repair";

    export default {
        name: "WebGate",

        components: {
            OperationsList,
            TrackParameters,
            CargoParameters,
            WebInlandTransportation,
            WebStaffingStripping,
            Repair
        },

        data() {
            return {
                WebGateObject: null,
                WebInlandTransportationObject: null,
            };
        },

        props: {
            WebGateTypePostfix: {type: String, default: ''}
        },

        created() {
            this.WebGateObject = this.$store.getters.getWebBidOperation('wGate' + this.WebGateTypePostfix);
            this.WebInlandTransportationObject = this.$store.getters.getWebBidOperation('wInlandTransportation' + this.WebGateTypePostfix);
        },

        computed: {
            operationList: function () {
                let operationList = [];

                if (this.WebGateObject) {
                    let subTitles;

                    switch (this.WebGateTypePostfix) {
                        case 'In':
                            operationList.push('принять на терминал');
                            subTitles = {stf: 'погрузку', transportation: 'до', custom: 'на'};
                            break;
                        case 'Out':
                            operationList.push('выдать с терминала');
                            subTitles = {stf: 'разгрузку', transportation: 'от', custom: 'из'};
                            break;
                    }
                    // Пустой или порожний контейнер
                    if (this.WebGateObject.Containers && Array.isArray(this.WebGateObject.Containers.ContainerList) && this.WebGateObject.Containers.ContainerList[0]) {
                        if (this.WebGateObject.Containers.ContainerList[0].State) {
                            operationList.push(this.WebGateObject.Containers.ContainerList[0].State);
                        }
                    }

                    if (this.WebGateObject.DangerousGoods) {
                        operationList.push('опасный груз');
                    }

                    if (subTitles) {
                        if (this.$store.state.WebBid.wStaffingStripping) {
                            operationList.push('заказать ' + subTitles.stf + ' контейнера');
                        }
                        if (this.WebInlandTransportationObject) {
                            operationList.push('заказать автоперевозку ' + subTitles.transportation + ' терминала');
                            if (this.WebInlandTransportationObject.ReturnContainer && this.Container) {
                                operationList.push('заказать обратную доставку' + (this.Container.Empty ? ' груженого' : '') + (this.Container.Full ? ' порожнего' : '') + ' контейнера');
                            }
                        }
                        if (this.$store.state.WebBid.wCustomsRelease) {
                            operationList.push('заказать перемещение ' + subTitles.custom + ' СВХ');
                        }
                        if (this.$store.state.WebBid.wRepairContainer) {
                            operationList.push('заказать ремонт контейнера');
                        }
                    }
                }

                return operationList;
            },

            WebGateType() {
                return 'wGate' + this.WebGateTypePostfix
            },

            Container(){
                return this.$store.getters['WebGate'+this.WebGateTypePostfix+'Container'];
            }
        }
    }
</script>

<style scoped>

</style>