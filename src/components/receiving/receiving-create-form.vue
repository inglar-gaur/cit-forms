<template>
    <form class="cit_form receiving_form">

        <div v-show="mess" class="form_message success">
            {{ mess }}
        </div>

        <div class="application_wrap">
            <div class="application">
                <h2>Заявка на прием/выдачу контейнера</h2>
                <div class="form_row">
                    <div class="receiving_form_starting">

                        <div class="labels">

                            <label class="label_width_outside_input">
                                <input type="radio" name="take_gave" v-model="WebGateIn" @click="setMainOperationIn(true)">
                                <span class="pseudo_checkbox"></span>
                                <span class="title">Принять на терминал</span>
                            </label>

                            <label class="label_width_outside_input">
                                <input type="radio" name="take_gave" v-model="WebGateOut" @click="setMainOperationIn(true)">
                                <span class="pseudo_checkbox"></span>
                                <span class="title">Выдать с терминала</span>
                            </label>

                            <label class="label_width_outside_input">
                                <input name="trucking_parameters_state" type="radio">
                                <span class="pseudo_checkbox"></span>
                                <span class="title">Порожний</span>
                            </label>

                            <label class="label_width_outside_input">
                                <input name="trucking_parameters_state" type="radio">
                                <span class="pseudo_checkbox"></span>
                                <span class="title">Груженый</span>
                            </label>

                            <label class="label_width_outside_input">
                                <input type="checkbox" v-model="DangerousGoods">
                                <span class="pseudo_checkbox"></span>
                                <span class="title">Опасный груз</span>
                            </label>

                        </div>

                        <div class="labels">

                            <label class="label_width_outside_input">
                                <input type="checkbox" disabled>
                                <span class="pseudo_checkbox"></span>
                                <span class="title">заказать перемещение на/с СВХ</span>
                            </label>

                            <label class="label_width_outside_input">
                                <input type="checkbox" disabled>
                                <span class="pseudo_checkbox"></span>
                                <span class="title">заказать автоперевозку до/от терминала</span>
                            </label>
                            <label class="label_width_outside_input">
                                <input type="checkbox" disabled>
                                <span class="pseudo_checkbox"></span>
                                <span class="title">заказать погрузку/разгрузку груза</span>
                            </label>

                            <label class="label_width_outside_input">
                                <input type="checkbox" disabled>
                                <span class="pseudo_checkbox"></span>
                                <span class="title">заказать ремонт контейнера</span>
                            </label>

                            <label class="label_width_outside_input">
                                <input type="checkbox" disabled>
                                <span class="pseudo_checkbox"></span>
                                <span class="title">заказать обратную доставку контейнера</span>
                            </label>


                        </div>

                    </div>
                </div>
            </div>
        </div>

        <div class="application_wrap">
            <div class="application">
                <h2>Заявка на прием/выдачу контейнера</h2>
                <div class="form_row">
                    <div class="receiving_form_starting">

                        <!-- //todo проставить names в зависимости от того чекбоксы это или радио батоны -->
                        <div class="labels">
                            <label class="label_width_outside_input">
                                <input type="checkbox" v-model="WebGateIn" @click="setMainOperationIn(true)">
                                <span class="pseudo_checkbox"></span>
                                <span class="title">Принять на терминал</span>
                            </label>
                            <label class="label_width_outside_input">
                                <input type="checkbox" v-model="WebGateOut" @click="setMainOperationIn(true)">
                                <span class="pseudo_checkbox"></span>
                                <span class="title">Выдать с терминала</span>
                            </label>
                        </div>

                        <div class="labels" v-if="selectedMainOperation">
                            <label class="label_width_outside_input">
                                <input type="checkbox" v-model="DangerousGoods">
                                <span class="pseudo_checkbox"></span>
                                <span class="title">Опасный груз</span>
                            </label>
                        </div>

                        <div class="labels"  v-if="selectedMainOperation">
                            <label class="label_width_outside_input">
                                <input v-model="WebInlandTransportation" type="checkbox">
                                <span class="pseudo_checkbox"></span>
                                <span class="title">Заказать автоперевозку</span>
                            </label>
                            <label class="label_width_outside_input">
                                <input v-model="WebStaffingStripping" type="checkbox">
                                <span class="pseudo_checkbox"></span>
                                <span class="title">Заказать погрузо-разгрузочные работы</span>
                            </label>
                        </div>

                        <div class="labels" v-if="selectedMainOperation">
                            <label class="label_width_outside_input">
                                <input v-model="WebCustomsRelease" type="checkbox">
                                <span class="pseudo_checkbox"></span>
<!--                                <span v-if="bidType === 'WebGateIn'" class="title">Заказать перемещение из СВХ</span>-->
<!--                                <span v-if="bidType === 'WebGateOut'" class="title">Переместить в СВХ</span>-->
                            </label>
                        </div>

                    </div>
                </div>
            </div>
        </div>
        <button @click.prevent="createBid" :disabled="!selectedMainOperation" class="cit_btn btn_submit" type="submit">Создать заявку</button>
    </form>
</template>

<script>
    export default {

        /**
         * @typedef bid - Заявка
         * @property
         */

        name: "receiving-create-form",

        props: [
            "mess"
        ],

        data: function () {
            return {
                WebGateIn: false,                   // Операция подачи контейнера
                WebGateOut: false,                  // Операция вывоза контейнера
                DangerousGoods: false,              // Опция опасный груз
                WebInlandTransportation: false,     // Доставка автотранспортом
                WebCustomsRelease: false,           // Перемещение из зоны СВХ
                WebStaffingStripping: false,        // Погрузочно-разгрузочные работы
            }
        },

        computed: {
            selectedMainOperation: function(){
                return this.WebGateIn || this.WebGateOut;
            },
        },

        methods: {
            changeMainOperation: function(){
                this.WebGateIn = !this.WebGateIn;
                this.WebGateOut = !this.WebGateIn;
            },

            createBid: function () {

                let operations = [];
                for (let operation in this.$data){
                    if(this.$data.hasOwnProperty(operation) && this[operation]){
                        operations.push(operation);
                    }
                }

                this.$parent.createBid(operations);
            }
        }
    }
</script>

<style scoped>

</style>