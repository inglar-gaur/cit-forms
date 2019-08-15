<template>
    <div class="form_row flex-start">
        <fieldset class="load_period">
            <span class="service_date">{{ tableTitle }}</span>
            <div class="labels">
                <label>
                    <span class="title">с</span>
                    <!-- // todo тут должен быть датапикер"       -->
                    <input name="load_period_from" type="text">
                </label>
                <label>
                    <span class="title">до</span>
                    <!-- // todo тут должен быть датапикер"       -->
                    <input name="load_period_to" type="text">
                </label>
            </div>
        </fieldset>
        <label class="container_number">
            <span class="title">Собственник</span>
            <input type="text" name="departure_container_info__owner">
        </label>
    </div>
</template>

<script>
    export default {
        name: "CustomRelease",

        computed:{
            tableTitle: function () {
                let tableTitle = 'Период выполнения перемещения ';

                if(this.$store.state.SelectedBidPoints.list.includes('WebGateIn')){
                    tableTitle += 'на СВХ';
                }else if(this.$store.state.SelectedBidPoints.list.includes('WebGateOut')){
                    tableTitle += 'из СВХ';
                }

                return tableTitle;
            }
        },
    }
</script>

<style scoped>

</style>