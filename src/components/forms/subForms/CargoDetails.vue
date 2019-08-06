<template>
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
</template>

<script>
    export default {
        name: "CargoDetails"
    }
</script>

<style scoped>

</style>