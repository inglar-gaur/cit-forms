<template>
    <div class="price-select-popup" v-show="$store.state.Popups.PriceSelectedPopup">
        <span class="close-cross" @click="$store.commit('closePopup', 'PriceSelectedPopup')">x</span>
        <table>
            <tr v-for="priceWebBidSelectedElement in $store.state.getSelectedPriceElements">
                <td>{{priceWebBidSelectedElement.title}}</td>
                <td></td>
                <td>{{priceWebBidSelectedElement.unit}}</td>
                <td>{{priceWebBidSelectedElement.price}}</td>
            </tr>
        </table>
    </div>
</template>

<script>
    export default {
        name: "PriceSelectedPopup",
    }
</script>

<style scoped lang="scss">
    .price-select-popup {

        position: fixed;
        background-color: white;
        z-index: 1000;
        top: 2.5%;
        right: 2.5%;

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
