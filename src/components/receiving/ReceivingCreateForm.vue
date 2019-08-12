<template>
    <form class="cit_form receiving_form">

        <div class="application_wrap">
            <div class="application">
                <h2>Заявка на <span v-show="notSelectOut">прием</span><span v-show="notSelectIn && notSelectOut">/</span><span v-show="notSelectIn">выдачу</span> контейнера</h2>
                <div class="form_row">
                    <div class="receiving_form_starting">

                        <div class="labels">

                            <label class="label_width_outside_input">
                                <input type="radio" name="take_gave" value="WebGateIn" v-model="webGate">
                                <span class="pseudo_checkbox"></span>
                                <span class="title">Принять на терминал</span>
                            </label>

                            <label class="label_width_outside_input">
                                <input type="radio" name="take_gave" value="WebGateOut" v-model="webGate">
                                <span class="pseudo_checkbox"></span>
                                <span class="title">Выдать с терминала</span>
                            </label>

                            <label class="label_width_outside_input">
                                <input type="radio" name="take_gave" value="WebGateInOut" v-model="webGate">
                                <span class="pseudo_checkbox"></span>
                                <span class="title">Принять/выдать</span>
                            </label>

                            <label v-if="webGate !== 'WebGateInOut'" class="label_width_outside_input">
                                <input name="trucking_parameters_state" value="empty" v-model="bidEmpty" type="radio" :disabled="notSelectedMainOperation">
                                <span class="pseudo_checkbox"></span>
                                <span class="title">Порожний</span>
                            </label>

                            <label v-if="webGate !== 'WebGateInOut'" class="label_width_outside_input">
                                <input name="trucking_parameters_state" value="full" v-model="bidEmpty" type="radio" :disabled="notSelectedMainOperation">
                                <span class="pseudo_checkbox"></span>
                                <span class="title">Груженый</span>
                            </label>

                            <label v-if="webGate === 'WebGateInOut'" class="label_width_outside_input">
                                <input name="trucking_parameters_state" value="empty-empty" v-model="bidEmpty" type="radio" :disabled="notSelectedMainOperation">
                                <span class="pseudo_checkbox"></span>
                                <span class="title">Принять порожний – выдать порожний</span>
                            </label>

                            <label v-if="webGate === 'WebGateInOut'" class="label_width_outside_input">
                                <input name="trucking_parameters_state" value="empty-full" v-model="bidEmpty" type="radio" :disabled="notSelectedMainOperation">
                                <span class="pseudo_checkbox"></span>
                                <span class="title">Принять порожний – выдать груженый</span>
                            </label>

                            <label v-if="webGate === 'WebGateInOut'" class="label_width_outside_input">
                                <input name="trucking_parameters_state" value="full-empty" v-model="bidEmpty" type="radio" :disabled="notSelectedMainOperation">
                                <span class="pseudo_checkbox"></span>
                                <span class="title">Принять груженый – выдать порожний</span>
                            </label>

                            <label v-if="webGate === 'WebGateInOut'" class="label_width_outside_input">
                                <input name="trucking_parameters_state" value="full-full" v-model="bidEmpty" type="radio" :disabled="notSelectedMainOperation">
                                <span class="pseudo_checkbox"></span>
                                <span class="title">Принять груженый – выдать груженый</span>
                            </label>

                            <label v-if="webGate !== 'WebGateInOut'" class="label_width_outside_input">
                                <input type="checkbox" v-model="DangerousGoods" value="DangerousGoods" :disabled="bidEmpty !== 'full' && !ReturnContainer && !WebStaffingStripping">
                                <span class="pseudo_checkbox"></span>
                                <span class="title">Опасный груз</span>
                            </label>

                            <label v-if="webGate === 'WebGateInOut'" class="label_width_outside_input">
                                <input type="checkbox" v-model="DangerousGoods" value="DangerousGoodsIn" :disabled="bidEmpty !== 'full-empty' && bidEmpty !== 'full-full'">
                                <span class="pseudo_checkbox"></span>
                                <span class="title">Опасный груз принять</span>
                            </label>

                            <label v-if="webGate === 'WebGateInOut'" class="label_width_outside_input">
                                <input type="checkbox" v-model="DangerousGoods" value="DangerousGoodsOut" :disabled="bidEmpty !== 'full-full' && bidEmpty !== 'empty-full'">
                                <span class="pseudo_checkbox"></span>
                                <span class="title">Опасный груз выдать</span>
                            </label>

                        </div>

                        <div class="labels">

                            <label class="label_width_outside_input">
                                <input type="checkbox" v-model="WebCustomsRelease" :disabled="notCanSelectCustomsRelease">
                                <span class="pseudo_checkbox"></span>
                                <span class="title">заказать перемещение <span v-show="notSelectOut">на</span><span v-show="notSelectIn && notSelectOut">/</span><span v-show="notSelectIn">с</span> СВХ</span>
                            </label>

                            <label class="label_width_outside_input">
                                <input type="checkbox" v-model="WebInlandTransportation" :disabled="notSelectedMainParams">
                                <span class="pseudo_checkbox"></span>
                                <span class="title">заказать автоперевозку <span v-show="notSelectOut">до</span><span v-show="notSelectIn && notSelectOut">/</span><span v-show="notSelectIn">с</span> терминала</span>
                            </label>
                            <label class="label_width_outside_input">
                                <input type="checkbox" v-model="WebStaffingStripping" :disabled="notCanSelectWebStaffingStripping">
                                <span class="pseudo_checkbox"></span>
                                <span class="title">заказать <span v-show="bidEmpty !== 'full'">погрузку</span><span v-show="bidEmpty !== 'full' && bidEmpty !== 'empty'">/</span><span v-show="bidEmpty !== 'empty'">разгрузку</span> контейнера</span>
                            </label>

                            <label class="label_width_outside_input">
                                <input type="checkbox" v-model="RepairContainer" :disabled="notCanSelectRepair">
                                <span class="pseudo_checkbox"></span>
                                <span class="title">заказать ремонт контейнера</span>
                            </label>

                            <label class="label_width_outside_input">
                                <input type="checkbox" v-model="ReturnContainer" :disabled="notCanSelectReturnContainer">
                                <span class="pseudo_checkbox"></span>
                                <span class="title">заказать обратную доставку контейнера</span>
                            </label>

                        </div>
                    </div>
                </div>
            </div>
        </div>

        <button @click.prevent="createBid" class="cit_btn btn_submit" type="submit">Создать заявку</button>
        <button @click.prevent="webGate = null" class="cit_btn btn_submit" :disabled="!webGate">Отменить</button>
    </form>
</template>

<script>
    export default {

        /**
         * @typedef bid - Заявка
         * @property
         */

        name: "receiving-create-form",

        data: function () {
            return {
                webGate: null,                      // Операция подачи контейнера
                bidEmpty: null,                     // Опция порожний контейнер
                DangerousGoods: [],                 // Опция опасный груз
                WebInlandTransportation: false,     // Доставка автотранспортом
                WebCustomsRelease: false,           // Перемещение из зоны СВХ
                WebStaffingStripping: false,        // Погрузочно-разгрузочные работы
                ReturnContainer: false,             // Возврат контейнера
                RepairContainer: false              // Ремонт контейнера
            }
        },

        computed: {

            /**
             * Не выбрана операция приема контейнера
             * @returns {boolean}
             */
            notSelectIn: function(){
              return this.webGate !== "WebGateIn";
            },

            /**
             * Не выбрана операция выдачи контейнера
             * @returns {boolean}
             */
            notSelectOut: function(){
                return this.webGate !== "WebGateOut";
            },

            /**
             * Не выбрана операция приема/выдачи контейнера
             * @returns {boolean}
             */
            notSelectedMainOperation: function(){
                return this.webGate !== "WebGateIn" && this.webGate !== "WebGateOut" && this.webGate !== "WebGateInOut";
            },

            /**
             * Не выбрана операция приема/выдачи контейнера или опция груженый/порожний
             * @returns {boolean}
             */
            notSelectedMainParams: function(){
                return this.notSelectedMainOperation || !this.bidEmpty;
            },

            /**
             * Возможность выбрать СВХ
             * Не выбирается если не выбраны основные параметры, выбрано приём/выдача, ремонт или погрузочно-разгрузочные работы
             * @returns {boolean}
             */
            notCanSelectCustomsRelease: function () {
                return this.notSelectedMainParams || this.webGate === "WebGateInOut" || this.RepairContainer || this.WebStaffingStripping;
            },

            /**
             * Возможность выбрать погрузочно разгрузочные работы
             * Не выбирается если не выбраны основные параметры, выбрано приём/выдача, выбрана выдача, либо с получением выбраны СВХ или починка + пустой контейнер
             * @returns {boolean}
             */
            notCanSelectWebStaffingStripping: function () {
                return this.notSelectedMainParams || this.webGate === "WebGateInOut" || this.webGate === "WebGateOut" ||
                    (this.webGate === "WebGateIn" && (this.WebCustomsRelease || (this.bidEmpty === "empty" && this.RepairContainer)));
            },

            /**
             * Возможность выбрать ремонт
             * @returns {boolean}
             */
            notCanSelectRepair: function () {
                return this.notSelectedMainParams || this.webGate === "WebGateInOut" || this.webGate === "WebGateOut" ||
                (this.webGate === "WebGateIn" && (this.WebCustomsRelease || (this.bidEmpty === "empty" && this.WebStaffingStripping)));
            },

            /**
             * Возможность выбрать возврат контейнера
             * @returns {boolean}
             */
            notCanSelectReturnContainer: function () {
                return this.notSelectedMainParams || this.webGate !== "WebGateOut" || !this.WebInlandTransportation;
            },
        },

        watch: {

            /**
             * Сбрасываем все опции из правого списка при смене операции приема/выдачи контейнера
             */
            webGate: function () {
                this.bidEmpty = null;
            },

            /**
             * Сбрасываем опцию "опасный груз" и пункты правой части при выборе порожнего контейнера
             */
            bidEmpty: function () {
                if(this.bidEmpty){
                    this.DangerousGoods = [];
                }

                this.clearRightHalf();
            },

            /**
             * Вызоы проверок полей правой стороны на disabled
             */
            WebInlandTransportation: 'checkDisabledRightHalf',
            WebCustomsRelease: 'checkDisabledRightHalf',
            WebStaffingStripping: 'checkDisabledRightHalf',
            RepairContainer: 'checkDisabledRightHalf',
        },

        methods: {

            /**
             * Создание объекта заявки и передача его родительскому компоненту
             */
            createBid: function () {

                // Если не выбраны все необходимые опции передаем родительскому компоненту сообщение об этом
                if(this.notSelectedMainParams){
                    if(this.notSelectedMainOperation){
                        this.$parent.addMess('Выберите прием или получение контейнера');
                    }else if(!this.bidEmpty){
                        this.$parent.addMess('Выберите порожний или груженый контейнер');
                    }

                // Иначе формируем и передаем объект заявки
                }else{

                    if(this.webGate === 'WebGateIn' || this.webGate === 'WebGateInOut'){
                        this.$store.commit('setDefaultWebObject', 'wGateIn');
                        this.$store.commit('addDefaultContainer', 'wGateIn');
                        this.$store.commit('setContainerValue', {WebGateType: 'wGateIn', index: 0, prop: 'State', value: this.bidEmpty === 'full' || this.bidEmpty === 'full-full' || this.bidEmpty === 'full-empty' ? 'груженый' : 'порожний'});

                        if((this.DangerousGoods.includes('DangerousGoods') && this.webGate === 'WebGateIn') ||
                            (this.DangerousGoods.includes('DangerousGoodsIn') && this.webGate === 'WebGateInOut')){
                            this.$store.commit('setWebObjectValue', {WebObjectType: 'wGateIn', prop: 'DangerousGoods', value: true});
                        }
                    }

                    if(this.webGate === 'WebGateIn' && this.bidEmpty === 'full'){
                        this.$store.commit('setCargoToWebGateIn', 'wGateIn');
                    }

                    if(this.webGate === 'WebGateOut' || this.webGate === 'WebGateInOut'){
                        this.$store.commit('setDefaultWebObject', 'wGateOut');
                        this.$store.commit('addDefaultContainer', 'wGateOut');
                        this.$store.commit('setContainerValue', {WebGateType: 'wGateOut', index: 0, prop: 'State', value: this.bidEmpty === 'full' || this.bidEmpty === 'full-full' || this.bidEmpty === 'empty-full' ? 'груженый' : 'порожний'});
                        if((this.DangerousGoods.includes('DangerousGoods') && this.webGate === 'WebGateOut') ||
                            (this.DangerousGoods.includes('DangerousGoodsOut') && this.webGate === 'WebGateInOut')){
                            this.$store.commit('setWebObjectValue', {WebObjectType: 'wGateOut', prop: 'DangerousGoods', value: true});
                        }
                    }

                    if(this.WebInlandTransportation){
                        this.$store.commit('setDefaultWebObject', 'wInlandTransportation');
                        if(this.ReturnContainer){
                            this.$store.commit('setWebObjectValue', {WebObjectType: 'wInlandTransportation', prop: 'ReturnContainer', value: true});
                        }
                    }
                    if(this.WebCustomsRelease){
                        this.$store.commit('setDefaultWebObject', 'wCustomsRelease');
                    }
                    if(this.WebStaffingStripping){
                        this.$store.commit('setDefaultWebObject', 'wStaffingStripping');
                    }
                    if(this.RepairContainer){
                        this.$store.commit('setDefaultWebObject', 'wRepairContainer');
                    }


                    // let operations = [];
                    // for (let operation in this.$data){
                    //
                    //     // Перебор данных.
                    //     if(this.$data.hasOwnProperty(operation) && this[operation]){
                    //
                    //         if(operation === 'bidEmpty'){
                    //             this.$store.commit('setBidProp', {prop: 'BidEmpty', value: this[operation]});
                    //         }
                    //
                    //         // Перебор массива
                    //         if(operation === 'DangerousGoods' && this[operation] && this[operation].length > 0 && this[operation].forEach){
                    //             this[operation].forEach(emptyValue => this.$store.commit('addPoint', emptyValue));
                    //
                    //         // Нужны значения объекта data
                    //         }else if(operation === 'webGate' || operation === 'bidEmpty'){
                    //             this.$store.commit('addPoint', this[operation]);
                    //
                    //         // Нужны ключи объекта data
                    //         }else if(operation !== 'DangerousGoods' && operation !== 'webGate' && operation !== 'bidEmpty'){
                    //             this.$store.commit('addPoint', operation);
                    //         }
                    //     }
                    // }
                }
            },

            /**
             * Очистка полей правой стороны
             */
            clearRightHalf: function () {
                this.WebInlandTransportation = false;
                this.WebCustomsRelease = false;
                this.WebStaffingStripping = false;
                this.ReturnContainer = false;
                this.RepairContainer = false;
            },

            /**
             * Проверка полей правой стороны и параметра опасный груз на disabled с последующей деактивацией
             */
            checkDisabledRightHalf: function () {

                if(this.notCanSelectCustomsRelease){
                    this.WebCustomsRelease = false;
                }
                if(this.notCanSelectWebStaffingStripping){
                    this.WebStaffingStripping = false;
                }
                if(this.notCanSelectRepair){
                    this.RepairContainer = false;
                }
                if(this.notCanSelectReturnContainer){
                    this.ReturnContainer = false;
                }

                let DangerousGoodsIndex = this.DangerousGoods.indexOf('DangerousGoods');
                if(this.bidEmpty !== 'full' && !this.WebStaffingStripping && ~DangerousGoodsIndex){
                    this.DangerousGoods.splice(DangerousGoodsIndex, 1);
                }
                DangerousGoodsIndex = this.DangerousGoods.indexOf('DangerousGoodsIn');
                if(this.bidEmpty !== 'full-empty' && this.bidEmpty !== 'full-full' && ~DangerousGoodsIndex){
                    this.DangerousGoods.splice(DangerousGoodsIndex, 1);
                }
                DangerousGoodsIndex = this.DangerousGoods.indexOf('DangerousGoodsOut');
                if(this.bidEmpty !== 'full-full' && this.bidEmpty !== 'empty-full' && ~DangerousGoodsIndex){
                    this.DangerousGoods.splice(DangerousGoodsIndex, 1);
                }
            },
        }
    }
</script>

<style scoped>

</style>
