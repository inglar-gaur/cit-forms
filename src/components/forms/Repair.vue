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
                            :placeholder="getServiceTitleFromIndex(repairElement.ServiceIndex)"
                            :elementsList="RepairServiceTitles"
                            @selectElement="selectRepairService(index, $event)"
                            v-if="$store.state.WebBid.wRepairContainer.list.length === index+1"
                        ></EmulateSelect>
                        <template v-else>
                            <div class="row-del" @click="$store.commit('delRepairElement', index)"></div>
                            <input type="text" :value="getServiceTitleFromIndex(repairElement.ServiceIndex)" disabled>
                        </template>
                    </td>
                    <td>
                        <EmulateSelect
                            v-if="getServiceCharacteristicsList(repairElement.ServiceIndex) && $store.state.WebBid.wRepairContainer.list.length === index+1"
                            :placeholder="
                                $store.getters.getSelectedServices.RepairServices[index] && $store.getters.getSelectedServices.RepairServices[index].Characteristic
                                ? $store.getters.getSelectedServices.RepairServices[index].Characteristic : 'Характеристика ремонта'"
                            :elementsList="getServiceCharacteristicsList(repairElement.ServiceIndex)"
                            @selectElement="selectRepairCharacteristic(index, repairElement.ServiceIndex, $event)"
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
                        <button v-show="CanAddNewRepairService" @click.prevent="$store.commit('addDefaultRepairElement')" class="cit_btn btn_add">+ Добавить строку</button>
                    </td>
                    <td style="width: 10%"></td>
                    <td class="sum" style="position: relative; text-align: right"><div style="width: 80%; position: absolute; right: 5px; top: 2px">Итог категория ремонта:</div></td>
                    <td>
                        <input type="text" :value="getTextRepairCategory($store.getters.getSelectedServices.TotalRepairCategory)" disabled>
                    </td>
                </tr>
                <tr v-if="$store.getters.getSelectedServices.TotalRepairCategory >= 4">
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
            CanAddNewRepairService(){

                return !!(Array.isArray(this.$store.state.WebBid.wRepairContainer.list) && this.$store.getters.getSelectedServices.TotalRepairCategory < 4 &&
                    (
                        this.$store.state.WebBid.wRepairContainer.list.length === 0 ||
                        this.$store.state.WebBid.wRepairContainer.list.every(service => service.RepairCategory)
                    )
                );
            },

            RepairServiceTitles() {
                return this.$store.getters.getRepairServices.map(RepairService =>
                    RepairService.Title ? RepairService.Title : null
                ).filter(RepairService => RepairService);
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
            },

            getServiceTitleFromIndex(ServiceIndex){

                    return this.RepairServiceTitles[ServiceIndex] ? this.RepairServiceTitles[ServiceIndex] : 'Вид повреждения';
            },

            getServiceCharacteristicsList(ServiceIndex){
                if(this.$store.getters.getRepairServices[ServiceIndex] && this.$store.getters.getRepairServices[ServiceIndex].Characteristics){
                    let ServiceCharacteristicsList = [];

                    for(let ServiceCharacteristics in this.$store.getters.getRepairServices[ServiceIndex].Characteristics){
                        if(
                            this.$store.getters.getRepairServices[ServiceIndex].Characteristics.hasOwnProperty(ServiceCharacteristics) &&
                            this.$store.getters.getRepairServices[ServiceIndex].Characteristics[ServiceCharacteristics].Title
                        ){
                            ServiceCharacteristicsList.push(this.$store.getters.getRepairServices[ServiceIndex].Characteristics[ServiceCharacteristics].Title);
                        }
                    }

                    return ServiceCharacteristicsList.length > 0 ? ServiceCharacteristicsList : null;
                }

                return null;
            },

            selectRepairService(RepairElementIndex, InputRepairServiceTitle){
                let RepairServiceIndex = this.RepairServiceTitles.findIndex(RepairServiceTitle => RepairServiceTitle === InputRepairServiceTitle);
                if(~RepairServiceIndex){
                    this.$store.commit('changeRepairElement', {prop: 'ServiceIndex', index: RepairElementIndex, value: RepairServiceIndex});
                }
            },

            selectRepairCharacteristic(RepairElementIndex, ServiceIndex, InputRepairCharacteristicTitle){
                if(this.$store.getters.getRepairServices[ServiceIndex] && this.$store.getters.getRepairServices[ServiceIndex].Characteristics){
                    for(let CharacteristicArt in this.$store.getters.getRepairServices[ServiceIndex].Characteristics){
                        if(
                            this.$store.getters.getRepairServices[ServiceIndex].Characteristics.hasOwnProperty(CharacteristicArt) &&
                            this.$store.getters.getRepairServices[ServiceIndex].Characteristics[CharacteristicArt].Title === InputRepairCharacteristicTitle
                        ){
                            this.$store.commit('changeRepairElement', {prop: 'Characteristic', index: RepairElementIndex, value: CharacteristicArt});
                        }
                    }
                }
            }
        },
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