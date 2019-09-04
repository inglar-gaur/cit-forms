<template>
    <div class="price-select-popup select" v-show="$store.state.Popups.PriceSelectPopup">
        <span class="close-cross" @click="$store.commit('closePopup', 'PriceSelectPopup')">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M193.94 256L296.5 153.44l21.15-21.15c3.12-3.12 3.12-8.19 0-11.31l-22.63-22.63c-3.12-3.12-8.19-3.12-11.31 0L160 222.06 36.29 98.34c-3.12-3.12-8.19-3.12-11.31 0L2.34 120.97c-3.12 3.12-3.12 8.19 0 11.31L126.06 256 2.34 379.71c-3.12 3.12-3.12 8.19 0 11.31l22.63 22.63c3.12 3.12 8.19 3.12 11.31 0L160 289.94 262.56 392.5l21.15 21.15c3.12 3.12 8.19 3.12 11.31 0l22.63-22.63c3.12-3.12 3.12-8.19 0-11.31L193.94 256z"></path></svg>
        </span>

        <template v-if="Array.isArray($store.getters.getPriceServices.Types)">
            <div v-for="(ServiceType, TypeIndex) in $store.getters.getPriceServices.Types" :key="TypeIndex">
                <h2>{{ ServiceType }}</h2>
                <table v-if="$store.getters.getPriceServices.Categories.some(Category => Category.Type === TypeIndex)">
                    <template v-for="(CategoryIndex, CatIndex) in $store.getters.getPriceServices.Categories.map((Category, Index) => Category.Type === TypeIndex ? Index : -1).filter(CategoryIndex => ~CategoryIndex)">
                        <tr :key="CatIndex+'_cat'">
                            <th style="padding: 10px 0 5px" colspan="3">{{ $store.getters.getPriceServices.Categories[CategoryIndex].Title }}</th>
                        </tr>
                        <tr v-for="Service in getServicesListByCategory(CategoryIndex)" :key="Service.Art">
                            <td>
                                <label class="label_width_outside_input">
                                    <input type="checkbox" :value="Service.Art" :checked="SelectedPriceServices.includes(Service.Art)" v-model="SelectedPriceServices">
                                    <span class="pseudo_checkbox"></span>
                                </label>
                            </td>
                            <td>
                                <span class="title">{{Service.Title}}</span>
                            </td>
                            <td>
                                <span>{{Service.Cost}},00</span>
                            </td>
                        </tr>
                    </template>
                </table>
            </div>

        </template>

    </div>
</template>

<script>
    export default {
        name: "PriceSelectPopup",

        data(){
            return {
              SelectedPriceServices: []
            };
        },

        watch: {
            SelectedPriceServices(){
                this.$store.commit('setSelectedPriceServices', this.SelectedPriceServices);
            }
        },

        methods:{
            getServicesListByCategory(CategoryIndex){
                let ServicesList = [];

                for(let ServiceArt in this.$store.getters.getPriceServices.Services){
                    if(
                        this.$store.getters.getPriceServices.Services.hasOwnProperty(ServiceArt) &&
                        this.$store.getters.getPriceServices.Services[ServiceArt].Category === CategoryIndex
                    ){
                        let Service = this.$store.getters.getPriceServices.Services[ServiceArt];
                        Service.Art = ServiceArt;
                        ServicesList.push(Service);
                    }
                }

                return ServicesList;
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
