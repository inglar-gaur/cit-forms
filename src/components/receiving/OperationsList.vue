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

    let operationsTitle = {
        WebGateIn:          'принять на терминал',
        webGateOut:         'выдать с терминала',
        webGateInOut:       'принять/выдать',
        full:               'груженый',
        empty:              'порожний',
        RepairContainer:    'заказать ремонт контейнера',
        ReturnContainer:    'заказать обратную доставку контейнера',
    };

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

                for(let i = 0; i < this.operations.length; i++){

                    // Если есть в списке с названиями
                    if(operationsTitle[this.operations[i]]){
                        operations.push(operationsTitle[this.operations[i]]);

                    // Персональные обработчики
                    }else{
                        switch (this.operations[i]) {
                            case 'WebInlandTransportation':
                                operations.push('заказать автоперевозку'+(this.operations.includes('WebGateInOut') ? '' : ((this.operations.includes('WebGateIn') ? ' до' : ' от') + ' терминала')));
                                break;
                            case 'WebCustomsRelease':
                                operations.push('заказать перемещение '+(this.operations.includes('WebGateIn') ? 'на' : 'из')+' СВХ');
                                break;
                            case 'WebStaffingStripping':
                                operations.push('заказать '+(this.operations.includes('empty') ? 'погрузку' : 'разгрузку')+' контейнера');
                        }
                    }
                }

                return operations;
            }
        }
    }
</script>

<style scoped>

</style>
