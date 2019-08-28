export default {
    state: {
        Hours: [10, 12, 14, 17],
        Minutes: [10, 12, 14, 17],
        Streets: [
            {Title: '3-го Интернационала', Art: '18.2', 20: 8800, '20h': 10300, 40: 10500, '40h': 11100},
            {Title: '3-й Пятилетки', Art: '18.3', 20: 8500, '20h': 9800, 40: 10000, '40h': 10500},
            {Title: '8 марта, 10', Art: '18.4', 20: 8500, '20h': 9800, 40: 10000, '40h': 10500},
            {Title: '8 марта, 84, 101', Art: '18.5', 20: 8500, '20h': 9800, 40: 10000, '40h': 10500},
            {Title: '8 марта, 181', Art: '18.6', 20: 8300, '20h': 9400, 40: 98000, '40h': 10300},
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
            {title: 'Сухая очистка (уборка) контейнера после выгрузки груза', unit: 0, Cost: 2000},
            {title: 'Навешивание/наклеивание сертификационных табличек (КБК, КТК)', unit: 1, Cost: 200},
            {title: 'Предоставление ЗПУ на контейнер', unit: 1, Cost: 300},
            {title: 'Предоставление ЗПУ на контейнер для перевозки опасных грузов', unit: 1, Cost: 600},
        ],
        UnitTitles: [
            'контейнер',
            'штука',
            'контейнер/сутки',
            'операция',
            'грузовое место',
            'паллета',
        ],
        PriceServices: [
            {
                Title: 'Терминальные услуги',
                List: [
                    {
                        Title: 'терминальное обслуживание рефрижераторного контейнера',
                        List: [
                            {
                                Title: 'Хранение рефрижераторного контейнера с подключением к электроснабжению',
                                Foot: 20,
                                Art: '10.13',
                                Cost: 1500,
                                Unit: 2

                            },
                            {
                                Title: 'Хранение рефрижераторного контейнера с подключением к электроснабжению',
                                Foot: 40,
                                Art: '10.14',
                                Cost: 2000,
                                Unit: 2
                            },
                            {
                                Title: 'Хранение рефрижераторного контейнера с навесным дизель генератором под нагрузкой',
                                Art: '10.15',
                                Cost: 1000,
                                Unit: 2
                            },
                            {
                                Title: 'Снятие навесного дизель-генератора с контейнера',
                                Art: '10.19',
                                Cost: 500,
                                Unit: 3
                            },
                        ]
                    },
                    {
                        Title: 'экспедирование и логистические услуги',
                        List: [
                            {
                                Title: 'Оформление переадресации, оформление телеграммы',
                                Art: '10.59',
                                Cost: 500,
                                Unit: 0

                            },
                            {
                                Title: 'Организация услуг по поиску и оформлению предоставления места на ж/д платформе',
                                Art: '10.60',
                                Cost: 5000,
                                Unit: 0

                            },
                            {
                                Title: 'Организация услуг по поиску и оформлению пользования контейнером',
                                Art: '10.61',
                                Cost: 5000,
                                Unit: 0

                            },
                        ]
                    }
                ]
            },
            {
                Title: 'Склад временного хранения',
                List: [
                    {
                        Title: 'технологические операции по заявке Заказчика',
                        List: [
                            {
                                Title: 'Предоставление товара для досмотра/осмотра отбора проб/образцов',
                                Art: '11.21',
                                Cost: 600,
                                Unit: 5
                            },
                            {
                                Title: 'Распаллетирование грузового места',
                                Art: '11.22',
                                Cost: 400,
                                Unit: 6
                            },
                        ]
                    }
                ]
            }
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
        getPriceServices: state => state.PriceServices,

        /**
         * @param state
         * @return {Array.<String>|null}
         */
        getStreetsList: state => {
            return state.Streets.map(street => street.Title).filter(street => street)
        },

        getStreets: state => state.Streets,
        // getStreetZoneCost: state => streetTitle => {
        //     let streetIndex = state.Streets.findIndex(street => street.title === streetTitle);
        //     if (~streetIndex && state.Streets[streetIndex].zone && state.StreetZoneCosts[state.Streets[streetIndex].zone]) {
        //         return state.StreetZoneCosts[state.Streets[streetIndex].zone];
        //     }
        //     return null;
        // }

        getUnitTitle: state =>
            unitIndex => state.UnitTitles && state.UnitTitles[unitIndex] ? state.UnitTitles[unitIndex] : ''
    }

};