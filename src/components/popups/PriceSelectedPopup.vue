<template>
    <div class="price-select-popup selected" v-show="$store.state.Popups.PriceSelectedPopup">
        <span class="close-cross" @click="$store.commit('closePopup', 'PriceSelectedPopup')">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M193.94 256L296.5 153.44l21.15-21.15c3.12-3.12 3.12-8.19 0-11.31l-22.63-22.63c-3.12-3.12-8.19-3.12-11.31 0L160 222.06 36.29 98.34c-3.12-3.12-8.19-3.12-11.31 0L2.34 120.97c-3.12 3.12-3.12 8.19 0 11.31L126.06 256 2.34 379.71c-3.12 3.12-3.12 8.19 0 11.31l22.63 22.63c3.12 3.12 8.19 3.12 11.31 0L160 289.94 262.56 392.5l21.15 21.15c3.12 3.12 8.19 3.12 11.31 0l22.63-22.63c3.12-3.12 3.12-8.19 0-11.31L193.94 256z"></path></svg>
        </span>
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
        <template v-if="$store.getters.getSelectedPriceElements.InlandTransportations.length">
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
        <template v-if="$store.getters.getSelectedPriceElements.RepairServices.length">
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
                    <td colspan="5"><span>Итого стоимость</span></td>
                    <td><div style="float:right;">{{totalRepairCost}}</div></td>
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

<style  lang="scss">
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
