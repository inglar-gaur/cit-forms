<template>
    <div class="price-select-popup" v-show="$store.state.Popups.PriceSelectPopup">
        <span class="close-cross" @click="$store.commit('closePopup', 'PriceSelectPopup')">x</span>
        <div style="margin: 50px 10px">
            <label class="label_width_outside_input" v-for="(priceWebBidElement, index) in $store.state.Price.WebBid" style="display: flex; justify-content: space-between">
                <div>
                    <input type="checkbox" :checked="priceWebBidElement.checked" @input="$store.commit('changePrice', {price: 'WebBid', index: index})">
                    <span class="pseudo_checkbox"></span>
                    <span class="title">{{priceWebBidElement.title}}</span>
                </div>
                <span>{{priceWebBidElement.price}}</span>
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
