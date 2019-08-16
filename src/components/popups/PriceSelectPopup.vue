<template>
    <div class="price-select-popup select" v-show="$store.state.Popups.PriceSelectPopup">
        <span class="close-cross" @click="$store.commit('closePopup', 'PriceSelectPopup')">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M193.94 256L296.5 153.44l21.15-21.15c3.12-3.12 3.12-8.19 0-11.31l-22.63-22.63c-3.12-3.12-8.19-3.12-11.31 0L160 222.06 36.29 98.34c-3.12-3.12-8.19-3.12-11.31 0L2.34 120.97c-3.12 3.12-3.12 8.19 0 11.31L126.06 256 2.34 379.71c-3.12 3.12-3.12 8.19 0 11.31l22.63 22.63c3.12 3.12 8.19 3.12 11.31 0L160 289.94 262.56 392.5l21.15 21.15c3.12 3.12 8.19 3.12 11.31 0l22.63-22.63c3.12-3.12 3.12-8.19 0-11.31L193.94 256z"></path></svg>
        </span>

        <table>
            <tr v-for="(basicService, index) in $store.getters.getBasicServices">
                <td>
                    <label class="label_width_outside_input">
                        <input type="checkbox" :value="index" :checked="$store.getters.getSelectedPriceElements.Basic.includes(index)" v-model="SelectedBasicServices">
                        <span class="pseudo_checkbox"></span>
                    </label>
                </td>
                <td>
                    <span class="title">{{basicService.title}}</span>
                </td>
                <td>
                    <span>{{basicService.Cost}}</span>
                </td>
            </tr>
        </table>

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

        /*position: fixed;*/
        /*background-color: white;*/
        /*z-index: 1000;*/
        /*top: 2.5%;*/
        /*left: 2.5%;*/

        /*width: 45vw;*/
        /*height: 95vh;*/

        /*border: 2px solid #DA2341;*/
        /*.close-cross{*/
        /*    position: absolute;*/
        /*    top: 5px;*/
        /*    right: 15px;*/
        /*    color: red;*/
        /*    font-size: 30px;*/
        /*    cursor: pointer;*/
        /*}*/
    }


</style>
