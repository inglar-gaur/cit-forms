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
                                <input name="trucking_parameters_state" :value="true" v-model="bidEmpty" type="radio" :disabled="notSelectedMainOperation">
                                <span class="pseudo_checkbox"></span>
                                <span class="title">Порожний</span>
                            </label>

                            <label class="label_width_outside_input">
                                <input name="trucking_parameters_state" :value="false" v-model="bidEmpty" type="radio" :disabled="notSelectedMainOperation">
                                <span class="pseudo_checkbox"></span>
                                <span class="title">Груженый</span>
                            </label>

                            <label class="label_width_outside_input">
                                <input type="checkbox" v-model="DangerousGoods" :disabled="notSelectedMainParams || bidEmpty !== false">
                                <span class="pseudo_checkbox"></span>
                                <span class="title">Опасный груз</span>
                            </label>

                        </div>

                        <div class="labels">

                            <label class="label_width_outside_input">
                                <input type="checkbox" v-model="WebCustomsRelease" :disabled="notSelectedMainParams">
                                <span class="pseudo_checkbox"></span>
                                <span class="title">заказать перемещение <span v-show="notSelectOut">на</span><span v-show="notSelectIn && notSelectOut">/</span><span v-show="notSelectIn">с</span> СВХ</span>
                            </label>

                            <label class="label_width_outside_input">
                                <input type="checkbox" v-model="WebInlandTransportation" :disabled="notSelectedMainParams">
                                <span class="pseudo_checkbox"></span>
                                <span class="title">заказать автоперевозку <span v-show="notSelectOut">до</span><span v-show="notSelectIn && notSelectOut">/</span><span v-show="notSelectIn">с</span> терминала</span>
                            </label>
                            <label class="label_width_outside_input">
                                <input type="checkbox" v-model="WebStaffingStripping" :disabled="notSelectedMainParams || notSelectIn">
                                <span class="pseudo_checkbox"></span>
                                <span class="title">заказать <span v-show="bidEmpty !== false">погрузку</span><span v-show="bidEmpty !== true && bidEmpty !== false">/</span><span v-show="bidEmpty !== true">разгрузку</span> контейнера</span>
                            </label>

                            <label class="label_width_outside_input">
                                <input type="checkbox" v-model="RepairContainer" :disabled="notSelectedMainParams || notSelectIn">
                                <span class="pseudo_checkbox"></span>
                                <span class="title">заказать ремонт контейнера</span>
                            </label>

                            <label class="label_width_outside_input">
                                <input type="checkbox" v-model="ReturnContainer" :disabled="notSelectedMainParams || !WebInlandTransportation">
                                <span class="pseudo_checkbox"></span>
                                <span class="title">заказать обратную доставку контейнера</span>
                            </label>

                        </div>
                    </div>
                </div>
            </div>
        </div>

        <button @click.prevent="createBid" class="cit_btn btn_submit" type="submit">Создать заявку</button>
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
                DangerousGoods: false,              // Опция опасный груз
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
                return this.notSelectIn && this.notSelectOut;
            },

            /**
             * Не выбрана операция приема/выдачи контейнера или опция груженый/порожний
             * @returns {boolean}
             */
            notSelectedMainParams: function(){
                return this.notSelectedMainOperation || (this.bidEmpty !== true && this.bidEmpty !== false);
            },
        },

        watch: {

            /**
             * Сбрасываем все опции из правого списка при смене операции приема/выдачи контейнера
             */
            webGate: function(){
                this.WebInlandTransportation = false;
                this.WebCustomsRelease = false;
                this.WebStaffingStripping = false;
                this.ReturnContainer = false;
                this.RepairContainer = false;
            },

            /**
             * Сбрасываем опцию "опасный груз" при выборе порожнего контейнера
             */
            bidEmpty: function () {
                if(this.bidEmpty){
                    this.DangerousGoods = null;
                }
            },

            /**
             * Сбрасываем опцию "Возврат контейнера" при отмене опции "Доставка автотранспортом"
             */
            WebInlandTransportation: function () {
                if(!this.WebInlandTransportation){
                    this.ReturnContainer = false;
                }
            }
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
                    }else if(this.bidEmpty !== true && this.bidEmpty !== false){
                        this.$parent.addMess('Выберите пустой или порожний контейнер');
                    }

                // Иначе формируем и передаем объект заявки
                }else{
                    let operations = [];
                    for (let operation in this.$data){
                        if(this.$data.hasOwnProperty(operation) && this[operation]){
                            if(operation === 'webGate'){
                                operations.push(this[operation]);
                            }else{
                                operations.push(operation);
                            }
                        }
                    }

                    this.$parent.createBid(operations);
                }
            }
        }
    }
</script>

<style scoped>

</style>