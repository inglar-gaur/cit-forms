<template>
    <div class="form_row">
        <table class="full_table receiving_cargo_information">
            <tr>
                <th colspan="2" style="width: 16%">описание груза</th>
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
                            v-if="index === elements.length - 1"
                            :placeholder="WebCargoElement.PackageType ? WebCargoElement.PackageType : 'Выберите вид'"
                            :elementsList="PackTypes"
                            @selectElement="$emit('changeCargoElement', {index: index, prop: 'PackageType', value: $event})"
                    ></EmulateSelect>
                    <input v-else type="text" :value="WebCargoElement.PackageType" disabled>
                </td>
                <td>
                    <EmulateSelect
                            v-if="index === elements.length - 1 && WebCargoElement.PackageType"
                            :placeholder="WebCargoElement.PackageRequirement ? WebCargoElement.PackageRequirement : 'Выберите требование'"
                            :elementsList="getPackRequirementByType(WebCargoElement.PackageType)"
                            @selectElement="$emit('changeCargoElement', {index: index, prop: 'PackageRequirement', value: $event})"
                    ></EmulateSelect>
                    <input v-else-if="WebCargoElement.PackageRequirement" type="text" :value="WebCargoElement.PackageRequirement" disabled>
                    <input v-else type="text" value="" disabled>
                </td>
                <td colspan="3">
                    <input
                            v-if="index === elements.length - 1"
                            type="text"
                            @input="$emit('changeCargoElement', {prop: 'Name', index: index, value: $event.target.value})"
                            :value="WebCargoElement.Name"
                    >
                    <input v-else type="text" :value="WebCargoElement.Name" disabled>
                </td>
                <td><input
                        v-if="index === elements.length - 1"
                        type="number"
                        @input="$emit('changeCargoElement', {prop: 'UnitLength', index: index, value: $event.target.value})"
                        :value="WebCargoElement.UnitLength"
                >
                <input v-else type="text" :value="WebCargoElement.UnitLength" disabled></td>
                <td><input
                        v-if="index === elements.length - 1"
                        type="number"
                        @input="$emit('changeCargoElement', {prop: 'UnitWidth', index: index, value: $event.target.value})"
                        :value="WebCargoElement.UnitWidth"
                >
                <input v-else type="text" :value="WebCargoElement.UnitWidth" disabled></td>
                <td><input
                        v-if="index === elements.length - 1"
                        type="number"
                        @input="$emit('changeCargoElement', {prop: 'UnitHeight', index: index, value: $event.target.value})"
                        :value="WebCargoElement.UnitHeight"
                >
                <input v-else type="text" :value="WebCargoElement.UnitHeight" disabled></td>
                <td><input
                        v-if="index === elements.length - 1"
                        type="number"
                        @input="$emit('changeCargoElement', {prop: 'UnitWeight', index: index, value: $event.target.value})"
                        :value="WebCargoElement.UnitWeight"
                >
                <input v-else type="text" :value="WebCargoElement.UnitWeight" disabled></td>
                <td><input
                        v-if="index === elements.length - 1"
                        type="number"
                        @input="$emit('changeCargoElement', {prop: 'UnitCount', index: index, value: $event.target.value})"
                        :value="WebCargoElement.UnitCount"
                >
                    <input v-else type="text" :value="WebCargoElement.UnitCount" disabled>
                </td>
                <td v-if="$store.getters.isDangerousGoods">
                    <input
                            v-if="index === elements.length - 1"
                            type="text"
                           @input="$emit('changeCargoElement', {prop: 'DangerousClassification', index: index, value: $event.target.value})"
                           :value="WebCargoElement.DangerousClassification"
                    >
                    <input v-else type="text" :value="WebCargoElement.DangerousClassification" disabled>
                </td>
                <td><input
                        v-if="index === elements.length - 1"
                        type="text"
                        @input="$emit('changeCargoElement', {prop: 'specialDemand', index: index, value: $event.target.value})"
                        :value="WebCargoElement.specialDemand"
                >
                <input v-else type="text" :value="WebCargoElement.specialDemand" disabled></td>
            </tr>
            <tr>
                <td colspan="2"></td>
                <td></td>
                <td>
                    <button v-show="CanAddElement" @click="$emit('addDefaultCargoElement')" class="cit_btn btn_add">+ Добавить грузовое место</button>
                </td>
                <td colspan="4">
                    <div class="sum">Итого:</div>
                </td>
                <td><input type="text" :value="elements.reduce((sum, elem) => sum + (+elem.UnitWeight*(+elem.UnitCount)), 0)" disabled>
                </td>
                <td><input type="text" :value="elements.reduce((sum, elem) => sum + (+elem.UnitCount), 0)" disabled>
                </td>
            </tr>
        </table>
    </div>
</template>

<script>

    import EmulateSelect from "./EmulateSelect";
    import { mapState, mapGetters } from 'vuex';

    export default {
        name: "CargoDetails",

        components: {EmulateSelect},

        props: {
            elements:       {type: Array, default: () => []},
        },

        computed: {

            /**
             * Возможность добавления нового элемента
             * @return boolean
             */
            CanAddElement(){
                return this.elements.length === 0 ||
                    this.elements.every(CargoElement =>
                        CargoElement.Name &&
                        CargoElement.UnitWeight &&
                        CargoElement.PackageType &&
                        CargoElement.PackageRequirement
                    );
            },

            ...mapGetters([
                'getPackRequirementByType'
            ]),

            ...mapState({
                PackTypes: state => state.ReferenceData.PackTypes.filter(PackType => PackType.Title).map(PackType => PackType.Title)
            })
        },

        methods:{
            ChangeCargoElement(index, prop, value){
                this.$emit('changeCargoElement', {index: index, prop: prop, value: value});
            },

            /**
             * Возможность изменения элемента
             * @param {number} index - Индекс элемента
             * @return boolean
             */
            CanChangeElement(index){
                return index === this.elements.length - 1;
            },
        }
    }
</script>

<style scoped>

</style>