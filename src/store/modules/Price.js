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
        getSelectedPriceElements: function (state, getters, rootState) {

            const SelectedPriceList = {
                Basic: [],
                InlandTransportations: [],
                RepairServices: [],
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

                    let StreetObject = getters.getStreets.find(street => street.title === WebInlandTransportation['street']);

                    if (StreetObject) {
                        let Container = getters['WebGate' + wInlandTransportationPostfix + 'Container'];

                        let Cost = null;
                        if (Container && (Container.Size === 20 || Container.Size === 40)) {
                            if (Container.Empty) {
                                Cost = StreetObject[Container.Size];
                            } else if (Container.Full && Container.WeightGross && Container.WeightGross > 30) {
                                Cost = "Договорная";
                            } else if (Container.Full && Container.WeightGross) {
                                Cost = StreetObject[Container.Size + ((Container.Size === 20 && Container.WeightGross > 24) || (Container.Size === 40 && Container.WeightGross > 30) ? 'h' : '')];
                            }

                            if (Cost) {
                                SelectedPriceList.InlandTransportations.push({
                                    title: 'Автоперевозка',
                                    street: WebInlandTransportation.street,
                                    houseNumber: WebInlandTransportation.houseNumber,
                                    Cost: Cost
                                });
                                // При заказе обратной доставке формируем объект и дя неё
                                if (WebInlandTransportation.ReturnContainer) {
                                    SelectedPriceList.InlandTransportations.push({
                                        title: 'Автоперевозка обратная доставка',
                                        street: 'Бахчиванджи',
                                        houseNumber: 'д2',
                                        Cost: 1500
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
                            SelectedPriceList.RepairServices[i].Cost = 7000;
                        } else if (totalCategories[2]) {
                            SelectedPriceList.RepairServices[i].Cost = 5000;
                        } else if (totalCategories[1]) {
                            SelectedPriceList.RepairServices[i].Cost = 3000;
                        }
                    }
                }
            }

            /**
             *
             * @type {String}
             */
            let totalCost = '0';
            let totalArray = SelectedPriceList.Basic.concat(SelectedPriceList.InlandTransportations, SelectedPriceList.RepairServices);
            if(totalArray.length > 0){
                for(let i = 0; i < totalArray.length; i++){
                    if(totalArray[i].Cost === 'Договорная'){
                        totalCost = 'Договорная';
                        break;
                    }else if(+totalArray[i].Cost > 0 && totalCost !== 'Договорная')
                    {
                        totalCost = String(+totalCost+totalArray[i].Cost);
                    }
                }
            }
            SelectedPriceList.TotalCost = totalCost === 'Договорная' || +totalCost > 0 ? String(totalCost) : '';

            return SelectedPriceList;
        }
    }
};