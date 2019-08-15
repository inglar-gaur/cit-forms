<template>
    <div class="price-select-popup" v-show="$store.state.Popups.PriceSelectPopup">
        <span class="close-cross" @click="$store.commit('closePopup', 'PriceSelectPopup')">x</span>
        <div style="margin: 50px 10px">
            <label class="label_width_outside_input" v-for="(basicService, index) in $store.getters.getBasicServices" style="display: flex; justify-content: space-between">
                <div>
                    <input type="checkbox" :value="index" :checked="$store.getters.getSelectedPriceElements.Basic.includes(index)" v-model="SelectedBasicServices">
                    <span class="pseudo_checkbox"></span>
                    <span class="title">{{basicService.title}}</span>
                </div>
                <span>{{basicService.price}}</span>
            </label>
        </div>
    </div>
</template>

<script>
    export default {
        name: "PriceSelectPopup",

        data(){
            return {
              SelectedBasicServices: []
            };
        },

        watch: {
            SelectedBasicServices(){
                this.$store.commit('setSelectedBasicServices', this.SelectedBasicServices);
            }
        }
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
