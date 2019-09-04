<template>
    <div v-if="$store.state.WebBid.wStaffingStripping">

        <CargoDetails
                :elements="$store.state.WebBid.wStaffingStripping.Cargo.Elements"
                @changeCargoElement="$store.commit('changeCargoElement', {WebObjectType: 'wStaffingStripping', index:$event.index,  prop:$event.prop,  value:$event.value})"
                @addDefaultCargoElement="$store.commit('addDefaultCargoElement', 'wStaffingStripping')"
        ></CargoDetails>

        <div class="form_row" v-if="$store.getters.isWebGateIn">

            <table class="load_unload_table">
                <tr>
                    <th :colspan="goodsPlaces.length">Объект перемещения груза (место нахождения груза)</th>
                </tr>
                <tr>
                    <th v-for="(place, index) in goodsPlaces" :key="index">{{place.title}}</th>
                </tr>
                <tr>
                    <td v-for="(place, index) in goodsPlaces" :key="index">
                        <label class="label_width_outside_input">
                            <input name="loading_out" :value="index" type="radio" v-model="goodsPlace">
                            <span class="pseudo_checkbox"></span>
                        </label>
                    </td>
                </tr>
            </table>

            <table style="margin-left: 40px">
                <tr>
                    <th>{{goodsPlaceTitle}}</th>
                </tr>
                <tr>
                    <td style="position: relative">
                        <input type="text" name="" style="height: 62px; position: absolute; top: 0; left: 0">
                    </td>
                </tr>
            </table>

        </div>
    </div>
</template>

<script>
    import CargoDetails from "./subForms/CargoDetails";
    export default {
        name: "WebStaffingStripping",
        components: {CargoDetails},
        data(){
          return {
              goodsPlace: -1,
              goodsPlaces: [
                  {title: 'Открытая площадка', sign: '№ места на площадке'},
                  {title: 'Склад', sign: '№ склада'},
                  {title: 'Автотранспорт', sign: '№ автотренспортного средства'},
                  {title: 'Контейнер', sign: '№ контейнер'},
                  {title: 'Вагон', sign: '№ вагона'},
              ]
          };
        },
        computed: {
            tableTitle: function () {
                let tableTitle = 'Период выполнения';

                if (this.$store.getters.isWebGateIn) {
                    tableTitle += ' погрузочных работ';
                } else if (this.$store.getters.isWebGateOut) {
                    tableTitle += ' разгрузочных работ';
                }

                return tableTitle;
            },

            loadTableTitle: function () {
                let loadTableTitle = '';

                if (this.$store.getters.isWebGateIn) {
                    loadTableTitle += 'Разгрузка из';
                } else if (this.$store.getters.isWebGateOut) {
                    loadTableTitle += 'Погрузка в';
                }

                return loadTableTitle;
            },

            goodsPlaceTitle(){
                return this.goodsPlaces[this.goodsPlace] && this.goodsPlaces[this.goodsPlace].sign ? this.goodsPlaces[this.goodsPlace].sign : 'Признак объекта';
            }
        }
    }
</script>

<style scoped>

</style>
