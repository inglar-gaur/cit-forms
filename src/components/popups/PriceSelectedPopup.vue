<template>
    <div class="price-select-popup" v-show="$store.state.Popups.PriceSelectedPopup">
        <span class="close-cross" @click="$store.commit('closePopup', 'PriceSelectedPopup')">x</span>
        <h3>Список заказанных услуг</h3>
        <template v-if="$store.getters.getSelectedPriceElements.Basic.length">
            <h4>Услуги из прайса</h4>
            <table>
                <tr v-for="service in $store.getters.getSelectedPriceElements.Basic">
                    <td>{{service.title}}</td>
                    <td></td>
                    <td>{{service.unit}}</td>
                    <td>{{service.cost}}</td>
                </tr>
            </table>
        </template>
        <template v-if="$store.getters.getSelectedPriceElements.InlandTransportations">
            <h4>Услуги доставки</h4>
            <table>
                <tr v-for="service in $store.getters.getSelectedPriceElements.InlandTransportations">
                    <td>{{service.title}}</td>
                    <td>{{service.street}}</td>
                    <td>{{service.houseNumber}}</td>
                    <td>{{service.cost}}</td>
                </tr>
            </table>
        </template>
        <template v-if="$store.getters.getSelectedPriceElements.RepairServices">
            <h4>Услуги по ремонту</h4>
            <table>
                <tr v-for="service in $store.getters.getSelectedPriceElements.RepairServices">
                    <td>{{service.Title}}</td>
                    <td>{{service.Characteristic}}</td>
                    <td>{{service.Barcode}}</td>
                    <td>{{service.RepairCategory}}</td>
                    <td>{{service.TotalRepairCategory}}</td>
                    <td>{{service.Cost}}</td>
                </tr>
                <tr v-if="totalRepairCost">
                    <td colspan="5" style="float: right"><span>Итого стоимость</span></td>
                    <td>{{totalRepairCost}}</td>
                </tr>
            </table>
        </template>
    </div>
</template>

<script>
    export default {
        name: "PriceSelectedPopup",

        computed:{
            totalRepairCost(){
                if(
                    this.$store.getters.getSelectedPriceElements.RepairServices.length > 0 &&
                    this.$store.getters.getSelectedPriceElements.RepairServices[this.$store.getters.getSelectedPriceElements.RepairServices.length - 1].Cost
                ){
                    return this.$store.getters.getSelectedPriceElements.RepairServices[this.$store.getters.getSelectedPriceElements.RepairServices.length - 1].Cost;
                }
                return '';
            }
        }
    }
</script>

<style scoped lang="scss">
    .price-select-popup {

        position: fixed;
        background-color: white;
        z-index: 1000;
        top: 2.5%;
        right: 2.5%;

        width: 45vw;
        height: 95vh;

        border: 2px solid #DA2341;
    }

    .close-cross{
        position: absolute;
        top: 5px;
        right: 15px;
        color: red;
        font-size: 30px;
        cursor: pointer;
    }
</style>
