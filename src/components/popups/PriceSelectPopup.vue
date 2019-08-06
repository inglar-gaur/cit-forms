<template>
    <div class="price-select-popup" v-show="$store.state.PriceSelectPopup">
        <span class="close-cross" @click="$store.commit('closePopup', 'PriceSelectPopup')">x</span>
        <div v-for="priceCategory in $store.state.Price.list">
            <label class="label_width_outside_input" v-for="pricePoint in priceCategory.points">
                <input type="checkbox" :checked="$store.state.Price.selected.includes(priceCategory)">
                <span class="pseudo_checkbox"></span>
                <span class="title">заказать ремонт контейнера</span>
            </label>
        </div>
    </div>
</template>

<script>
    export default {
        name: "PriceSelectPopup",
    }
</script>

<style scoped lang="scss">
    .price-select-popup {

        position: fixed;
        background-color: white;
        z-index: 1000;
        top: 2.5%;
        left: 2.5%;

        width: 45vw;
        height: 95vh;

        border: 2px solid #DA2341;
    }

    .close-cross{
        position: absolute;
        top: 5px;
        right: 15px;
        color: red;
        font-size: 30px;
        cursor: pointer;
    }
</style>
