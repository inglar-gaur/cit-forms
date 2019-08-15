<template>
    <div class="cargo_parameters">
        <template v-if="$store.state.WebBid.bidEmpty === 'full'">
            <label>
                <span class="title">Масса груза, кг</span>
                <input type="number" :value="mass" @input="$parent.setBidProp('massa', $event.target.value)">
                <span class="or">или</span>
            </label>
            <label>
                <span class="title">Брутто контейнера, кг</span>
                <input type="number" :value="WeightGross" @input="$parent.setBidProp('brutto', $event.target.value)">
            </label>
        </template>
        <label v-if="$store.state.WebBid.DangerousGoods">
            <span class="title">Класс опасности</span>
            <input type="text" name="receiving_form__cargo_parameters__danger_class">
        </label>
    </div>
</template>

<script>
    export default {
        name: "CargoParameters"
    }
</script>

<style scoped>

</style>