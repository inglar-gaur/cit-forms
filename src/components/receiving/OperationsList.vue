<template>
    <fieldset class="chosen_parameters">
        <label v-for="(operation, index) in operationList" :key="index" class="label_width_outside_input">
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
        WebGateOut:         'выдать с терминала',
        webGateInOut:       'принять/выдать',
        full:               'груженый',
        empty:              'порожний',
        RepairContainer:    'заказать ремонт контейнера',
        DangerousGoods:     'опасный груз',
    };

    export default {
        name: "OperationsList",

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
                let SelectedBidPoints = this.$store.state.SelectedBidPoints.list;

                for(let i = 0; i < SelectedBidPoints.length; i++){

                    // Если есть в списке с названиями
                    if(operationsTitle[SelectedBidPoints[i]]){
                        operations.push(operationsTitle[SelectedBidPoints[i]]);

                    // Персональные обработчики
                    }else{
                        switch (SelectedBidPoints[i]) {
                            case 'WebInlandTransportation':
                                operations.push('заказать автоперевозку'+(SelectedBidPoints.includes('WebGateInOut') ? '' : ((SelectedBidPoints.includes('WebGateIn') ? ' до' : ' от') + ' терминала')));
                                break;
                            case 'WebCustomsRelease':
                                operations.push('заказать перемещение '+(SelectedBidPoints.includes('WebGateIn') ? 'на' : 'из')+' СВХ');
                                break;
                            case 'WebStaffingStripping':
                                operations.push('заказать '+(SelectedBidPoints.includes('empty') ? 'погрузку' : 'разгрузку')+' контейнера');
                                break;
                            case 'ReturnContainer':
                                operations.push('заказать обратную доставку '+(SelectedBidPoints.includes('empty') ? 'груженого' : 'порожнего')+' контейнера');
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
