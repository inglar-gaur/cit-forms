<template>
    <div>
        <div>
            <fieldset class="chosen_parameters">
                <label v-for="operation in operationList" class="label_width_outside_input">
                    <!-- // todo here inputs should be always checked and disabled       -->
                    <input name="" type="radio" checked readonly>
                    <span class="pseudo_checkbox"></span>
                    <span class="title">{{ operation }}</span>
                </label>
            </fieldset>

            <TrackParameters
                :WebGateObject="WebGateObject"
                :WebGateType="WebGateType"
            ></TrackParameters>
            <CargoParameters
                    v-if="fullContainer"
            ></CargoParameters>
        </div>

        <WebInlandTransportation></WebInlandTransportation>

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

        components: {OperationsList, TrackParameters, CargoParameters, WebInlandTransportation, WebStaffingStripping, Repair},

        data(){
            return {
                WebGateObject: null
            };
        },

        props: {
            WebGateType: {type: String, default: ''}
        },

        created() {
            this.WebGateObject = this.$store.getters.getWebBidOperation(this.WebGateType);
        },

        computed: {
            operationList: function(){
                let operationList = [];

                if(this.WebGateObject){
                    let subTitles;

                    switch (this.WebGateType) {
                        case 'wGateIn':
                            operationList.push('принять на терминал');
                            subTitles = {stf: 'погрузку', transportation: 'до', custom: 'на'};
                            break;
                        case 'wGateOut':
                            operationList.push('выдать с терминала');
                            subTitles = {stf: 'разгрузку', transportation: 'от', custom: 'из'};
                            break;
                    }
                    // Пустой или порожний контейнер
                    if(this.WebGateObject.Containers && Array.isArray(this.WebGateObject.Containers.ContainerList) && this.WebGateObject.Containers.ContainerList[0]){
                        if(this.WebGateObject.Containers.ContainerList[0].State){
                            operationList.push(this.WebGateObject.Containers.ContainerList[0].State);
                        }
                    }

                    if(this.WebGateObject.DangerousGoods){
                        operationList.push('опасный груз');
                    }

                    if(subTitles){
                        if(this.$store.state.WebBid.wStaffingStripping){
                            operationList.push('заказать '+subTitles.stf+' контейнера');
                        }
                        if(this.$store.state.WebBid.wInlandTransportation){
                            operationList.push('заказать автоперевозку '+subTitles.transportation+' терминала');
                            if(this.$store.state.WebBid.wInlandTransportation.ReturnContainer){
                                operationList.push('заказать обратную доставку'+(this.$store.getters.isEmptyOutGateContainer ? ' груженого' : ' порожнего')+' контейнера');
                            }
                        }
                        if(this.$store.state.WebBid.wCustomsRelease){
                            operationList.push('заказать перемещение '+subTitles.custom+' СВХ');
                        }
                    }
                }

                return operationList;
            },

            fullContainer(){
                return !!this.WebGateObject.Containers && Array.isArray(this.WebGateObject.Containers.ContainerList) && this.WebGateObject.Containers.ContainerList[0] && this.WebGateObject.Containers.ContainerList[0].State === 'груженый';
            }
        }
    }
</script>

<style scoped>

</style>