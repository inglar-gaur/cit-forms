/**
 * Кэшированные данные о первом в списке контейнере входящей и исходящей заявок
 * @typedef CachedContainerParams
 * @property {Number}   Size
 * @property {Boolean}  Empty
 * @property {Boolean}  Full
 * @property {String}   WaitingTime
 * @property {Number}   WeightGross
 *
 */

function getTextRepairCategory(category){
    switch(category){
        case 1:
            return 'I';
        case 2:
            return 'II';
        case 3:
            return 'III';
        case 4:
            return 'IV';
        default:
            return '';
    }
}

export default {
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
        getSelectedServices: function (state, getters, rootState) {

            const SelectedPriceList = {
                Basic: [],
                InlandTransportations: [],
                InlandReturnTransportations: [],
                RepairServices: [],
                PriceServices: [],
                TotalCost: '',
                TotalRepairCategory: null,
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

                    let StreetObject = getters.getStreets.find(street => street.Title === WebInlandTransportation['street']);

                    if (StreetObject) {

                        /**
                         * Объект с контейнером заявки
                         * @type {CachedContainerParams|null}
                         */
                        let Container = getters['WebGate' + wInlandTransportationPostfix + 'Container'];
                        /**
                         * Цена перевозки и вес контейнера
                         * @type {string}
                         */
                        let Cost = '',
                            WeightText = '';

                        if (Container && (Container.Size === 20 || Container.Size === 40)) {
                            // Если контейнер пуст
                            if (Container.Empty) {
                                Cost = StreetObject[Container.Size];
                                WeightText = 'до 24 тн';
                            // Если контейнер груженый и сверхтяжелый
                            } else if (Container.Full && Container.WeightGross && Container.WeightGross > 30) {
                                Cost = "Договорная";
                                WeightText = 'свыше 30 тн';
                            // Если контейнер просто груженый
                            } else if (Container.Full && Container.WeightGross) {
                                if(Container.WeightGross >= 24){
                                    Cost = StreetObject[Container.Size+'h'];
                                    WeightText = 'от 24 до 30 тн';
                                }else{
                                    Cost = StreetObject[Container.Size];
                                    WeightText = 'до 24 тн';
                                }
                            }

                            if (Cost) {
                                SelectedPriceList.InlandTransportations.push({
                                    Address: WebInlandTransportation.street + (WebInlandTransportation.houseNumber ? WebInlandTransportation.houseNumber : ''),
                                    Art: StreetObject.Art,
                                    Size: Container.Size + ' фут',
                                    Weight: WeightText,
                                    Unit: getters.getUnitTitle(0),
                                    Cost: Cost === "Договорная" ? Cost : Cost + ',00'
                                });
                                // При заказе обратной доставке формируем объект и для неё
                                if (WebInlandTransportation.ReturnContainer) {
                                    SelectedPriceList.InlandReturnTransportations.push({
                                        Title: 'Обратная доставка'+(Container.Full ? ' порожнего' : '')+(Container.Empty ? ' груженого' : '')+' контейнера',
                                        Address: 'Бахчиванджи, д2',
                                        Cost: 1500,
                                        Unit: getters.getUnitTitle(0),
                                        Art: '18.1'
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

                    let Obj = {};
                    if(
                        ~repairService.ServiceIndex

                    ){
                        Obj.Title =
                            getters.getRepairServices[repairService.ServiceIndex] &&
                            getters.getRepairServices[repairService.ServiceIndex].Title
                            ? getters.getRepairServices[repairService.ServiceIndex].Title : '';

                        Obj.Characteristic =
                            repairService.Characteristic &&
                            getters.getRepairServices[repairService.ServiceIndex] &&
                            getters.getRepairServices[repairService.ServiceIndex].Characteristics &&
                            getters.getRepairServices[repairService.ServiceIndex].Characteristics[repairService.Characteristic]
                                ? getters.getRepairServices[repairService.ServiceIndex].Characteristics[repairService.Characteristic].Title : '';

                        // console.log(Obj);
                        if(Obj.Title && Obj.Characteristic){
                            Obj.RepairCategory = repairService.RepairCategory;
                            Obj.Art = repairService.Characteristic;
                        }
                    }
                    return Obj;

                })
                // Фильтруем (проверка на наличие и названия и характеристики услуги)
                //     .filter(RepairService => RepairService && RepairService.Title && RepairService.Characteristic)
                    // Сортируем по возрастанию категории (для подсчета итоговой категории)
                    .sort((predRepairService, nextRepairService) => nextRepairService.RepairCategory < predRepairService.RepairCategory ? 1 : -1);


                let totalCategories = {1: 0, 2: 0, 3: 0, 4: 0};
                for (let i = 0; i < SelectedPriceList.RepairServices.length; i++) {
                    if (0 < +SelectedPriceList.RepairServices[i].RepairCategory < 5) {
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

                    if(totalCategories[4]){
                        SelectedPriceList.RepairServices[i].Cost = 'Договорная';
                        SelectedPriceList.RepairServices[i].TotalRepairCategory = 4;
                        SelectedPriceList.TotalRepairCategory = 4;
                        break;
                    }else{
                        if (totalCategories[3]) {
                            SelectedPriceList.RepairServices[i].TotalRepairCategory = 3;
                        } else if (totalCategories[2]) {
                            SelectedPriceList.RepairServices[i].TotalRepairCategory = 2;
                        }
                    }

                    if(SelectedPriceList.RepairServices[i].TotalRepairCategory){
                        SelectedPriceList.TotalRepairCategory = SelectedPriceList.RepairServices[i].TotalRepairCategory;
                    }

                    if (i >= SelectedPriceList.RepairServices.length - 1) {
                        if (totalCategories[4]) {
                            SelectedPriceList.RepairServices[i].Cost = 'Договорная';
                            break;
                        } else if (totalCategories[3]) {
                            SelectedPriceList.RepairServices[i].Cost = '7000,00';
                        } else if (totalCategories[2]) {
                            SelectedPriceList.RepairServices[i].Cost = '5000,00';
                        } else if (totalCategories[1]) {
                            SelectedPriceList.RepairServices[i].Cost = '3000,00';
                        }
                    }

                    SelectedPriceList.RepairServices[i].RepairCategory = getTextRepairCategory(SelectedPriceList.RepairServices[i].RepairCategory);
                    SelectedPriceList.RepairServices[i].TotalRepairCategory = getTextRepairCategory(SelectedPriceList.RepairServices[i].TotalRepairCategory);
                }
            }

            /**
             * Переменные для вычисления общей стоимости
             *
             * Промежуточная переменная итоговой стоимости
             * @type {Number}
             */
            let totalCost = 0;
            /**
             * Итоговый массив выбранных услуг
             * @type {Array}
             */
            let totalArray = SelectedPriceList.Basic.concat(SelectedPriceList.InlandTransportations, SelectedPriceList.RepairServices);
            if(totalArray.length > 0){
                for(let i = 0; i < totalArray.length; i++){
                    if(totalArray[i].Cost === 'Договорная'){
                        SelectedPriceList.TotalCost = 'Договорная';
                        break;
                    }else if(totalArray[i].Cost && +totalArray[i].Cost.slice(0, -3) > 0)
                    {
                        totalCost += +totalArray[i].Cost.slice(0, -3);
                        if(i >= totalArray.length - 1 && totalCost > 0){
                            SelectedPriceList.TotalCost = totalCost+',00';
                        }
                    }
                }
            }

            return SelectedPriceList;
        },
    }
};