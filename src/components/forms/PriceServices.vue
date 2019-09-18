<template>
    <div>
        <template v-for="(PriceServiceType, TypeIndex) in PriceServiceTypes">
            <div v-if="SelectedPrices.includes(TypeIndex)" class="form_row" :key="TypeIndex">

                <table>
                    <tr>
                        <th colspan="3" style="width: 35%">Наименование {{getTypeTitle(TypeIndex)}} услуги</th>
                        <th style="width: 20%">Единица измерения</th>
                        <th style="width: 10%">количество единиц измерения</th>
                        <th style="width: 20%">артикул по прайсу</th>
                    </tr>
                    <tr v-for="(LocalService, ServiceIndex) in LocalServices[TypeIndex]" :key="ServiceIndex">
                        <td colspan="3" style="position: relative">
                            <div class="row-del" @click="delPriceService(TypeIndex, ServiceIndex, LocalService)"></div>
                            <template v-if="ServiceIndex < LocalServices[TypeIndex].length-1">
                                <input style="width:100%" type="text" :value="PriceServicesList[LocalService].Title" disabled>
                            </template>
                            <EmulateSelect
                                    :placeholder="PriceServicesList[LocalService] && PriceServicesList[LocalService].Title ? PriceServicesList[LocalService].Title : 'Выберите услугу'"
                                    :elementsList="getPriceServiceTitleListByType(TypeIndex)"
                                    @selectElement="selectPriceService(TypeIndex, ServiceIndex, $event)"
                                    v-else
                            ></EmulateSelect>
                        </td>
                        <td>
                            <input
                                v-if="PriceServicesList[LocalService] && ~PriceServicesList[LocalService].Unit"
                                :value="PriceServicesList[LocalService].Unit"
                                type="text" disabled
                            >
                        </td>
                        <td>
                            <input v-if="LocalService" :value="PriceNumbersList[LocalService]" @input="changeServiceNumber(LocalService, $event.target.value)" type="Number">
                        </td>
                        <td>
                            <input v-if="LocalService" :value="LocalService" type="text" disabled>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2">
                            <button
                                v-show="canAddService(TypeIndex)"
                                @click.prevent="LocalServices[TypeIndex].push(null)" class="cit_btn btn_add">+ Добавить услугу</button>
                        </td>
                    </tr>
                </table>

            </div>
        </template>
    </div>
</template>

<script>
    import { mapState, mapGetters } from 'vuex';
    import EmulateSelect from "./subForms/EmulateSelect";

    export default {
        name: "PriceServices",

        components: {EmulateSelect},

        data(){
            return {
                LocalServices: [
                    [],
                    []
                ],
            }
        },

        watch:{
            /**
             * Объединяем локальные массивы с артикулами и отправляем в хранилище
             */
            LocalServices(){
                let ConcatenateServices = [];
                this.LocalServices.forEach(ServiceList => {
                    ServiceList.forEach(Service => Service ? ConcatenateServices.push(Service) : null);
                });

                this.$store.commit('setSelectedPriceServices', ConcatenateServices);
            },

            /**
             * Отслеживание изменения футовости контейнера, для изменения услуг-с, от неё завиящих
             */
            ContainerSize(){
                if(this.ContainerSize){
                    this.LocalServices.forEach((ServicesList, TypeIndex) =>
                        ServicesList.forEach((ServiceArt, ServiceIndex) => {
                            if(
                                this.PriceServicesList[ServiceArt] &&                               // Услуга существует
                                this.PriceServicesList[ServiceArt].Size &&                          // Зависит от футовости
                                this.PriceServicesList[ServiceArt].Size !== this.ContainerSize      // С футовостью текущего контейнера не совпадает
                            ){
                                // todo Учесть ненайденную (возможно, удалить)
                                let AltServiceFound = false;
                                // Ищем альтернативную услугу
                                for(let AltServiceArt in this.PriceServicesList){
                                    if(
                                        this.PriceServicesList.hasOwnProperty(AltServiceArt) &&
                                        this.PriceServicesList[AltServiceArt].Title === this.PriceServicesList[ServiceArt].Title && // Названия текущей и альтернативной услуг совпадают
                                        this.PriceServicesList[AltServiceArt].Size === this.ContainerSize                           // Футовость альтернативной услуги соответсвует футовости контейнера
                                    ){
                                        this.changeServiceNumber(AltServiceArt, this.PriceNumbersList[ServiceArt]); // Добавляем такое же количество альтернативной услуги в хранилище
                                        this.$store.commit('delServiceNumber', ServiceArt);                         // Удаляем количество текущей услуги из хранилища
                                        this.LocalServices[TypeIndex][ServiceIndex] = AltServiceArt;                // Подменяем услугу
                                        AltServiceFound = true;
                                    }
                                }
                                // if(!AltServiceFound){
                                //     this.$store.commit('delServiceNumber', ServiceArt);
                                //     this.LocalServices[TypeIndex].splice(ServiceIndex, 1);
                                // }
                            }
                        })
                    );

                    let oldValue = this.LocalServices;
                    this.LocalServices = [];
                    this.LocalServices = oldValue;
                }
            }
        },

        computed: {
            SelectedPriceServices(){
                return this.$store.getters.getSelectedServices.PriceServices;
            },

            /**
             * @return {Number}
             */
            ContainerSize(){
                if(this.$store.getters.isWebGateIn && this.$store.getters.WebGateInContainer){
                    return +this.$store.getters.WebGateInContainer.Size;
                }else if(this.$store.getters.isWebGateOut && this.$store.getters.WebGateOutContainer){
                    return +this.$store.getters.WebGateOutContainer.Size;
                }

                return 0;
            },

            ...mapState({
                PriceServiceTypes: state => state.ReferenceData.PriceServices.Types,
                PriceServiceCategories: state => state.ReferenceData.PriceServices.Categories,
                PriceServicesList: state => state.ReferenceData.PriceServices.Services,
                PriceNumbersList: state => state.Price.SelectedPricesNumbers,
                SelectedPrices: state => state.Price.SelectedPrices,
            }),

            ...mapGetters([
                'getUnitTitle'
            ])
        },

        methods: {
            /**
             * Получение списка названий услуг, отфильтрованных по типу прайса
             * @param {Number} type         - Тип прайса
             * @returns {Array.<String>}    - Массив с названиями услуг
             */
            getPriceServiceTitleListByType(type){

                /**
                 * Массив категорий, отномящихся к данному типу прайса
                 * @type {Array.<Number>}
                 */
                let ServiceCategories = [];
                this.PriceServiceCategories.forEach((Category, index) => {
                    if(Category.Type === type){
                        ServiceCategories.push(index);
                    }
                });

                /**
                 * Массив для добавления названий отфильтрованных услуг
                 * @type {Array.<String>}
                 */
                let Services = [];
                for(let ServiceArt in this.PriceServicesList){
                    if(
                        this.PriceServicesList.hasOwnProperty(ServiceArt) &&
                        this.PriceServicesList[ServiceArt].Category >= 0 &&                             // Услуга имеет категорию
                        this.PriceServicesList[ServiceArt].Title &&                                     // Услуга имеет название
                        ServiceCategories.includes(this.PriceServicesList[ServiceArt].Category) &&      // Услуга относится к категории данного типа
                        !this.LocalServices[type].includes(ServiceArt) &&                               // Услуга не в списке уже выбранных
                        (
                            !this.PriceServicesList[ServiceArt].Size ||                                 // Либо услуга не зависит от размера контейнера
                            this.ContainerSize === this.PriceServicesList[ServiceArt].Size              // Либо размер котейнера соответствует услуге
                        )
                    ){
                        Services.push(this.PriceServicesList[ServiceArt].Title);
                    }
                }
                return Services;
            },

            getTypeTitle(typeIndex){
                let titles = ['терминальной', 'таможенной'];
                return titles[typeIndex] ? titles[typeIndex] : '';
            },

            /**
             * Обработчик выбора услуги из списка
             * @param {Number} TypeIndex        - Тип услуги (индекс)
             * @param {Number} ServiceIndex     - Индекс в локальной таблице
             * @param {String} ServiceTitle     - Название услуги
             */
            selectPriceService(TypeIndex, ServiceIndex, ServiceTitle){
                if(ServiceTitle && this.LocalServices[TypeIndex] && this.LocalServices[TypeIndex][ServiceIndex] !== undefined){
                    for(let ServiceArt in this.PriceServicesList){
                        // todo Подумать нужна ли фильтрация по типу при выборке
                        if(
                            this.PriceServicesList.hasOwnProperty(ServiceArt) &&
                            this.PriceServicesList[ServiceArt].Title === ServiceTitle
                            // this.PriceServicesList[ServiceArt].Title === ServiceTitle
                        ){
                            this.LocalServices[TypeIndex][ServiceIndex] = ServiceArt;           // Установка услуги в локальном хранилице
                            this.changeServiceNumber(ServiceArt, 1);                            // Установка количества данной услуги в 1
                            let oldValue = this.LocalServices;
                            this.LocalServices = [];
                            this.LocalServices = oldValue;
                        }
                    }
                }
            },

            delPriceService(TypeIndex, ServiceIndex, ServiceArt){
                this.LocalServices[TypeIndex].splice(ServiceIndex, 1);
                if(ServiceArt){
                    this.$store.commit('delServiceNumber', ServiceArt);
                }
            },

            /**
             * Возможность добавить услугу данного типа
             * @param  {Number}  type - Тип прайса
             * @return {Boolean}
             */
            canAddService(type){
                return this.getPriceServiceTitleListByType(type).length > 0 &&          // Есть услуги для добавления в список и
                    (this.LocalServices[type].length === 0 ||                           // Список добавленных услуг еще пуст
                    this.LocalServices[type][this.LocalServices[type].length -1]);      // Или последняя услуга не выбрана
            },

            /**
             * Измение количества услуги
             * @param {String} ServiceArt
             * @param {Number} ServiceNumber
             */
            changeServiceNumber(ServiceArt, ServiceNumber){
                if(ServiceArt){
                    this.$store.commit('setServiceNumber', {ServiceArt: ServiceArt, ServiceNumber: ServiceNumber > 0 ? ServiceNumber : 1})
                }
            }
        }
    }
</script>

<style scoped lang="scss">
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