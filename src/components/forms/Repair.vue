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
                <tr v-for="(repairElement, index) in $store.state.WebBid.wRepairContainer.list" :key="index">
                    <td colspan="3">
                        <div class="row-del" @click="$store.commit('delRepairElement', index)"></div>
                        <EmulateSelect
                            :placeholder="getServiceTitleFromIndex(repairElement.ServiceIndex)"
                            :elementsList="RepairServiceTitles"
                            @selectElement="selectRepairService(index, $event)"
                            v-if="$store.state.WebBid.wRepairContainer.list.length === index+1"
                        ></EmulateSelect>
                        <template v-else>
                            <input type="text" :value="getServiceTitleFromIndex(repairElement.ServiceIndex)" disabled>
                        </template>
                    </td>
                    <td>
                        <EmulateSelect
                            v-if="getServiceCharacteristicsList(repairElement.ServiceIndex) && $store.state.WebBid.wRepairContainer.list.length === index+1"
                            :placeholder="getCharacteristicTitleFromArt(repairElement.Characteristic) ?
                                getCharacteristicTitleFromArt(repairElement.Characteristic) : 'Характеристика ремонта'"
                            :elementsList="getServiceCharacteristicsList(repairElement.ServiceIndex)"
                            @selectElement="selectRepairCharacteristic(index, repairElement.ServiceIndex, $event)"
                        ></EmulateSelect>
                        <input v-else type="text" :value="getCharacteristicTitleFromArt(repairElement.Characteristic)" disabled>
                    </td>
                    <td><input
                            type="text"
                            disabled
                            :value="getTextRepairCategory(repairElement.RepairCategory)"
                    ></td>
                    <td><input
                            type="text"
                            @input="$emit('changeRepairElement', {PropName: 'SpecialRequirements', ElementIndex: index, PropValue: $event.target.value})"
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
                        <input type="text" :value="getTextRepairCategory($store.getters.TotalRepairCategory)" disabled>
                    </td>
                </tr>
                <tr v-if="$store.getters.TotalRepairCategory >= 4">
                    <td colspan="8" style="padding: 10px">
                        <label class="label_width_outside_input">
                            <input :checked="DefectCheck" type="checkbox" @input="SelectDefectCheck" required>
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
    import { mapState, mapGetters } from 'vuex';

    export default {
        name: "Repair",

        components: {EmulateSelect},

        computed: {
            /**
             * Возможность добавить новую строку с ремонтом
             * @return {boolean}
             */
            CanAddNewRepairService(){

                return !!(
                    Array.isArray(this.RepairContainerList) &&                                  // Список услуг ремонта - массив (надо ли?)
                    this.TotalRepairCategory < 4 &&                                             // Итоговая категория ремонта меньше четырёх
                    (
                        this.RepairContainerList.length === 0 ||                                // Списоек еще пуст
                        this.RepairContainerList.every(service => service.RepairCategory)       // Или Все услуги имеют достаточно выбранных полей
                    )
                );
            },

            RepairServiceTitles() {
                return this.$store.getters.getRepairServices.map(RepairService =>
                    RepairService.Title ? RepairService.Title : null
                ).filter(RepairService => RepairService);
            },

            ...mapState({
                RepairContainerList: state => state.WebBid.wRepairContainer.list,
                DefectCheck: state => state.WebBid.DefectCheck,
            }),

            ...mapGetters(['TotalRepairCategory'])
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

            getCharacteristicTitleFromArt(Art){

                let foundElement = '';

                if(Art){
                    this.$store.getters.getRepairServices.findIndex(Service => {
                        if(Service.Characteristics){
                            for(let CharacteristicArt in Service.Characteristics){
                                if(Service.Characteristics.hasOwnProperty(CharacteristicArt) && CharacteristicArt === Art){
                                    foundElement = Service.Characteristics[CharacteristicArt].Title;
                                    return true;
                                }
                            }
                        }

                        return false;
                    });
                }

                return foundElement ? foundElement : '';
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
                    this.$store.commit('changeRepairElement', {PropName: 'ServiceIndex', ElementIndex: RepairElementIndex, PropValue: RepairServiceIndex});
                }
            },

            selectRepairCharacteristic(RepairElementIndex, ServiceIndex, InputRepairCharacteristicTitle){
                if(this.$store.getters.getRepairServices[ServiceIndex] && this.$store.getters.getRepairServices[ServiceIndex].Characteristics){
                    for(let CharacteristicArt in this.$store.getters.getRepairServices[ServiceIndex].Characteristics){
                        if(
                            this.$store.getters.getRepairServices[ServiceIndex].Characteristics.hasOwnProperty(CharacteristicArt) &&
                            this.$store.getters.getRepairServices[ServiceIndex].Characteristics[CharacteristicArt].Title === InputRepairCharacteristicTitle
                        ){
                            this.$store.commit('changeRepairElement', {PropName: 'Characteristic', ElementIndex: RepairElementIndex, PropValue: CharacteristicArt});
                        }
                    }
                }
            },

            SelectDefectCheck(e){
                this.$store.commit('setWebObjectValue', {PropName: 'DefectCheck', PropValue: e.target.checked});
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