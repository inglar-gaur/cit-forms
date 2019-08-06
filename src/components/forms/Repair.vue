<template>
    <div class="form_row">
        <table class="full_table">
            <tr>
                <th colspan="8">Сведения о повреждениях контейнера</th>
            </tr>
            <tr>
                <th colspan="3" style="width: 35%">Вид повреждения по номенклатуре исполнителя</th>
                <th style="width: 20%">Характеристика ремонта</th>
                <th style="width: 10%">Категория ремонта</th>
                <th style="width: 20%">Особые требования к производству работ</th>
                <th style="width: 15%">Приложить фото</th>
            </tr>
            <tr>
                <td colspan="2">
                    <button @click.prevent="$store.commit('addWebCargoElement')" class="cit_btn btn_add">+ Добавить
                        строку
                    </button>
                </td>
                <td></td>
                <td class="sum" style="position: relative; text-align: right"><div style="width: 80%; position: absolute; right: 5px; top: 2px">Итог категория ремонта:</div></td>
                <td>
                    <input type="text" disabled>
                </td>
            </tr>
        </table>
    </div>
</template>

<script>
    export default {
        name: "Repair"
    }
</script>

<style scoped>

</style>