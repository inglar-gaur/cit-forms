<template>
    <div>
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

        <div class="form_row">


            <table class="full_table receiving_cargo_information">
                <tr>
                    <th :colspan="$store.state.SelectedBidPoints.list.includes('DangerousGoods') ? 9 : 8">Сведения о
                        грузе
                    </th>
                </tr>
                <tr>
                    <th class="wide" colspan="3">Наименование груза (место)</th>
                    <th>Кол-во мест</th>
                    <th>Масса места, брутто (кг)</th>
                    <th>Габарит места Д/Ш/В, (мм)</th>
                    <th>Упаковка места (описание)</th>
                    <th v-if="$store.state.SelectedBidPoints.list.includes('DangerousGoods')">Класс опасности</th>
                    <th>Особые требования к обращению с грузом</th>
                </tr>
                <tr v-for="(WebCargoElement, index) in $store.state.WebCargoElements.list">
                    <td colspan="3">
                        <input
                                type="text"
                                @input="$store.commit('setWebCargoElementProp', {prop: 'Name', index: index, value: $event.target.value})"
                                :value="WebCargoElement.Name"
                        >
                    </td>
                    <td><input
                                type="text"
                                @input="$store.commit('setWebCargoElementProp', {prop: 'UnitCount', index: index, value: $event.target.value})"
                                :value="WebCargoElement.UnitCount"
                        >
                    </td>
                    <td><input
                              type="number"
                              @input="$store.commit('setWebCargoElementProp', {prop: 'UnitWeight', index: index, value: $event.target.value})"
                               :value="WebCargoElement.UnitWeight"
                      ></td>
                    <td><input
                            type="number"
                            @input="$store.commit('setWebCargoElementProp', {prop: 'UnitSize', index: index, value: $event.target.value})"
                            :value="WebCargoElement.UnitSize"
                    ></td>
                    <td><input
                            type="text"
                            @input="$store.commit('setWebCargoElementProp', {prop: 'PackageDescription', index: index, value: $event.target.value})"
                            :value="WebCargoElement.PackageDescription"
                    ></td>
                    <td v-if="$store.state.SelectedBidPoints.list.includes('DangerousGoods')">
                      <input type="text"
                             @input="$store.commit('setWebCargoElementProp', {prop: 'DangerousClassification', index: index, value: $event.target.value})"
                        :value="WebCargoElement.DangerousClassification"
                      >
                    </td>
                    <td><input
                            type="text"
                            @input="$store.commit('setWebCargoElementProp', {prop: 'specialDemand', index: index, value: $event.target.value})"
                            :value="WebCargoElement.specialDemand"
                    ></td>
                </tr>
                <tr>
                    <td>
                        <button @click.prevent="$store.commit('addWebCargoElement')" class="cit_btn btn_add">+ Добавить
                            строку
                        </button>
                    </td>
                    <td colspan="2">
                        <div class="sum">Итого:</div>
                    </td>
                    <td><input type="text" :value="$store.state.WebCargoElements.list.reduce((sum, elem) => sum + (+elem.UnitCount), 0)" disabled>
                    </td>
                    <td><input type="text" :value="$store.state.WebCargoElements.list.reduce((sum, elem) => sum + (+elem.UnitWeight), 0)" disabled>
                    </td>
                </tr>
            </table>
        </div>

        <div class="form_row">

            <table class="load_unload_table" v-if="$store.state.SelectedBidPoints.list.includes('WebGateIn')">
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
                            <input name="loading_out" type="radio">
                            <span class="pseudo_checkbox"></span>
                        </label>
                    </td>
                    <td>
                        <label class="label_width_outside_input">
                            <input name="loading_out" type="radio">
                            <span class="pseudo_checkbox"></span>
                        </label>
                    </td>
                    <td>
                        <label class="label_width_outside_input">
                            <input name="loading_out" type="radio">
                            <span class="pseudo_checkbox"></span>
                        </label>
                    </td>
                    <td>
                        <label class="label_width_outside_input">
                            <input name="loading_out" type="radio">
                            <span class="pseudo_checkbox"></span>
                        </label>
                    </td>
                    <td>
                        <label class="label_width_outside_input">
                            <input name="loading_out" type="radio">
                            <span class="pseudo_checkbox"></span>
                        </label>
                    </td>
                    <td>
                        <label class="label_width_outside_input">
                            <input name="loading_out" type="radio">
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
                    <th>Признак объекта (место, № и тп)</th>
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
    export default {
        name: "WebStaffingStripping",

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
        }
    }
</script>

<style scoped>

</style>
