<template>
    <div class="form_row">
        <table class="full_table receiving_cargo_information">
            <tr>
                <th colspan="2" style="width: 16%">описание груза</th>
                <td rowspan="2" style="width: 3%"></td>
                <th class="wide" colspan="3" rowspan="2">Наименование груза (место)</th>
                <th colspan="3">Габарит места (мм)</th>
                <th rowspan="2">Масса места, брутто (кг)</th>
                <th rowspan="2">Кол-во мест</th>
                <th v-if="$store.getters.isDangerousGoods" rowspan="2">Класс опасности</th>
                <th rowspan="2">Особые требования к обращению с грузом</th>
            </tr>
            <tr>
                <th style="width: 8%">вид упаковки</th>
                <th style="width: 8%">требования к упаковке</th>
                <th>Длина</th>
                <th>Ширина</th>
                <th>Высота</th>
            </tr>
            <tr v-for="(WebCargoElement, index) in elements" :key="index">
                <td>
                    <EmulateSelect
                            :placeholder="'Выберите вид'"
                            :elementsList="PackTypes"
                            @selectElement="ChangeCargoElement(index, 'PackType', $event)"
                    ></EmulateSelect>
                </td>
                <td></td>
                <td></td>
                <td colspan="3">
                    <input
                            type="text"
                            @input="$emit('changeCargoElement', {PropName: 'Name', ElementIndex: index, PropValue: $event.target.value})"
                            :value="WebCargoElement.Name"
                    >
                </td>
                <td><input
                        type="number"
                        @input="$emit('changeCargoElement', {PropName: 'UnitSize', ElementIndex: index, PropValue: $event.target.value})"
                        :value="WebCargoElement.UnitLength"
                ></td>
                <td><input
                        type="number"
                        @input="$emit('changeCargoElement', {PropName: 'UnitSize', ElementIndex: index, PropValue: $event.target.value})"
                        :value="WebCargoElement.UnitWidth"
                ></td>
                <td><input
                        type="number"
                        @input="$emit('changeCargoElement', {PropName: 'UnitSize', ElementIndex: index, PropValue: $event.target.value})"
                        :value="WebCargoElement.UnitHeight"
                ></td>
                <td><input
                        type="number"
                        @input="$emit('changeCargoElement', {PropName: 'UnitWeight', ElementIndex: index, PropValue: $event.target.value})"
                        :value="WebCargoElement.UnitWeight"
                ></td>
                <td><input
                        type="text"
                        @input="$emit('changeCargoElement', {PropName: 'UnitCount', ElementIndex: index, PropValue: $event.target.value})"
                        :value="WebCargoElement.UnitCount"
                >
                </td>
                <td v-if="$store.getters.isDangerousGoods">
                    <input type="text"
                           @input="$emit('changeCargoElement', {PropName: 'DangerousClassification', ElementIndex: index, PropValue: $event.target.value})"
                           :value="WebCargoElement.DangerousClassification"
                    >
                </td>
                <td><input
                        type="text"
                        @input="$emit('changeCargoElement', {PropName: 'specialDemand', ElementIndex: index, PropValue: $event.target.value})"
                        :value="WebCargoElement.specialDemand"
                ></td>
            </tr>
            <tr>
                <td colspan="2"></td>
                <td></td>
                <td>
                    <button @click="$emit('addDefaultCargoElement')" class="cit_btn btn_add">+ Добавить грузовое место</button>
                </td>
                <td colspan="5">
                    <div class="sum">Итого:</div>
                </td>
                <td><input type="text" :value="elements.reduce((sum, elem) => sum + (+elem.UnitCount), 0)" disabled>
                </td>
                <td><input type="text" :value="elements.reduce((sum, elem) => sum + (+elem.UnitWeight), 0)" disabled>
                </td>
            </tr>
        </table>
    </div>
</template>

<script>

    import EmulateSelect from "./EmulateSelect";
    import { mapState } from 'vuex';

    export default {
        name: "CargoDetails",

        components: {EmulateSelect},

        props: {
            elements:       {type: Array, default: () => []},
        },

        computed: mapState({
            PackTypes: state => state.ReferenceData.PackTypes
        }),

        methods:{
            ChangeCargoElement(index, prop, value){

            }
        }
    }
</script>

<style scoped>

</style>