<template>
  <div>
    <!--        <div class="form_row">-->

    <!--            <fieldset class="load_period">-->
    <!--                <span class="title">{{ tableTitle }}</span>-->
    <!--                <div class="labels">-->
    <!--                    <label>-->
    <!--                        <span class="title">с</span>-->
    <!--                        &lt;!&ndash; // todo тут должен быть датапикер"       &ndash;&gt;-->
    <!--                        <input name="load_period_from" type="text">-->
    <!--                    </label>-->
    <!--                    <label>-->
    <!--                        <span class="title">до</span>-->
    <!--                        &lt;!&ndash; // todo тут должен быть датапикер"       &ndash;&gt;-->
    <!--                        <input name="load_period_to" type="text">-->
    <!--                    </label>-->
    <!--                </div>-->
    <!--            </fieldset>-->

    <!--        </div>-->

    <div class="form_row">


      <table class="full_table receiving_cargo_information">
        <tr>
          <th :colspan="operations.includes('DangerousGoods') ? 9 : 8">Сведения о грузе</th>
        </tr>
        <tr>
          <th class="wide" colspan="3">Наименование груза (место)</th>
          <th>Кол-во мест</th>
          <th>Масса места, брутто (кг)</th>
          <th>Габарит места Д/Ш/В, (мм)</th>
          <th>Упаковка места (описание)</th>
          <th v-if="operations.includes('DangerousGoods')">Класс опасности</th>
          <th>Особые требования к обращению с грузом</th>
        </tr>
        <tr v-for="(goods, index) in bidGoods">
          <td colspan="3">
            <input type="text" :value="goods.name">
          </td>
          <td><input type="text" @input="$parent.setBidGoods(index, 'amount',        $event.target.value)"
                     :value="goods.amount"></td>
          <td><input type="number" @input="$parent.setBidGoods(index, 'weight',        $event.target.value)"
                     :value="goods.weight"></td>
          <td><input type="number" @input="$parent.setBidGoods(index, 'size',          $event.target.value)"
                     :value="goods.size"></td>
          <td><input type="text" @input="$parent.setBidGoods(index, 'pack',          $event.target.value)"
                     :value="goods.pack"></td>
          <td v-if="operations.includes('DangerousGoods')"><input type="text" @input="$parent.setBidGoods(index, 'dangerClass',   $event.target.value)"
                     :value="goods.dangerClass"></td>
          <td><input type="text" @input="$parent.setBidGoods(index, 'specialDemand', $event.target.value)"
                     :value="goods.specialDemand"></td>
        </tr>
        <tr>
          <td>
            <button @click.prevent="$parent.addBidGoods()" class="cit_btn btn_add">+ Добавить строку</button>
          </td>
          <td colspan="2">
            <div class="sum">Итого:</div>
          </td>
          <td><input type="text" :value="bidGoods.reduce((sum, elem) => sum + (+elem.amount), 0)" disabled></td>
          <td><input type="text" :value="bidGoods.reduce((sum, elem) => sum + (+elem.weight), 0)" disabled></td>
        </tr>
      </table>
    </div>

    <div class="form_row">

      <table class="load_unload_table" v-if="operations.includes('WebGateIn')">
        <tr>
          <th></th>
          <th>Вагон</th>
          <th>Контейнер</th>
          <th>Автотранспорт</th>
          <th>Склад</th>
          <th>Площадка</th>
        </tr>
        <tr>
          <th>{{loadTableTitle}}</th>
          <td>
            <label class="label_width_outside_input">
              <input name="loading_out" type="radio" disabled>
              <span class="pseudo_checkbox"></span>
            </label>
          </td>
          <td>
            <label class="label_width_outside_input">
              <input name="loading_out" type="radio" disabled checked>
              <span class="pseudo_checkbox"></span>
            </label>
          </td>
          <td>
            <label class="label_width_outside_input">
              <input name="loading_out" type="radio" disabled>
              <span class="pseudo_checkbox"></span>
            </label>
          </td>
          <td>
            <label class="label_width_outside_input">
              <input name="loading_out" type="radio" disabled>
              <span class="pseudo_checkbox"></span>
            </label>
          </td>
          <td>
            <label class="label_width_outside_input">
              <input name="loading_out" type="radio" disabled>
              <span class="pseudo_checkbox"></span>
            </label>
          </td>
        </tr>
        <!--                <tr>-->
        <!--                    <th>Погрузка в</th>-->
        <!--                    <td>-->
        <!--                        <label class="label_width_outside_input">-->
        <!--                            <input name="loading_in" type="radio" disabled>-->
        <!--                            <span class="pseudo_checkbox"></span>-->
        <!--                        </label>-->
        <!--                    </td>-->
        <!--                    <td>-->
        <!--                        <label class="label_width_outside_input">-->
        <!--                            <input name="loading_in" type="radio" disabled :checked="operations.includes('WebGateIn')">-->
        <!--                            <span class="pseudo_checkbox"></span>-->
        <!--                        </label>-->
        <!--                    </td>-->
        <!--                    <td>-->
        <!--                        <label class="label_width_outside_input">-->
        <!--                            <input name="loading_in" type="radio" disabled>-->
        <!--                            <span class="pseudo_checkbox"></span>-->
        <!--                        </label>-->
        <!--                    </td>-->
        <!--                    <td>-->
        <!--                        <label class="label_width_outside_input">-->
        <!--                            <input name="loading_in" type="radio" disabled>-->
        <!--                            <span class="pseudo_checkbox"></span>-->
        <!--                        </label>-->
        <!--                    </td>-->
        <!--                    <td>-->
        <!--                        <label class="label_width_outside_input">-->
        <!--                            <input name="loading_in" type="radio" disabled>-->
        <!--                            <span class="pseudo_checkbox"></span>-->
        <!--                        </label>-->
        <!--                    </td>-->
        <!--                </tr>-->
      </table>

      <label style="margin-left: 30px">
        <span class="title">Масса груза, кг</span>
        <input type="number" name="receiving_form__cargo_parameters__weight">
      </label>

    </div>
  </div>
</template>

<script>
    export default {
        name: "WebStaffingStripping",

        props: {
            operations: {type: Array, default: []},
            bidGoods: {type: Array, default: []}
        },

        computed: {
            tableTitle: function () {
                let tableTitle = 'Период выполнения';

                if (this.operations.includes('WebGateIn')) {
                    tableTitle += ' погрузочных работ';
                } else if (this.operations.includes('WebGateOut')) {
                    tableTitle += ' разгрузочных работ';
                }

                return tableTitle;
            },

            loadTableTitle: function () {
                let loadTableTitle = '';

                if (this.operations.includes('WebGateIn')) {
                    loadTableTitle += 'Разгрузка из';
                } else if (this.operations.includes('WebGateOut')) {
                    loadTableTitle += 'Погрузка в';
                }

                return loadTableTitle;
            },
        }
    }
</script>

<style scoped>

</style>
