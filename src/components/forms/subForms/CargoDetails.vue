<template>
    <div class="form_row">
        <table class="full_table receiving_cargo_information">
            <tr>
                <th :colspan="$store.getters.isDangerousGoods ? 9 : 8">Сведения о
                    грузе
                </th>
            </tr>
            <tr>
                <th class="wide" colspan="3">Наименование груза (место)</th>
                <th>Кол-во мест</th>
                <th>Масса места, брутто (кг)</th>
                <th>Габарит места Д/Ш/В, (мм)</th>
                <th>Упаковка места (описание)</th>
                <th v-if="$store.getters.isDangerousGoods">Класс опасности</th>
                <th>Особые требования к обращению с грузом</th>
            </tr>
            <tr v-for="(WebCargoElement, index) in elements" :key="index">
                <td colspan="3">
                    <input
                            type="text"
                            @input="$emit('changeCargoElement', {prop: 'Name', index: index, value: $event.target.value})"
                            :value="WebCargoElement.Name"
                    >
                </td>
                <td><input
                        type="text"
                        @input="$emit('changeCargoElement', {prop: 'UnitCount', index: index, value: $event.target.value})"
                        :value="WebCargoElement.UnitCount"
                >
                </td>
                <td><input
                        type="number"
                        @input="$emit('changeCargoElement', {prop: 'UnitWeight', index: index, value: $event.target.value})"
                        :value="WebCargoElement.UnitWeight"
                ></td>
                <td><input
                        type="number"
                        @input="$emit('changeCargoElement', {prop: 'UnitSize', index: index, value: $event.target.value})"
                        :value="WebCargoElement.UnitSize"
                ></td>
                <td><input
                        type="text"
                        @input="$emit('changeCargoElement', {prop: 'PackageDescription', index: index, value: $event.target.value})"
                        :value="WebCargoElement.PackageDescription"
                ></td>
                <td v-if="$store.getters.isDangerousGoods">
                    <input type="text"
                           @input="$emit('changeCargoElement', {prop: 'DangerousClassification', index: index, value: $event.target.value})"
                           :value="WebCargoElement.DangerousClassification"
                    >
                </td>
                <td><input
                        type="text"
                        @input="$emit('changeCargoElement', {prop: 'specialDemand', index: index, value: $event.target.value})"
                        :value="WebCargoElement.specialDemand"
                ></td>
            </tr>
            <tr>
                <td>
                    <button @click="$emit('addDefaultCargoElement')" class="cit_btn btn_add">+ Добавить строку</button>
                </td>
                <td colspan="2">
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
    export default {
        name: "CargoDetails",

        props: {
            elements:       {type: Array, default: []},
        }
    }
</script>

<style scoped>

</style>