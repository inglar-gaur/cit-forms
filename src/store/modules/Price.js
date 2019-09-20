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
        SelectedPriceServices: [],      // Выбранные услуги из прайсов
        SelectedPrices: [],             // Прайсы, услуги которых можно выбрать
        SelectedPricesNumbers: {}       // Количества услуг по артикулу
    },

    mutations: {
        setSelectedPriceServices: function (state, selectedPriceServiceIndexes) {
            if (Array.isArray(selectedPriceServiceIndexes)) {
                state.SelectedPriceServices = selectedPriceServiceIndexes;
            }
        },

        setSelectedPrices: (state, selectedPrices) => {
            if(state && Array.isArray(selectedPrices)){
                state.SelectedPrices = selectedPrices;
            }
        },

        /**
         * Установка количественной характеристики услуги
         * @param state
         * @param {Object} payLoad
         * @param {String} payLoad.ServiceArt      - Артикул услуги
         * @param {Number} payLoad.ServiceNumber   - Количество
         */
        setServiceNumber(state, payLoad){
            if(payLoad.ServiceArt && +payLoad.ServiceNumber > 0){
                state.SelectedPricesNumbers[payLoad.ServiceArt] = +payLoad.ServiceNumber;
                let Old = state.SelectedPricesNumbers;
                state.SelectedPricesNumbers = {};
                state.SelectedPricesNumbers = Old;
            }
        },

        delServiceNumber(state, ServiceArt){
            if(state.SelectedPricesNumbers.hasOwnProperty(ServiceArt)){
                delete state.SelectedPricesNumbers[ServiceArt];
            }
        },

        clearForm(state){
            state.SelectedPriceServices = [];
            state.SelectedPrices = [];
            state.SelectedPricesNumbers = {};
        }
    },

    getters: {
        getSelectedServices: function (state, getters, rootState) {

            const SelectedPriceList = {
                Basic: [],
                InlandTransportations: [],
                InlandReturnTransportations: [],
                RepairServices: [],
                Staffing: [],
                DefectCheck:[],
                PriceServices: [],
                TotalCost: '',
                TotalWeight: 0,
                TotalRepairCategory: null,
            };

            // SelectedPriceList.Basic = state.SelectedPriceServices.map(SelectedBasicService => getters.getBasicServices[SelectedBasicService]).filter(elem => elem);

            if(getters.isWebGateIn){
                SelectedPriceList.Basic.push(getters.getBasicServices['10.5']);

                if(rootState.WebBid.wCustomsRelease.includes('To')){
                    SelectedPriceList.Basic.push(getters.getBasicServices['10.30']);
                }
            }
            if(getters.isWebGateOut){
                SelectedPriceList.Basic.push(getters.getBasicServices['10.6']);

                if(rootState.WebBid.wCustomsRelease.includes('From')){
                    SelectedPriceList.Basic.push(getters.getBasicServices['10.31']);
                }
            }

            // Список выбранных услуг автоперевозки
            ['In', 'Out'].forEach(wInlandTransportationPostfix => {
                /**
                 * Объект автоперевозки входящей или исходящей заявки
                 * @type {WebInlandTransportation|null}
                 */
                let WebInlandTransportation = getters.getWebBidOperation('wInlandTransportation' + wInlandTransportationPostfix);

                /**
                 * Объект с контейнером заявки
                 * @type {CachedContainerParams|null}
                 */
                let Container = getters['WebGate' + wInlandTransportationPostfix + 'Container'];

                // Если есть объект, улица и дом, выбираем цену и формируем объект для таблицы
                if (WebInlandTransportation && WebInlandTransportation.street && WebInlandTransportation.houseNumber) {

                    let StreetObject;
                    for(let StreetArt in getters.getStreets){
                        if(getters.getStreets.hasOwnProperty(StreetArt) && getters.getStreets[StreetArt].Title === WebInlandTransportation.street){
                            StreetObject = getters.getStreets[StreetArt];
                        }
                    }

                    if (StreetObject) {
                        /**
                         * Цена перевозки и вес контейнера
                         * @type {string}
                         */
                        let Cost = '',
                            WeightText = '';

                        if (Container && (Container.Size === 20 || Container.Size === 40)) {
                            // Если контейнер пуст
                            if (Container.Empty) {
                                Cost = StreetObject['_'+Container.Size];
                                WeightText = 'до 24 тн';
                            // Если контейнер груженый и сверхтяжелый
                            } else if (Container.Full && Container.WeightGross && Container.WeightGross > 30) {
                                Cost = "Рассчетная";
                                WeightText = 'свыше 30 тн';
                            // Если контейнер просто груженый
                            } else if (Container.Full && Container.WeightGross) {
                                if(Container.WeightGross >= 24){
                                    Cost = StreetObject['_'+Container.Size+'h'];
                                    WeightText = 'от 24 до 30 тн';
                                }else{
                                    Cost = StreetObject['_'+Container.Size];
                                    WeightText = 'до 24 тн';
                                }
                            }

                            if (Cost) {
                                SelectedPriceList.InlandTransportations.push({
                                    Address: WebInlandTransportation.street + (WebInlandTransportation.houseNumber ? WebInlandTransportation.houseNumber : ''),
                                    Art: StreetObject.Art,
                                    Size: Container.Size + ' фут',
                                    Weight: WeightText,
                                    Unit: 'контейнер',
                                    Cost: Cost === "Рассчетная" ? Cost : Cost + ',00'
                                });
                            }
                        }
                    }
                }

                // При заказе обратной доставке формируем объект и для неё
                if (WebInlandTransportation && WebInlandTransportation.ReturnContainer) {
                    SelectedPriceList.InlandReturnTransportations.push({
                        Title: 'Обратная доставка'+(Container && Container.Full ? ' порожнего' : '')+(Container && Container.Empty ? ' груженого' : '')+' контейнера',
                        Address: 'Бахчиванджи, д2',
                        Cost: 1500,
                        Unit: 'контейнер',
                        Art: '18.1'
                    });

                    if(getters.isWebGateIn){
                        SelectedPriceList.Basic.push(getters.getBasicServices['10.6']);
                    }else if(getters.isWebGateOut){
                        SelectedPriceList.Basic.push(getters.getBasicServices['10.5']);
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
                        SelectedPriceList.RepairServices[i].Cost = 'Рассчетная';
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
                            SelectedPriceList.RepairServices[i].Cost = 'Рассчетная';
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

            if(rootState.WebBid.DefectCheck){
                SelectedPriceList.DefectCheck.push(getters.getBasicServices['10.78']);
            }

            let Staffing;
            if(rootState.WebBid.wStaffingStripping && rootState.WebBid.wStaffingStripping.Cargo && Array.isArray(rootState.WebBid.wStaffingStripping.Cargo.Elements)){
                Staffing = rootState.WebBid.wStaffingStripping.Cargo.Elements;
            }

            if(Staffing && Staffing.length > 0){



                Staffing.forEach(CargoElement => {

                    let PackageTypeIndex;
                    let ServiceTitle;
                    let UnitWeight;
                    let Volume;
                    let Service;
                    let PackagingService;
                    let GoodsTypeIndex;
                    let Packaging = -1;
                    let Repackaging;

                    UnitWeight = CargoElement.UnitWeight * CargoElement.UnitCount;
                    Volume = (CargoElement.UnitLength * CargoElement.UnitWidth * CargoElement.UnitHeight / 1e+9) * CargoElement.UnitCount;

                    SelectedPriceList.TotalWeight += UnitWeight;

                    PackageTypeIndex = rootState.ReferenceData.PackTypes.findIndex(Type => Type.Title === CargoElement.PackageType);

                    // Для штучного товара
                    if(PackageTypeIndex === 0){
                        // Если место больше 50 кг - неделимый
                        // if(CargoElement.UnitWeight > 50){
                        //     GoodsTypeIndex = 4;
                        // // Иначе соответственно упаковке
                        // }else if(-1 < PackageTypeIndex < 5){
                            let packRequirementIndex = rootState.ReferenceData.packRequirements[0].findIndex(Requirement => Requirement === CargoElement.PackageRequirement);
                            // if(-1 < packRequirementIndex < 3){
                            //     GoodsTypeIndex = packRequirementIndex;
                            //
                            // }else if(2 < packRequirementIndex < 6){
                            //     GoodsTypeIndex = 3;
                            // }

                            switch (packRequirementIndex) {
                                case 0:
                                    GoodsTypeIndex = 0;
                                    break;
                                case 1:
                                    GoodsTypeIndex = 1;
                                    Packaging = 0;
                                    break;
                                case 2:
                                    GoodsTypeIndex = 2;
                                    Packaging = 1;
                                    break;
                                case 3:
                                case 4:
                                case 5:
                                    GoodsTypeIndex = 3;
                                    Packaging = 2;
                                    break;
                            }

                            if(CargoElement.UnitWeight > 50){
                                GoodsTypeIndex = 4;
                            }
                        // }
                    // Для ПАЛЛЕТИРОВАННЫЙ, УВЯЗАННЫЙ, УПАКОВАННЫЙ
                    }else if(0 < PackageTypeIndex && PackageTypeIndex < 4){
                        GoodsTypeIndex = PackageTypeIndex;
                        let packRequirementIndex = rootState.ReferenceData.packRequirements[1].findIndex(Requirement => Requirement === CargoElement.PackageRequirement);
                        switch (packRequirementIndex) {
                            case 0:
                            case 1:
                            case 2:
                                Packaging = 3;
                                break;
                            case 3:
                                Packaging = 0;
                                break;
                            case 4:
                                Packaging = 1;
                                break;
                        }
                    }else if(PackageTypeIndex === 4){
                        GoodsTypeIndex = PackageTypeIndex;

                        let packRequirementIndex = rootState.ReferenceData.packRequirements[2].findIndex(Requirement => Requirement === CargoElement.PackageRequirement);

                        switch (packRequirementIndex) {
                            case 0:
                                Packaging = 0;
                                break;
                            case 1:
                                Packaging = 2;
                                break;
                        }
                    }

                    console.log(Packaging);
                    if(Packaging === 1){
                        Packaging = UnitWeight > 1500 ? Packaging : -1;
                    }


                    if(Array.isArray(rootState.ReferenceData.Staffing[GoodsTypeIndex]) && UnitWeight > 0 && Volume > 0){

                        ServiceTitle = '';
                        if(CargoElement.UnitLength > 2000 || CargoElement.UnitWidth > 2000 || CargoElement.UnitHeight > 2000){
                            ServiceTitle += 'Габаритный';
                        }else{
                            ServiceTitle += 'Генеральный';
                        }

                        // Штучный навалом не зависит от веса
                        if(GoodsTypeIndex > 0 || CargoElement.PackageRequirement > 0){
                            if((Volume / (UnitWeight / 1000)) > 2){
                                ServiceTitle += ' легковесный';
                            }else if(UnitWeight >= 10000){
                                ServiceTitle += ' сверхтяжелый';
                            }else if(UnitWeight >= 5000){
                                ServiceTitle += ' тяжелый';
                            }else if(UnitWeight >= 1500){
                                ServiceTitle += ' утяжеленный';
                            }
                        }


                        ServiceTitle += ' груз';

                        // Неделимый генеральный груз зависит от веса
                        if(GoodsTypeIndex === 4 && ServiceTitle === 'Генеральный груз'){
                            if(CargoElement.UnitWeight > 1000){
                                Service = rootState.ReferenceData.Staffing[GoodsTypeIndex][0];
                            }else if(CargoElement.UnitWeight > 500){
                                Service = rootState.ReferenceData.Staffing[GoodsTypeIndex][1];
                            }else if(CargoElement.UnitWeight > 100){
                                Service = rootState.ReferenceData.Staffing[GoodsTypeIndex][2];
                            }else{
                                Service = rootState.ReferenceData.Staffing[GoodsTypeIndex][3];
                            }
                        }else{
                            Service = rootState.ReferenceData.Staffing[GoodsTypeIndex].find(S => S.Title === ServiceTitle);
                        }


                        let TotalCost;

                        if(Service){

                            if(UnitWeight > 0 && Service.Cost > 0){
                                TotalCost = String(UnitWeight / 1000 * Service.Cost);
                                if(TotalCost.indexOf('.') === -1){
                                    TotalCost += '.00';
                                }
                            }else if(Service.Cost === '0' || Service.Cost === 'Рассчетная'){
                                TotalCost = 'Рассчетная';
                            }else{
                                TotalCost = '';
                            }

                            let StaffingService = {
                                Title: Service.Title,
                                PackageType: CargoElement.PackageType,
                                PackageRequirement: CargoElement.PackageRequirement,
                                Number: UnitWeight > 0 ? (UnitWeight/1000) : 0,
                                UnitCost: Service.Cost+'.00',
                                Cost: TotalCost,
                                Unit: Service.Unit,
                                Art: Service.Art
                            };
                            SelectedPriceList.Staffing.push(StaffingService);
                        }

                        console.log(Packaging);

                        // Упаковка и переупаковка (в т.ч. паллетирование и увязка)
                        if(~Packaging && rootState.ReferenceData.Staffing[5][Packaging]){
                            PackagingService = rootState.ReferenceData.Staffing[5][Packaging];
                            if(UnitWeight > 0 && PackagingService.Cost > 0){
                                TotalCost = String(UnitWeight / 1000 * PackagingService.Cost);
                                if(TotalCost.indexOf('.') === -1){
                                    TotalCost += '.00';
                                }
                            }else if(PackagingService.Cost === '0' || PackagingService.Cost === 'Рассчетная'){
                                TotalCost = 'Рассчетная';
                            }else{
                                TotalCost = '';
                            }
                            SelectedPriceList.Staffing.push({
                                PackageType: PackagingService.Title,
                                Number: UnitWeight > 0 ? (UnitWeight/1000) : 0,
                                UnitCost: PackagingService.Cost > 0 ? PackagingService.Cost+'.00' : 'Рассчетная',
                                Cost: TotalCost,
                                Unit: PackagingService.Unit,
                                Art: PackagingService.Art
                            });
                        }

                        if(Packaging === 0 && Volume > 0){
                            PackagingService = rootState.ReferenceData.Staffing[5][6];
                            SelectedPriceList.Staffing.push({
                                PackageType: PackagingService.Title,
                                Number: Math.ceil(Volume),
                                UnitCost: PackagingService.Cost+'.00',
                                Cost: (PackagingService.Cost * Math.ceil(Volume))+'.00',
                                Unit: PackagingService.Unit,
                                Art: PackagingService.Art
                            });
                        }
                        if((Packaging === 2 || Packaging === 3) && (Volume > 0 || UnitWeight > 0)){
                            let boxNumber = Math.ceil(Volume) > Math.ceil(UnitWeight / 1500) ? Math.ceil(Volume) : Math.ceil(UnitWeight / 1500);
                            SelectedPriceList.Staffing.push({
                                PackageType: 'Упаковка',
                                Number: boxNumber,
                                UnitCost: '*(Стоимость услуги расчетная)',
                                Cost: '*(Стоимость услуги расчетная)',
                                Unit: 'штука',
                                Art: ''
                            });
                        }
                    }

                });
            }

            if(state.SelectedPriceServices.length > 0){

                for(let ServiceArt in getters.getPriceServices.Services){
                    if(
                        getters.getPriceServices.Services.hasOwnProperty(ServiceArt) &&
                        state.SelectedPriceServices.includes(ServiceArt) &&
                        ~getters.getPriceServices.Services[ServiceArt].Category
                    ){
                        let Service = {
                            Title: getters.getPriceServices.Services[ServiceArt].Title,
                            Unit: getters.getPriceServices.Services[ServiceArt].Unit,
                            Art: ServiceArt,
                            Cost: (getters.getPriceServices.Services[ServiceArt].Cost * state.SelectedPricesNumbers[ServiceArt])+'.00',
                            Category: getters.getPriceServices.Services[ServiceArt].Category,
                            Type: getters.getPriceServices.Categories[getters.getPriceServices.Services[ServiceArt].Category].Type,
                            Number: state.SelectedPricesNumbers[ServiceArt],
                            CostForUnit: getters.getPriceServices.Services[ServiceArt].Cost
                        };
                        SelectedPriceList.PriceServices.push(Service);
                    }

                    SelectedPriceList.PriceServices.filter(Service => Service.Title && Service.Art && ~Service.Category && ~Service.Type)
                        .sort((PredService, NextService) => PredService.Type > NextService.Type && PredService.Category > NextService.Category ? 1 : -1);

                    let lastType, lastCategory;

                    SelectedPriceList.PriceServices.forEach((Service, Index) => {
                        if(Service.Type !== lastType){
                            SelectedPriceList.PriceServices[Index].TypeTitle = getters.getPriceServices.Types[Service.Type];
                            lastType = Service.Type;
                        }
                        if(Service.Category !== lastCategory){
                            SelectedPriceList.PriceServices[Index].CategoryTitle = getters.getPriceServices.Categories[Service.Category].Title;
                            lastCategory = Service.Category;
                        }
                    });
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
            let totalArray = SelectedPriceList.Basic.concat(
                SelectedPriceList.InlandTransportations,
                SelectedPriceList.RepairServices,
                SelectedPriceList.PriceServices,
                SelectedPriceList.DefectCheck,
                SelectedPriceList.Staffing
                );
            if(totalArray.length > 0){
                for(let i = 0; i < totalArray.length; i++){
                    if(totalArray[i].Cost === 'Рассчетная'){
                        SelectedPriceList.TotalCost = 'Рассчетная';
                        break;
                    }else if(totalArray[i].Cost && +totalArray[i].Cost.slice(0, -3) > 0)
                    {
                        totalCost += +totalArray[i].Cost.slice(0, -3);
                        if(i >= totalArray.length - 1 && totalCost > 0){
                            SelectedPriceList.TotalCost = totalCost+'.00';
                        }
                    }
                }
            }

            return SelectedPriceList;
        },
    }
};