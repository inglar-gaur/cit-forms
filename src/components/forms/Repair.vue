<template v-if="$store.state.WebBid.wRepairContainer">
    <div class="form_row">
        <table class="full_table" v-if="$store.state.WebBid.wRepairContainer.list">
            <tr>
                <th colspan="8">Сведения о повреждениях контейнера</th>
            </tr>
            <tr>
                <th colspan="3" style="width: 35%">Вид повреждения по номенклатуре исполнителя</th>
                <th style="width: 20%">Характеристика ремонта</th>
                <th style="width: 10%">Категория ремонта</th>
                <th style="width: 20%">Особые требования к производству работ</th>
                <th style="width: 15%">Приложить фото</th>
            </tr>
            <tr v-for="(repairElement, index) in $store.state.WebBid.wRepairContainer.list">
                <td colspan="3"><EmulateSelect
                        :placeholder="repairElement.Name ? repairElement.Name : 'Вид повреждения'"
                        :elementsList="$store.getters.getTitlesRepairVariants"
                        @selectElement="$store.commit('changeRepairElement', {prop: 'Name', index: index, value: $event})"
                ></EmulateSelect></td>
                <td>
                    <EmulateSelect
                        v-if="$store.getters.getCharacteristicsFromVariantName(repairElement.Name)"
                        :placeholder="repairElement.Characteristic ? repairElement.Characteristic : 'Характеристика ремонта'"
                        :elementsList="$store.getters.getCharacteristicsFromVariantName(repairElement.Name)"
                        @selectElement="$store.commit('changeRepairElement', {prop: 'Characteristic', index: index, value: $event})"
                    ></EmulateSelect>
                    <input
                        v-else
                        type="text"
                        disabled
                    >
                </td>
                <td><input
                        type="text"
                        disabled
                        :value="repairElement.RepairCategoryText"
                ></td>
                <td><input
                        type="text"
                        @input="$emit('changeRepairElement', {prop: 'SpecialRequirements', index: index, value: $event.target.value})"
                        :value="repairElement.SpecialRequirements"
                ></td>
                <td>
                    <label class="cit__form_attachment receiving_add_file">
                        <input type="file" name="receiving_proxy_file" placeholder="фото">
                        <span class="cit__form_attachment__title">Выберите фото</span>
                    </label>
                </td>
            </tr>
            <tr>
                <td colspan="2">
                    <button @click.prevent="$store.commit('addDefaultRepairElement')" class="cit_btn btn_add">+ Добавить строку</button>
                </td>
                <td style="width: 10%"></td>
                <td class="sum" style="position: relative; text-align: right"><div style="width: 80%; position: absolute; right: 5px; top: 2px">Итог категория ремонта:</div></td>
                <td>
                    <input type="text" disabled>
                </td>
            </tr>
        </table>
    </div>
</template>

<script>

    import EmulateSelect from "./subForms/EmulateSelect";

    export default {
        name: "Repair",

        components: {EmulateSelect}
    }
</script>

<style scoped>

</style>