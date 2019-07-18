<template>
    <fieldset class="chosen_parameters">
        <label v-for="operation in operationList" class="label_width_outside_input">
            <!-- // todo here inputs should be always checked and disabled       -->
            <input name="" type="radio" checked readonly>
            <span class="pseudo_checkbox"></span>
            <span class="title">{{ operation }}</span>
        </label>
    </fieldset>
</template>

<script>
    export default {
        name: "OperationsList",

        props: {
            operations: {type: Array, default: []},
        },

        computed: {

            /**
             * Список с названиями выбранных опций
             * @returns {Array.<string>}
             */
            operationList: function () {
                /**
                 * @type {Array.<string>}
                 */
                let operations = [];
                /**
                 * @type {boolean}
                 */
                let webGateIn = this.operations.includes('WebGateIn');
                let webGateOut = this.operations.includes('WebGateOut');

                // Принять или выдать
                if(webGateIn){
                    operations.push('принять на терминал');
                }else if (webGateOut){
                    operations.push('выдать с терминала');
                }

                // Порожний или груженый
                if(this.operations.includes('bidEmpty')){
                    operations.push('порожний');
                }else{
                    operations.push('груженый');
                }

                // Заказать автоперевозку
                if(this.operations.includes('WebInlandTransportation') && (webGateIn || webGateOut)){
                    operations.push('заказать автоперевозку '+(webGateIn ? 'до' : 'от')+' терминала');
                }

                // Заказать перемезение на/из СВХ
                if(this.operations.includes('WebCustomsRelease') && (webGateIn || webGateOut)){
                    operations.push('заказать перемещение '+(webGateIn ? 'на' : 'из')+' СВХ');
                }

                // Заказать ремонт
                if(this.operations.includes('RepairContainer')){
                    operations.push('заказать '+(this.operations.includes('bidEmpty') ? 'погрузку' : 'разгрузку')+' контейнера');
                }

                // Заказать погрузку/разгрузку
                if(this.operations.includes('WebStaffingStripping') && (webGateIn || webGateOut)){
                    operations.push('заказать ремонт контейнера');
                }

                // Заказать возврат контейнера
                if(this.operations.includes('ReturnContainer')){
                    operations.push('заказать обратную доставку контейнера');
                }

                return operations;
            }
        }
    }
</script>

<style scoped>

</style>