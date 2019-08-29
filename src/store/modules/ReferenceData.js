export default {
    state: {
        Hours: [10, 12, 14, 17],
        Minutes: [10, 12, 14, 17],

        /**
         * Список улиц для доставвки
         */
        Streets: {
            '18.2': {Title: '3-го Интернационала', Art: '18.2', 20: 8800, '20h': 10300, 40: 10500, '40h': 11100},
            '18.3': {Title: '3-й Пятилетки', Art: '18.3', 20: 8500, '20h': 9800, 40: 10000, '40h': 10500},
            '18.4': {Title: '8 марта, 10', Art: '18.4', 20: 8500, '20h': 9800, 40: 10000, '40h': 10500},
            '18.5': {Title: '8 марта, 84, 101', Art: '18.5', 20: 8500, '20h': 9800, 40: 10000, '40h': 10500},
            '18.6': {Title: '8 марта, 181', Art: '18.6', 20: 8300, '20h': 9400, 40: 98000, '40h': 10300},
        },

        /**
         * Список услуг ремонта
         */
        RepairServices: [
            {
                Title: 'Повреждения верхних/нижних стопоров кулачков запорных штанг', Characteristics: {
                    '13.1': {Title: 'Исправление без замены элемента', Category: 1},
                    '13.2': {Title: 'Исправление с заменой элемента (включает стоимость элемента)', Category: 2}
                }
            },
            {
                Title: 'Деформация кулачка', Characteristics: {
                    '13.3': {Title: 'Исправление без замены элемента', Alt: '13.3', Category: 1},
                    '13.4': {Title: 'Исправление с заменой элемента (включает стоимость элемента)', Category: 2}
                }
            },
            {
                Title: 'Повреждение уплотнителя', Characteristics: {
                    '13.5': {Title: 'Ремонт при повреждении до (длина), мм: 500 включительно. Исправление без замены элемента', Category: 1},
                    '13.6': {Title: 'Восстановление при отсутствии или разрыве элемента, ремонт при повреждении более (длина), мм 500. Исправление с заменой элемента (включает стоимость элемента)', Category: 2},
                    '13.7': {Title: 'Восстановление при отсутствии или разрыве элемента (включает стоимость элемента)', Category: 2},
                }
            },
            {
                Title: 'Деформация угловой стойки', Characteristics: {
                    '13.25': {Title: 'Ремонт при деформации элемента не более (д/г), мм: 1000х50 включительно', Category: 2},
                    '13.26': {Title: 'Ремонт при деформации элемента от (д/г), мм: 1001х50 до (д/г), мм: 1500х80 включительно', Category: 3},
                    '13.27': {Title: 'Ремонт при превышении характеристик по III категории', Category: 4}
                }
            },
        ],

        /**
         * Список базовых услуг
         */
        BasicServices: [
            {title: 'Сухая очистка (уборка) контейнера после выгрузки груза', unit: 0, Cost: 2000},
            {title: 'Навешивание/наклеивание сертификационных табличек (КБК, КТК)', unit: 1, Cost: 200},
            {title: 'Предоставление ЗПУ на контейнер', unit: 1, Cost: 300},
            {title: 'Предоставление ЗПУ на контейнер для перевозки опасных грузов', unit: 1, Cost: 600},
        ],

        /**
         * Список с названиями единиц измерения
         */
        UnitTitles: [
            'контейнер',
            'штука',
            'контейнер/сутки',
            'операция',
            'грузовое место',
            'паллета',
        ],

        /**
         * Список услуг по прайсу
         */
        PriceServices: [
            {
                Title: 'Терминальные услуги',
                Categories: [
                    {
                        Title: 'терминальное обслуживание рефрижераторного контейнера',
                        Services: {
                            '10.13': {Title: 'Хранение рефрижераторного контейнера с подключением к электроснабжению', Foot: 20, Cost: 1500, Unit: 2},
                            '10.14': {Title: 'Хранение рефрижераторного контейнера с подключением к электроснабжению', Foot: 40, Cost: 2000, Unit: 2},
                            '10.15': {Title: 'Хранение рефрижераторного контейнера с навесным дизель генератором под нагрузкой', Cost: 1000, Unit: 2},
                            '10.19': {Title: 'Снятие навесного дизель-генератора с контейнера', Cost: 500, Unit: 3},
                        }
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

        getRepairServices: state => state.RepairServices,

        getBasicServices: state => state.BasicServices,
        getPriceServices: state => state.PriceServices,

        /**
         * @param state
         * @return {Array.<String>|null}
         */
        getStreetsList: state => {
            let StreetsList = [];

            for(let StreetArt in state.Streets){
                if(state.Streets.hasOwnProperty(StreetArt) && state.Streets[StreetArt].Title){
                    StreetsList.push(state.Streets[StreetArt].Title);
                }
            }
            return StreetsList;
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