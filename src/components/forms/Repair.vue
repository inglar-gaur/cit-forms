<template v-if="$store.state.WebBid.wRepairContainer">
    <div>
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
                    <td colspan="3">
                        <EmulateSelect
                            :placeholder="repairElement.Name ? repairElement.Name : 'Вид повреждения'"
                            :elementsList="$store.getters.getTitlesRepairVariants"
                            @selectElement="$store.commit('changeRepairElement', {prop: 'Name', index: index, value: $event})"
                            v-if="$store.state.WebBid.wRepairContainer.list.length === index+1"
                        ></EmulateSelect>
                        <template v-else>
                            <div class="row-del" @click="$store.commit('delRepairElement', index)"></div>
                            <input type="text" :value="repairElement.Name" disabled>
                        </template>
                    </td>
                    <td>
                        <EmulateSelect
                            v-if="$store.getters.getCharacteristicsFromVariantName(repairElement.Name) && $store.state.WebBid.wRepairContainer.list.length === index+1"
                            :placeholder="repairElement.Characteristic ? repairElement.Characteristic : 'Характеристика ремонта'"
                            :elementsList="$store.getters.getCharacteristicsFromVariantName(repairElement.Name)"
                            @selectElement="$store.commit('changeRepairElement', {prop: 'Characteristic', index: index, value: $event})"
                        ></EmulateSelect>
                        <input v-else type="text" :value="repairElement.Characteristic" disabled>
                    </td>
                    <td><input
                            type="text"
                            disabled
                            :value="getTextRepairCategory(repairElement.RepairCategory)"
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
                        <button v-show="canAddNewRepairService" @click.prevent="$store.commit('addDefaultRepairElement')" class="cit_btn btn_add">+ Добавить строку</button>
                    </td>
                    <td style="width: 10%"></td>
                    <td class="sum" style="position: relative; text-align: right"><div style="width: 80%; position: absolute; right: 5px; top: 2px">Итог категория ремонта:</div></td>
                    <td>
                        <input type="text" :value="getTextRepairCategory($store.getters.getSelectedPriceElements.TotalRepairCategory)" disabled>
                    </td>
                </tr>
                <tr v-if="$store.getters.getSelectedPriceElements.TotalRepairCategory >= 4">
                    <td colspan="8" style="padding: 10px">
                        <label class="label_width_outside_input">
                            <input type="checkbox" required>
                            <span class="pseudo_checkbox"></span>
                            <span class="title">заказать дефектовку повреждений контейнера</span>
                        </label>
                    </td>
                </tr>
            </table>
        </div>
    </div>
</template>

<script>

    import EmulateSelect from "./subForms/EmulateSelect";

    export default {
        name: "Repair",

        components: {EmulateSelect},

        computed: {
            canAddNewRepairService(){

                return !!(Array.isArray(this.$store.state.WebBid.wRepairContainer.list) && this.$store.getters.getSelectedPriceElements.TotalRepairCategory < 4 &&
                    (
                        this.$store.state.WebBid.wRepairContainer.list.length === 0 ||
                        this.$store.state.WebBid.wRepairContainer.list.every(service => service.RepairCategory)
                    )
                );
            }
        },

        methods:{
            getTextRepairCategory: category => {
                switch(category){
                    case 1:
                        return 'I категория';
                    case 2:
                        return 'II категория';
                    case 3:
                        return 'III категория';
                    case 4:
                        return 'IV категория';
                    default:
                        return '';
                }
            }
        },

        watch:{
            '$store': function () {
                if(this.$store.getters.changeRepairElement.TotalRepairCategory >= 4){
                    console.log('Category 4');
                }
            }
        }
    }
</script>

<style scoped lang="scss">
    .full_table{
        td{
            position: relative;
        }
    }
    .row-del{
        position: absolute;
        top: 0;
        left: -43px;
        width: 43px;
        height: 43px;
        opacity: 0;
        transition: opacity 0.3s linear;
        cursor: pointer;

        &::before,&::after{
            content: '';
            width: 25px;
            height: 3px;
            position: absolute;
            left: 50%;
            top: 50%;
            background: red;
        }

        &::before{
            transform: translate(-50%, -50%) rotate(45deg);
        }

        &::after{
            transform: translate(-50%, -50%) rotate(-45deg);
        }
    }

    tr:hover{
        .row-del{
            opacity: 0.6;
        }
    }
</style>