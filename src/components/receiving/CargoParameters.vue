<template>
    <div class="cargo_parameters">
        <label v-if="!bidEmpty">
            <span class="title">Масса груза, кг</span>
            <input type="number" :value="mass" @input="$parent.setBidProp('massa', $event.target.value)">
            <span class="or">или</span>
        </label>
        <label v-if="!bidEmpty">
            <span class="title">Брутто контейнера, кг</span>
            <input type="number" :value="gross" @input="$parent.setBidProp('brutto', $event.target.value)">
        </label>
        <label v-if="dangerCargo">
            <span class="title">Класс опасности</span>
            <input type="text" name="receiving_form__cargo_parameters__danger_class">
        </label>
    </div>
</template>

<script>
    export default {
        name: "CargoParameters",

        props: {
            bidEmpty:       {type: Boolean, default: null},
            dangerCargo:    {type: Boolean, default: null},
            mass:           {type: Number, default: null},
            gross:          {type: Number, default: null},
        }
    }
</script>

<style scoped>

</style>