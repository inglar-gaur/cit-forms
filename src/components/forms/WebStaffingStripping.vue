<template>
    <div v-if="$store.state.WebBid.wStaffingStripping">
        <!--        <div class="form_row">-->

        <!--            <fieldset class="load_period">-->
        <!--                <span class="title">{{ tableTitle }}</span>-->
        <!--                <div class="labels">-->
        <!--                    <label>-->
        <!--                        <span class="title">с</span>-->
        <!--                        &lt;!&ndash; // todo тут должен быть датапикер"       &ndash;&gt;-->
        <!--                        <input name="load_period_from" type="text">-->
        <!--                    </label>-->
        <!--                    <label>-->
        <!--                        <span class="title">до</span>-->
        <!--                        &lt;!&ndash; // todo тут должен быть датапикер"       &ndash;&gt;-->
        <!--                        <input name="load_period_to" type="text">-->
        <!--                    </label>-->
        <!--                </div>-->
        <!--            </fieldset>-->

        <!--        </div>-->

        <CargoDetails
                :elements="$store.state.WebBid.wStaffingStripping.Cargo.Elements"
                @changeCargoElement="$store.commit('changeCargoElement', {WebObjectType: 'wStaffingStripping', index:$event.index,  prop:$event.prop,  value:$event.value})"
                @addDefaultCargoElement="$store.commit('addDefaultCargoElement', 'wStaffingStripping')"
        ></CargoDetails>

        <div class="form_row" v-if="$store.getters.isWebGateIn">

            <table class="load_unload_table">
                <tr>
                    <th colspan="6">Объект перемещения груза (место нахождения груза)</th>
                </tr>
                <tr>
<!--                    <th></th>-->
                    <th>Открытая площадка</th>
                    <th>Вагон</th>
                    <th>Контейнер</th>
                    <th>Автотранспорт</th>
                    <th>Склад</th>
                    <th>Площадка</th>
                </tr>
                <tr>
<!--                    <th>{{loadTableTitle}}</th>-->
                    <td>
                        <label class="label_width_outside_input">
                            <input name="loading_out" value="0" type="radio" v-model="goodsPlace">
                            <span class="pseudo_checkbox"></span>
                        </label>
                    </td>
                    <td>
                        <label class="label_width_outside_input">
                            <input name="loading_out" value="1" type="radio" v-model="goodsPlace">
                            <span class="pseudo_checkbox"></span>
                        </label>
                    </td>
                    <td>
                        <label class="label_width_outside_input">
                            <input name="loading_out" value="2" type="radio" v-model="goodsPlace">
                            <span class="pseudo_checkbox"></span>
                        </label>
                    </td>
                    <td>
                        <label class="label_width_outside_input">
                            <input name="loading_out" value="3" type="radio" v-model="goodsPlace">
                            <span class="pseudo_checkbox"></span>
                        </label>
                    </td>
                    <td>
                        <label class="label_width_outside_input">
                            <input name="loading_out" value="4" type="radio" v-model="goodsPlace">
                            <span class="pseudo_checkbox"></span>
                        </label>
                    </td>
                    <td>
                        <label class="label_width_outside_input">
                            <input name="loading_out" value="5" type="radio" v-model="goodsPlace">
                            <span class="pseudo_checkbox"></span>
                        </label>
                    </td>
                </tr>
                <!--                <tr>-->
                <!--                    <th>Погрузка в</th>-->
                <!--                    <td>-->
                <!--                        <label class="label_width_outside_input">-->
                <!--                            <input name="loading_in" type="radio" disabled>-->
                <!--                            <span class="pseudo_checkbox"></span>-->
                <!--                        </label>-->
                <!--                    </td>-->
                <!--                    <td>-->
                <!--                        <label class="label_width_outside_input">-->
                <!--                            <input name="loading_in" type="radio" disabled :checked="operations.includes('WebGateIn')">-->
                <!--                            <span class="pseudo_checkbox"></span>-->
                <!--                        </label>-->
                <!--                    </td>-->
                <!--                    <td>-->
                <!--                        <label class="label_width_outside_input">-->
                <!--                            <input name="loading_in" type="radio" disabled>-->
                <!--                            <span class="pseudo_checkbox"></span>-->
                <!--                        </label>-->
                <!--                    </td>-->
                <!--                    <td>-->
                <!--                        <label class="label_width_outside_input">-->
                <!--                            <input name="loading_in" type="radio" disabled>-->
                <!--                            <span class="pseudo_checkbox"></span>-->
                <!--                        </label>-->
                <!--                    </td>-->
                <!--                    <td>-->
                <!--                        <label class="label_width_outside_input">-->
                <!--                            <input name="loading_in" type="radio" disabled>-->
                <!--                            <span class="pseudo_checkbox"></span>-->
                <!--                        </label>-->
                <!--                    </td>-->
                <!--                </tr>-->
            </table>

            <table style="margin-left: 40px">
                <tr>
                    <th>{{goodsPlaceTitle}}</th>
                </tr>
                <tr>
                    <td style="position: relative">
                        <input type="text" name="" style="height: 62px; position: absolute; top: 0; left: 0">
                    </td>
                </tr>
            </table>

<!--            <label style="margin-left: 30px">-->
<!--                <span class="title">Масса груза, кг</span>-->
<!--                <input type="number" name="receiving_form__cargo_parameters__weight">-->
<!--            </label>-->

        </div>
    </div>
</template>

<script>
    import CargoDetails from "./subForms/CargoDetails";
    export default {
        name: "WebStaffingStripping",
        components: {CargoDetails},
        data(){
          return {
              goodsPlace: -1
          };
        },
        computed: {
            tableTitle: function () {
                let tableTitle = 'Период выполнения';

                if (this.$store.state.SelectedBidPoints.list.includes('WebGateIn')) {
                    tableTitle += ' погрузочных работ';
                } else if (this.$store.state.SelectedBidPoints.list.includes('WebGateOut')) {
                    tableTitle += ' разгрузочных работ';
                }

                return tableTitle;
            },

            loadTableTitle: function () {
                let loadTableTitle = '';

                if (this.$store.state.SelectedBidPoints.list.includes('WebGateIn')) {
                    loadTableTitle += 'Разгрузка из';
                } else if (this.$store.state.SelectedBidPoints.list.includes('WebGateOut')) {
                    loadTableTitle += 'Погрузка в';
                }

                return loadTableTitle;
            },

            goodsPlaceTitle(){
                let places = ['Место площадки', 'Номер вагона', 'Номер контейнера', 'Номер автотранспорта', 'Номер склада', 'Место площадки'];

                return places[this.goodsPlace] ? places[this.goodsPlace] : 'Признак объекта';
            }
        }
    }
</script>

<style scoped>

</style>
