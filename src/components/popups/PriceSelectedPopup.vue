<template>
    <div class="price-select-popup selected" v-show="$store.state.Popups.PriceSelectedPopup" style="z-index: 10">
        <span class="close-cross" @click="$store.commit('closePopup', 'PriceSelectedPopup')">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M193.94 256L296.5 153.44l21.15-21.15c3.12-3.12 3.12-8.19 0-11.31l-22.63-22.63c-3.12-3.12-8.19-3.12-11.31 0L160 222.06 36.29 98.34c-3.12-3.12-8.19-3.12-11.31 0L2.34 120.97c-3.12 3.12-3.12 8.19 0 11.31L126.06 256 2.34 379.71c-3.12 3.12-3.12 8.19 0 11.31l22.63 22.63c3.12 3.12 8.19 3.12 11.31 0L160 289.94 262.56 392.5l21.15 21.15c3.12 3.12 8.19 3.12 11.31 0l22.63-22.63c3.12-3.12 3.12-8.19 0-11.31L193.94 256z"></path></svg>
        </span>
        <h3>Список заказанных услуг</h3>
        <template v-if="$store.getters.getSelectedServices.Basic.length">
            <h4>Услуги из прайса</h4>
            <table>
                <tr v-for="service in $store.getters.getSelectedServices.Basic">
                    <td>{{service.title}}</td>
                    <td></td>
                    <td>{{service.unit}}</td>
                    <td>{{service.Cost}}</td>
                </tr>
            </table>
        </template>
        <template v-if="$store.getters.getSelectedServices.InlandTransportations.length">
            <h4>автоперевозка контейнера</h4>
            <table>
                <tr>
                    <th>адрес</th>
                    <th colspan="3">единица измерения</th>
                    <th>стоимость в т.ч. НДС 20%</th>
                    <th>артикул</th>
                </tr>
                <tr v-for="service in $store.getters.getSelectedServices.InlandTransportations">
                    <td>{{service.Address}}</td>
                    <td>{{service.Unit}}</td>
                    <td>{{service.Size}}</td>
                    <td>{{service.Weight}}</td>
                    <td>{{service.Cost}}</td>
                    <td>{{service.Art}}</td>
                </tr>
            </table>
        </template>
        <template v-if="$store.getters.getSelectedServices.RepairServices.length">
            <h4>Услуги по ремонту</h4>
            <table>
                <tr>
                    <th>наименование повреждения</th>
                    <th>характеристика ремонта</th>
                    <th>категория ремонта</th>
                    <th>итоговая категория</th>
                    <th>стоимость в т.ч. НДС 20%</th>
                    <th>артикул</th>
                </tr>
                <tr v-for="service in $store.getters.getSelectedServices.RepairServices">
                    <td>{{service.Title}}</td>
                    <td>{{service.Characteristic}}</td>
                    <td>{{service.RepairCategory}}</td>
                    <td>{{service.TotalRepairCategory}}</td>
                    <td>{{service.Cost}}</td>
                    <td>{{service.Art}}</td>
                </tr>
<!--                <tr v-if="totalRepairCost">-->
<!--                    <td colspan="5"><span>Итого стоимость</span></td>-->
<!--                    <td><div style="float:right;">{{totalRepairCost}}</div></td>-->
<!--                </tr>-->
            </table>
        </template>
        <template v-if="$store.getters.getSelectedServices.InlandReturnTransportations.length">
            <h4>автоперевозка контейнера</h4>
            <table>
                <tr>
                    <th>наименование услуги</th>
                    <th>единица измерения</th>
                    <th>стоимость в т.ч. НДС 20%</th>
                    <th>артикул</th>
                </tr>
                <tr v-for="service in $store.getters.getSelectedServices.InlandReturnTransportations">
                    <td>{{service.Title}}</td>
                    <td>{{service.Unit}}</td>
                    <td>{{service.Cost}}</td>
                    <td>{{service.Art}}</td>
                </tr>
            </table>
        </template>
        <table v-if="$store.getters.getSelectedServices.TotalCost">
            <tr>
                <td>Итого стоимость: </td>
                <td>{{$store.getters.getSelectedServices.TotalCost}}</td>
            </tr>
        </table>
    </div>
</template>

<script>
    export default {
        name: "PriceSelectedPopup",

        computed:{
            totalRepairCost(){
                if(
                    this.$store.getters.getSelectedServices.RepairServices.length > 0 &&
                    this.$store.getters.getSelectedServices.RepairServices[this.$store.getters.getSelectedServices.RepairServices.length - 1].Cost
                ){
                    return this.$store.getters.getSelectedServices.RepairServices[this.$store.getters.getSelectedServices.RepairServices.length - 1].Cost;
                }
                return '';
            }
        },
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
