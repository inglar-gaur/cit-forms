<template>
    <div class="price-select-popup selected" v-show="$store.state.Popups.PriceSelectedPopup" style="z-index: 10">
        <span class="close-cross" @click="$store.commit('closePopup', 'PriceSelectedPopup')">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M193.94 256L296.5 153.44l21.15-21.15c3.12-3.12 3.12-8.19 0-11.31l-22.63-22.63c-3.12-3.12-8.19-3.12-11.31 0L160 222.06 36.29 98.34c-3.12-3.12-8.19-3.12-11.31 0L2.34 120.97c-3.12 3.12-3.12 8.19 0 11.31L126.06 256 2.34 379.71c-3.12 3.12-3.12 8.19 0 11.31l22.63 22.63c3.12 3.12 8.19 3.12 11.31 0L160 289.94 262.56 392.5l21.15 21.15c3.12 3.12 8.19 3.12 11.31 0l22.63-22.63c3.12-3.12 3.12-8.19 0-11.31L193.94 256z"></path></svg>
        </span>
        <h3>Список заказанных услуг</h3>
        <template v-if="SelectedBasicServices.length">
            <h4>терминальное обслуживание универсального контейнера</h4>
            <table>
                <tr>
                    <th>наименование услуги</th>
                    <th>единица измерения</th>
                    <th>стоимость в т.ч. НДС 20%</th>
                    <th>артикул</th>
                </tr>
                <tr v-for="service in SelectedBasicServices" :key="service.Art">
                    <td>{{service.Title}}</td>
                    <td>{{service.Unit}}</td>
                    <td>{{service.Cost}}</td>
                    <td>{{service.Art}}</td>
                </tr>
            </table>
        </template>
        <template v-if="SelectedInlandTransportationServices.length">
            <h4>автоперевозка контейнера</h4>
            <table>
                <tr>
                    <th>адрес</th>
                    <th colspan="3">единица измерения</th>
                    <th>стоимость в т.ч. НДС 20%</th>
                    <th>артикул</th>
                </tr>
                <tr v-for="service in SelectedInlandTransportationServices" :key="service.Art">
                    <td>{{service.Address}}</td>
                    <td>{{service.Unit}}</td>
                    <td>{{service.Size}}</td>
                    <td>{{service.Weight}}</td>
                    <td>{{service.Cost}}</td>
                    <td>{{service.Art}}</td>
                </tr>
            </table>
        </template>
        <template v-if="SelectedRepairServices.length">
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
                <tr v-for="(service, RepairIndex) in SelectedRepairServices" :key="RepairIndex">
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
        <template v-if="SelectedSingleServices.DefectCheck.length">
            <h4>Услуги по ремонту</h4>
            <table>
                <tr>
                    <th>наименование услуги</th>
                    <th>единица измерения</th>
                    <th>стоимость в т.ч. НДС 20%</th>
                    <th>артикул</th>
                </tr>
                <tr v-for="service in SelectedSingleServices.DefectCheck" :key="service.Art">
                    <td>{{service.Title}}</td>
                    <td>{{service.Unit}}</td>
                    <td>{{service.Cost}}</td>
                    <td>{{service.Art}}</td>
                </tr>
                <!--                <tr v-if="totalRepairCost">-->
                <!--                    <td colspan="5"><span>Итого стоимость</span></td>-->
                <!--                    <td><div style="float:right;">{{totalRepairCost}}</div></td>-->
                <!--                </tr>-->
            </table>
        </template>
        <template v-if="SelectedSingleServices.InlandReturnTransportations.length">
            <h4>автоперевозка контейнера</h4>
            <table>
                <tr>
                    <th>наименование услуги</th>
                    <th>единица измерения</th>
                    <th>стоимость в т.ч. НДС 20%</th>
                    <th>артикул</th>
                </tr>
                <tr v-for="service in SelectedSingleServices.InlandReturnTransportations" :key="service.Art">
                    <td>{{service.Title}}</td>
                    <td>{{service.Unit}}</td>
                    <td>{{service.Cost}}</td>
                    <td>{{service.Art}}</td>
                </tr>
            </table>
        </template>
        <template v-if="SelectedStaffingServices.length">
            <h4>погрузо-разгрузочные работы</h4>
            <table>
                <tr>
                    <th colspan="3"></th>
                    <th>ед. изм.</th>
                    <th>кол-во</th>
                    <th>расценка</th>
                    <th>стоимость в т.ч. НДС 20%</th>
                    <th>артикул</th>
                </tr>
                <tr v-for="service in SelectedStaffingServices" :key="service.Art">
                    <td>{{service.PackageType}}</td>
                    <td>{{service.PackageRequirement}}</td>
                    <td>{{service.Title}}</td>
                    <td>{{service.Unit}}</td>
                    <td>{{service.Number}}</td>
                    <td>{{service.UnitCost}}</td>
                    <td>{{service.Cost}}</td>
                    <td>{{service.Art}}</td>
                </tr>
                <tr v-if="totalWeight">
                    <td colspan="6">Итоговый вес</td>
                    <td colspan="2">{{totalWeight}}</td>
                </tr>
            </table>
        </template>
        <template v-if="SelectedPriceServices.length">
            <h4>терминальное обслуживание универсального контейнера</h4>
            <table>
                <tr>
                    <th>наименование услуги</th>
                    <th>ед.изм.</th>
                    <th>кол-во</th>
                    <th>расценки</th>
                    <th>стоимость в т.ч. НДС 20%</th>
                    <th>артикул</th>
                </tr>
                <template v-for="service in SelectedPriceServices">
                    <tr v-if="service.TypeTitle" :key="service.Art+'_type_title'">
                        <th colspan="6">{{service.TypeTitle}}</th>
                    </tr>
                    <tr v-if="service.CategoryTitle" :key="service.Art+'_category_title'">
                        <th colspan="6">{{service.CategoryTitle}}</th>
                    </tr>
                    <tr :key="service.Art">
                        <td>{{service.Title}}</td>
                        <td>{{service.Unit}}</td>
                        <td>{{service.Number}}</td>
                        <td>{{service.CostForUnit}}</td>
                        <td>{{service.Cost}}</td>
                        <td>{{service.Art}}</td>
                    </tr>
                </template>
            </table>
        </template>
        <table v-if="$store.getters.ServicesTotalCost">
            <tr>
                <td>Итого стоимость: </td>
                <td>{{$store.getters.ServicesTotalCost}}</td>
            </tr>
        </table>
    </div>
</template>

<script>

    import { mapGetters } from 'vuex';

    export default {
        name: "PriceSelectedPopup",

        computed:{

            totalWeight(){
                if(Array.isArray(this.SelectedStaffingServices) && this.SelectedStaffingServices.length > 0){
                    let totalWeight = this.SelectedStaffingServices.reduce(
                        (BetweenWeight, StaffingService) => BetweenWeight + (StaffingService.UnitWeight * StaffingService.UnitCount)
                    );
                    if(totalWeight > 0)
                        return totalWeight + ' кг';
                }
                return '';
            },

            totalRepairCost(){
                if(
                    this.SelectedRepairServices.length > 0 &&
                    this.SelectedRepairServices[this.SelectedRepairServices.length - 1].Cost
                ){
                    return this.SelectedRepairServices[this.SelectedRepairServices.length - 1].Cost;
                }
                return '';
            },

            ...mapGetters([
                'SelectedBasicServices',
                'SelectedInlandTransportationServices',
                'SelectedRepairServices',
                'SelectedStaffingServices',
                'SelectedSingleServices',
                'SelectedPriceServices',
            ])
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
