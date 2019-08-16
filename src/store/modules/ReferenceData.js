export default {
    state: {
        Hours: [10, 12, 14, 17],
        Minutes: [10, 12, 14, 17],
        Streets: [
            {title: '3-го Интернационала', 20: 8800, '20h': 10300, 40: 10500, '40h': 11100},
            {title: '3-й Пятилетки', 20: 8500, '20h': 9800, 40: 10000, '40h': 10500},
            {title: '8 марта, 10', 20: 8500, '20h': 9800, 40: 10000, '40h': 10500},
            {title: '8 марта, 84, 101', 20: 8500, '20h': 9800, 40: 10000, '40h': 10500},
            {title: '8 марта, 181', 20: 8300, '20h': 9400, 40: 98000, '40h': 10300},
        ],
        RepairVariants: [
            {
                title: 'Повреждения верхних/нижних стопоров кулачков запорных штанг', characteristics: {
                    1: 'Исправление без замены элемента',
                    2: 'Исправление с заменой элемента (включает стоимость элемента)'
                }
            },
            {
                title: 'Деформация кулачка', characteristics: {
                    1: 'Исправление без замены элемента',
                    2: 'Исправление с заменой элемента (включает стоимость элемента)'
                }
            },
            {
                title: 'Повреждение уплотнителя', characteristics: {
                    1: 'Ремонт при повреждении до (длина), мм: 500 включительно. Исправление без замены элемента',
                    2: 'Восстановление при отсутствии или разрыве элемента, ремонт при повреждении более (длина), мм 500. Исправление с заменой элемента (включает стоимость элемента)'
                }
            },
            {
                title: 'Деформация угловой стойки', characteristics: {
                    2: 'Ремонт при деформации элемента не более (д/г), мм: 1000х50 включительно',
                    3: 'Ремонт при деформации элемента от (д/г), мм: 1001х50 до (д/г), мм: 1500х80 включительно',
                    4: 'Ремонт при превышении характеристик по III категории'
                }
            },
        ],
        BasicServices: [
            {title: 'Сухая очистка (уборка) контейнера после выгрузки груза', unit: 'контейнер', Cost: 2000},
            {title: 'Навешивание/наклеивание сертификационных табличек (КБК, КТК)', unit: 'штука', Cost: 200},
            {title: 'Предоставление ЗПУ на контейнер', unit: 'штука', Cost: 300},
            {title: 'Предоставление ЗПУ на контейнер для перевозки опасных грузов', unit: 'штука', Cost: 600},
        ]
    },

    getters: {

        getRepairVariants: state => state.RepairVariants,

        getTitlesRepairVariants: (state, getters) =>

            state && Array.isArray(state.RepairVariants) ?
                state.RepairVariants.map(RepairVariant => RepairVariant.title):
                // .filter((RepairVariant, index) => !getters.getSelectedRepairServices.includes(index)) :
                [],

        getBasicServices: state => state.BasicServices,

        /**
         * @param state
         * @return {Array.<String>|null}
         */
        getStreetsList: state => {
            return state.Streets.map(street => street.title).filter(street => street)
        },

        getStreets: state => state.Streets,
        // getStreetZoneCost: state => streetTitle => {
        //     let streetIndex = state.Streets.findIndex(street => street.title === streetTitle);
        //     if (~streetIndex && state.Streets[streetIndex].zone && state.StreetZoneCosts[state.Streets[streetIndex].zone]) {
        //         return state.StreetZoneCosts[state.Streets[streetIndex].zone];
        //     }
        //     return null;
        // }
    }

};