import Vue from 'vue';
import Vuex from 'vuex';
import WebBid from "./modules/WebBid";

Vue.use(Vuex);

/**
 * Сообщения
 * @typedef MessagesState
 * @property {Array} Messages
 * @property {Number} Timeout
 */
const Messages = {
    /**
     * @type MessagesState
     */
    state: {
        Messages: [],
        Timeout: null,
    },

    mutations: {
        /**
         * @param state
         * @param {String} message
         */
        addMessage: function (state, message) {
            if (!state.list.includes(message)) {
                state.list.push(message);
                state.Timeout = setTimeout(() => {
                    state.list = []
                }, 4000);
            }
        },
        clearMessages: function (state) {
            state.list = [];
            clearTimeout(state.Timeout);
        }
    }
};

const Price = {
    state: {
        SelectedBasicServices: [],
    },

    mutations: {
        setSelectedBasicServices: function (state, selectedBasicServiceIndexes) {
            if (Array.isArray(selectedBasicServiceIndexes)) {
                state.SelectedBasicServices = selectedBasicServiceIndexes;
            }
        },
    },

    getters: {
        getSelectedPriceElements: function (state, getters) {

            const SelectedPriceList = {
                Basic: [],
                InlandTransportations: [],
                RepairServices: []
            };

            SelectedPriceList.Basic = state.SelectedBasicServices.map(SelectedBasicService => getters.getBasicServices[SelectedBasicService]).filter(elem => elem);

            // Список выбранных услуг автоперевозки
            ['In', 'Out'].forEach(wInlandTransportationPostfix => {
                /**
                 * Объект автоперевозки входящей или исходящей заявки
                 * @type {WebInlandTransportation|null}
                 */
                let WebInlandTransportation = getters.getWebBidOperation('wInlandTransportation' + wInlandTransportationPostfix);

                // Если есть объект, улица и дом, выбираем цену и формируем объект для таблицы
                if (WebInlandTransportation && WebInlandTransportation.street && WebInlandTransportation.houseNumber) {

                    let StreetObject = getters.getStreets.find(street => street.title === WebInlandTransportation['street']);

                    if (StreetObject) {
                        let Container = getters['WebGate' + wInlandTransportationPostfix + 'Container'];

                        let Cost = null;
                        if (Container && (Container.Size === 20 || Container.Size === 40)) {
                            if (Container.Empty) {
                                Cost = StreetObject[Container.Size];
                            } else if (Container.Full && Container.WeightGross) {
                                Cost = StreetObject[Container.Size + ((Container.Size === 20 && Container.WeightGross > 24) || (Container.Size === 40 && Container.WeightGross > 30) ? 'h' : '')];
                            }

                            if (Cost) {
                                SelectedPriceList.InlandTransportations.push({
                                    title: 'Автоперевозка',
                                    street: WebInlandTransportation.street,
                                    houseNumber: WebInlandTransportation.houseNumber,
                                    cost: Cost
                                });
                                // При заказе обратной доставке формируем объект и дя неё
                                if (WebInlandTransportation.ReturnContainer) {
                                    SelectedPriceList.InlandTransportations.push({
                                        title: 'Автоперевозка обратная доставка',
                                        street: 'Бахчиванджи',
                                        houseNumber: 'д2',
                                        cost: 1500
                                    });
                                }
                            }
                        }
                    }
                }
            });

            /**
             * Объект с данными по ремонту
             * @type {WebRepairContainer|null}
             */
            let RepairObject = getters.getWebBidOperation('wRepairContainer');

            // Проверяем наличие и заполненность массива с услугами ремонта
            if (RepairObject && Array.isArray(RepairObject.list) && RepairObject.list.length > 0) {

                // Формируем итоговый массив из таблицы в форме
                SelectedPriceList.RepairServices = RepairObject.list.map(repairService => {
                    return {
                        Title: repairService.Name,
                        Characteristic: repairService.Characteristic,
                        RepairCategory: repairService.RepairCategory,
                        Barcode: repairService.Barcode
                    };
                })
                // Фильтруем (проверка на наличие и названия и характеристики услуги)
                    .filter(RepairService => RepairService.Title && RepairService.Characteristic)
                    // Сортируем по возрастанию категории (для подсчета итоговой категории)
                    .sort((predRepairService, nextRepairService) => nextRepairService.RepairCategory < predRepairService.RepairCategory ? 1 : -1);

                let totalCategories = {1: 0, 2: 0, 3: 0, cost: 0};
                for (let i = 0; i < SelectedPriceList.RepairServices.length; i++) {
                    if (0 < +SelectedPriceList.RepairServices[i].RepairCategory < 4) {
                        ++totalCategories[+SelectedPriceList.RepairServices[i].RepairCategory];
                    }

                    if (totalCategories[1] >= 4) {
                        ++totalCategories[2];
                        totalCategories[1] = 0
                    }
                    if (totalCategories[2] >= 4) {
                        ++totalCategories[3];
                        totalCategories[2] = 0
                    }
                    if (totalCategories[3] >= 4) {
                        ++totalCategories[4];
                        totalCategories[3] = 0
                    }

                    if (!totalCategories[4]) {
                        if (totalCategories[3]) {
                            SelectedPriceList.RepairServices[i].TotalRepairCategory = 'III';
                        } else if (totalCategories[2]) {
                            SelectedPriceList.RepairServices[i].TotalRepairCategory = 'II';
                        }
                    }

                    if (i >= SelectedPriceList.RepairServices.length - 1) {
                        if (totalCategories[4]) {
                            SelectedPriceList.RepairServices[i].Cost = 'Договорная';
                            break;
                        } else if (totalCategories[3]) {
                            SelectedPriceList.RepairServices[i].Cost = 7000;
                        } else if (totalCategories[2]) {
                            SelectedPriceList.RepairServices[i].Cost = 5000;
                        } else if (totalCategories[1]) {
                            SelectedPriceList.RepairServices[i].Cost = 3000;
                        }
                    }
                }
            }

            return SelectedPriceList;
        }
    }
};

/**
 * Модуль всплывающих окон
 * @typedef {Object} PopupsState
 * @property {Boolean} PriceSelectPopup         - Окно с добавлением пунктов из прайса
 * @property {Boolean} PriceSelectedPopup       - Окно с добавленными пунктами из прайса
 */
const PopupsModule = {
    /**
     * @type PopupsState
     */
    state: {
        PriceSelectPopup: false,
        PriceSelectedPopup: false,
    },

    mutations: {
        /**
         * @param state
         * @param {String} popup - Переменная открываемого окна
         */
        openPopup(state, popup) {
            if (Object.getOwnPropertyDescriptor(state, popup) !== undefined) {
                state[popup] = true;
            }
        },
        /**
         * @param state
         * @param {String} popup - Переменная закрываемого окна
         */
        closePopup(state, popup) {
            if (Object.getOwnPropertyDescriptor(state, popup) !== undefined) {
                state[popup] = false;
            }
        }
    }
};

const ReferenceData = {
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
        StreetZoneCosts: {
            '11-15': 2000,
            '16-23': 3000,
            '24-30': 5000,
        },
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
        ],
        BasicServices: [
            {title: 'Сухая очистка (уборка) контейнера после выгрузки груза', unit: 'контейнер', cost: 2000},
            {title: 'Навешивание/наклеивание сертификационных табличек (КБК, КТК)', unit: 'штука', cost: 200},
            {title: 'Предоставление ЗПУ на контейнер', unit: 'штука', price: 300},
            {title: 'Предоставление ЗПУ на контейнер для перевозки опасных грузов', unit: 'штука', cost: 600},
        ]
    },

    getters: {

        getRepairVariants(state) {
            return state.RepairVariants;
        },

        getTitlesRepairVariants(state) {
            let TitlesRepairVariants = [];

            if (state && Array.isArray(state.RepairVariants)) {
                for (let i = 0; i < state.RepairVariants.length; i++) {
                    TitlesRepairVariants.push(state.RepairVariants[i].title);
                }
            }

            return TitlesRepairVariants;
        },

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

export default new Vuex.Store({
    modules: {
        Popups: PopupsModule,
        WebBid: WebBid,
        Messages: Messages,
        Price: Price,
        ReferenceData: ReferenceData
    },
});