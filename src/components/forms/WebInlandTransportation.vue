<template>
    <div class="form_row">
        <div class="receiving__time_interval_and_special_demand">
            <div class="time_interval">
                <div class="title">Интервал времени прибытия</div>
                <div class="labels">
                    <label>
                        <span class="label_title title">с</span>
                        <input name="arrive_time_less" type="text">
                        <span class="hours title">час.</span>
                    </label>
                    <label>
                        <span class="label_title title">до</span>
                        <input name="arrive_time_up" type="text" value="12:00" disabled>
                        <span class="hours title">час.</span>
                    </label>
                </div>
            </div>

            <label class="special_demand">
                <span class="title">Особые требования</span>
                <textarea :value="specialDemand" type="text" @input="$parent.setBidProp('specialDemand', $event.target.value)"></textarea>
            </label>
        </div>
    </div>
</template>

<script>
    export default {
        name: "WebInlandTransportation",

        props: {
            specialDemand: {type: String, default: ""}
        }
    }
</script>

<style scoped>

</style>