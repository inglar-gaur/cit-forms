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

        /**
         * Удаление выбранных услуг при сбросе формы
         */
        clearForm(state){
            state.SelectedPriceServices = [];
            state.SelectedPrices = [];
            state.SelectedPricesNumbers = {};
        }
    },

    getters: {

        /**
         * @typedef SelectedPriceObject - Объект с выбранной услугой
         * @property {string} Title
         * @property {string} Address
         * @property {string} Art
         * @property {string} Size
         * @property {string} Unit
         * @property {string} Cost
         * @property {number} WeightText
         */

        /**
         * Список выбранных базовых услуг
         * @param state     - Состояние настоящего модуля
         * @param getters   - Геттеры
         * @param rootState - Состояние хранилища
         *
         * @return Array.<SelectedPriceObject>
         */
        SelectedBasicServices: (state, getters, rootState) => {

            let SelectedPriceList = [];

            /**
             * Добавление базовых услуг 10.5 - приём, 10.6 - выдача контейнера
             * Добавление услуг СВХ при необходимости (10.30, 10.31)
             * Добавление услуг приёма/выдачи при обратной автоперевозке (10.30, 10.31), сама заявка при этом не создаётся
             */
            if(getters.isWebGateIn){
                SelectedPriceList.push(getters.getBasicServices['10.5']);

                if(rootState.WebBid.wCustomsRelease.includes('To')){
                    SelectedPriceList.push(getters.getBasicServices['10.30']);
                }

                if(rootState.WebBid.wInlandTransportationIn && rootState.WebBid.wInlandTransportationIn.ReturnContainer){
                    SelectedPriceList.push(getters.getBasicServices['10.6']);
                }
            }
            if(getters.isWebGateOut){
                SelectedPriceList.push(getters.getBasicServices['10.6']);

                if(rootState.WebBid.wCustomsRelease.includes('From')){
                    SelectedPriceList.push(getters.getBasicServices['10.31']);
                }

                if(rootState.WebBid.wInlandTransportationOut && rootState.WebBid.wInlandTransportationOut.ReturnContainer){
                    SelectedPriceList.push(getters.getBasicServices['10.5']);
                }
            }

            return SelectedPriceList;
        },

        /**
         * Список выбранных услуг автоперевозки
         * @param state     - Состояние настоящего модуля
         * @param getters   - Геттеры
         *
         * @return Array.<SelectedPriceObject>
         */
        SelectedInlandTransportationServices: (state, getters) => {

            let SelectedPriceList = [];

            /**
             * Перебор постфиксов для обработки заявок автоперевозки
             */
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

                    /**
                     * Получаем объект улицы по названию из заявки
                     */
                    let StreetObject;
                    for(let StreetArt in getters.getStreets){
                        if(getters.getStreets.hasOwnProperty(StreetArt) && getters.getStreets[StreetArt].Title === WebInlandTransportation.street){
                            StreetObject = getters.getStreets[StreetArt];
                        }
                    }

                    if (StreetObject) {
                        /**
                         * Стоимость перевозки и вес контейнера
                         * @type {string}
                         */
                        let Cost = '',
                            WeightText = '';

                        /**
                         * Если контейнер есть и имеет нужную футовость
                         * по весу берём цену из объекта улицы
                         */
                        if (Container && (Container.Size === 20 || Container.Size === 40)) {
                            // Если контейнер пуст
                            if (Container.Empty) {
                                Cost = StreetObject['_'+Container.Size];
                                WeightText = 'до 24 тн';
                                // Если контейнер груженый и сверхтяжелый
                            } else if (Container.Full && Container.WeightGross && Container.WeightGross > 30) {
                                Cost = "Расчетная";
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
                                SelectedPriceList.push({
                                    Address: WebInlandTransportation.street + (WebInlandTransportation.houseNumber ? WebInlandTransportation.houseNumber : ''),
                                    Art: StreetObject.Art,
                                    Size: Container.Size + ' фут',
                                    Weight: WeightText,
                                    Unit: 'контейнер',
                                    Cost: Cost === "Расчетная" ? Cost : Cost + '.00'
                                });
                            }
                        }
                    }
                }
            });

            return SelectedPriceList;
        },

        /**
         * Список выбранных услуг ремонта
         * @param state     - Состояние настоящего модуля
         * @param getters   - Геттеры
         *
         * @return Array.<SelectedPriceObject>
         */
        SelectedRepairServices: (state, getters) => {

            /**
             * получаем объект с данными по ремонту
             * @type {WebRepairContainer|null}
             */
            let RepairObject = getters.getWebBidOperation('wRepairContainer');

            // Проверяем наличие и заполненность массива с услугами ремонта
            if (RepairObject && Array.isArray(RepairObject.list) && RepairObject.list.length > 0) {

                // Формируем итоговый массив из таблицы в форме
                let RepairPriceList = RepairObject.list
                    // Фильтруем только по тем, где выбраны и услуга ремонта и характеристика
                    .filter(RepairService => ~RepairService.ServiceIndex && RepairService.Characteristic)
                    // Формируем массив объектов для таблицы выбранных услуг
                    .map(RepairService => {

                        /**
                         * Объекты услуги ремонта и характеристики ремонта из модуля ReferenceData
                         * @type {Object|null}
                         */
                        let Service = getters.getRepairServices[RepairService.ServiceIndex] ? getters.getRepairServices[RepairService.ServiceIndex] : {};
                        let Characteristic =
                                Service.Characteristics &&
                                Service.Characteristics[RepairService.Characteristic] ?
                                Service.Characteristics[RepairService.Characteristic] : {};

                        return {
                            Title: Service.Title ? Service.Title : '',
                            Characteristic: Characteristic.Title ? Characteristic.Title : '',
                            RepairCategory: Characteristic.Category ? Characteristic.Category : '',
                            Art: RepairService.Characteristic ? RepairService.Characteristic : '',
                        };
                    })
                    // Сортируем по возрастанию категории (для подсчета итоговой категории)
                    .sort((predRepairService, nextRepairService) => nextRepairService.RepairCategory < predRepairService.RepairCategory ? 1 : -1);

                if(RepairPriceList.length > 0){
                    let totalCategories = {1: 0, 2: 0, 3: 0, 4: 0};
                    for (let i = 0; i < RepairPriceList.length; i++) {
                        if (0 < +RepairPriceList[i].RepairCategory < 5) {
                            ++totalCategories[+RepairPriceList[i].RepairCategory];
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
                            RepairPriceList[i].Cost = 'Расчетная';
                            RepairPriceList[i].TotalRepairCategory = 4;
                            // SelectedPriceList.TotalRepairCategory = 4;
                            break;
                        }else{
                            if (totalCategories[3]) {
                                RepairPriceList[i].TotalRepairCategory = 3;
                            } else if (totalCategories[2]) {
                                RepairPriceList[i].TotalRepairCategory = 2;
                            }
                        }

                        // if(SelectedPriceList[i].TotalRepairCategory){
                        //     SelectedPriceList.TotalRepairCategory = SelectedPriceList[i].TotalRepairCategory;
                        // }

                        if (i >= RepairPriceList.length - 1) {
                            if (totalCategories[4]) {
                                RepairPriceList[i].Cost = 'Расчетная';
                                break;
                            } else if (totalCategories[3]) {
                                RepairPriceList[i].Cost = '7000.00';
                            } else if (totalCategories[2]) {
                                RepairPriceList[i].Cost = '5000.00';
                            } else if (totalCategories[1]) {
                                RepairPriceList[i].Cost = '3000.00';
                            }
                        }
                    }

                    return RepairPriceList;
                }
            }

            return [];
        },

        /**
         * Итоговая категория ремонта
         * @param state     - Состояние настоящего модуля
         * @param getters   - Геттеры
         * @returns {number}
         */
        TotalRepairCategory: (state, getters) =>
            getters.SelectedRepairServices.length > 0 ?
                getters.SelectedRepairServices[getters.SelectedRepairServices.length-1].TotalRepairCategory : 0,

        /**
         * Список выбранных погрузочно-разгрузочных работ
         * @param state     - Состояние настоящего модуля
         * @param getters   - Геттеры
         * @param rootState - Состояние хранилища
         *
         * @return Array.<SelectedPriceObject>
         */
        SelectedStaffingServices: (state, getters, rootState) => {

            let SelectedStaffingServices = [];
            let Staffing;

            // Пробуем получить объект погрузочно-разгрузочных работ
            if(rootState.WebBid.wStaffingStripping && rootState.WebBid.wStaffingStripping.Cargo && Array.isArray(rootState.WebBid.wStaffingStripping.Cargo.Elements)){
                Staffing = rootState.WebBid.wStaffingStripping.Cargo.Elements;
            }

            if(Staffing && Staffing.length > 0){

                Staffing.forEach(CargoElement => {

                    /**
                     * Индекс типа груза
                     */
                    let CargoTypeIndex;
                    let ServiceTitle;
                    let RowWeight;
                    let Volume;
                    let Service;
                    let PackagingService;
                    let GoodsTypeIndex;
                    let Packaging = -1;
                    let Repackaging;

                    RowWeight = CargoElement.UnitWeight * CargoElement.UnitCount;
                    Volume = (CargoElement.UnitLength * CargoElement.UnitWidth * CargoElement.UnitHeight / 1e+9) * CargoElement.UnitCount;

                    CargoTypeIndex = rootState.ReferenceData.PackTypes.findIndex(Type => Type.Title === CargoElement.PackageType);

                    // Для штучного товара
                    if(CargoTypeIndex === 0){

                        let packRequirementIndex = rootState.ReferenceData.packRequirements[0].findIndex(Requirement => Requirement === CargoElement.PackageRequirement);

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

                        if(CargoElement.UnitWeight > 50 && packRequirementIndex !== 0){
                            GoodsTypeIndex = 4;
                        }

                        // Для ПАЛЛЕТИРОВАННЫЙ, УВЯЗАННЫЙ, УПАКОВАННЫЙ
                    }else if(0 < CargoTypeIndex && CargoTypeIndex < 4){
                        GoodsTypeIndex = CargoTypeIndex;
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
                    }else if(CargoTypeIndex === 4){
                        GoodsTypeIndex = CargoTypeIndex;

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

                    if(Packaging === 1){
                        Packaging = RowWeight > 1500 ? Packaging : -1;
                    }


                    if(Array.isArray(rootState.ReferenceData.Staffing[GoodsTypeIndex]) && CargoElement.UnitWeight > 0 && Volume > 0){

                        ServiceTitle = '';
                        if(CargoElement.UnitLength > 2000 || CargoElement.UnitWidth > 2000 || CargoElement.UnitHeight > 2000){
                            ServiceTitle += 'Габаритный';
                        }else{
                            ServiceTitle += 'Генеральный';
                        }

                        // Штучный навалом не зависит от веса
                        if(GoodsTypeIndex > 0 || CargoElement.PackageRequirement > 0){
                            if(((CargoElement.UnitLength * CargoElement.UnitWidth * CargoElement.UnitHeight / 1e+9) / (CargoElement.UnitWeight / 1000)) > 2){
                                ServiceTitle += ' легковесный';
                            }else if(CargoElement.UnitWeight >= 10000){
                                ServiceTitle += ' сверхтяжелый';
                            }else if(CargoElement.UnitWeight >= 5000){
                                ServiceTitle += ' тяжелый';
                            }else if(CargoElement.UnitWeight >= 1500){
                                ServiceTitle += ' утяжеленный';
                            }
                        }


                        ServiceTitle += ' груз';

                        // Неделимый генеральный груз зависит от веса
                        if(GoodsTypeIndex === 4 && ServiceTitle === 'Генеральный груз'){
                            if(CargoElement.UnitWeight > 1000){
                                Service = rootState.ReferenceData.Staffing[GoodsTypeIndex][3];
                            }else if(CargoElement.UnitWeight > 500){
                                Service = rootState.ReferenceData.Staffing[GoodsTypeIndex][2];
                            }else if(CargoElement.UnitWeight > 100){
                                Service = rootState.ReferenceData.Staffing[GoodsTypeIndex][1];
                            }else{
                                Service = rootState.ReferenceData.Staffing[GoodsTypeIndex][0];
                            }
                        }else{
                            Service = rootState.ReferenceData.Staffing[GoodsTypeIndex].find(S => S.Title === ServiceTitle);
                        }


                        let TotalCost;

                        if(Service){

                            // Если товар не штучный, то каждому месту отдельная строка
                            if(0 < CargoTypeIndex && CargoTypeIndex < 5){
                                for(let i = 0; i < CargoElement.UnitCount; i++){

                                    // Вычисление стоимости (может быть дробной), перевод в строку и добавление нулей при необходимости
                                    if(CargoElement.UnitWeight > 0 && Service.Cost > 0){
                                        TotalCost = String(CargoElement.UnitWeight / 1000 * Service.Cost);
                                        if(TotalCost.indexOf('.') === -1){
                                            TotalCost += '.00';
                                        }
                                    }else if(Service.Cost === '0' || Service.Cost === 'Расчетная'){
                                        TotalCost = 'Расчетная';
                                    }else{
                                        TotalCost = '';
                                    }

                                    let StaffingService = {
                                        Title: Service.Title,
                                        PackageType: CargoElement.PackageType,
                                        PackageRequirement: CargoElement.PackageRequirement,
                                        Number: CargoElement.UnitWeight > 0 ? (CargoElement.UnitWeight/1000) : 0,
                                        UnitCost: Service.Cost+'.00',
                                        Cost: TotalCost,
                                        Unit: Service.Unit,
                                        Art: Service.Art
                                    };
                                    SelectedStaffingServices.push(StaffingService);
                                }
                            }else{

                                // Вычисление стоимости (может быть дробной), перевод в строку и добавление нулей при необходимости
                                if(RowWeight > 0 && Service.Cost > 0){
                                    TotalCost = String(RowWeight / 1000 * Service.Cost);
                                    if(TotalCost.indexOf('.') === -1){
                                        TotalCost += '.00';
                                    }
                                }else if(Service.Cost === '0' || Service.Cost === 'Расчетная'){
                                    TotalCost = 'Расчетная';
                                }else{
                                    TotalCost = '';
                                }

                                let StaffingService = {
                                    Title: Service.Title,
                                    PackageType: CargoElement.PackageType,
                                    PackageRequirement: CargoElement.PackageRequirement,
                                    Number: RowWeight > 0 ? (RowWeight/1000) : 0,
                                    UnitCost: Service.Cost+'.00',
                                    Cost: TotalCost,
                                    Unit: Service.Unit,
                                    Art: Service.Art
                                };
                                SelectedStaffingServices.push(StaffingService);
                            }


                        }

                        // Упаковка и переупаковка (в т.ч. паллетирование и увязка)
                        if(~Packaging && rootState.ReferenceData.Staffing[5][Packaging]){
                            PackagingService = rootState.ReferenceData.Staffing[5][Packaging];

                            // Вес за минусом увязанного груза
                            let PallWeight = RowWeight;

                            // Минусование веса увязанного груза при необходимости
                            if(Packaging === 0){
                                let CeilVolume = Math.ceil(Volume);
                                let CeilWeight = Math.ceil(RowWeight / 1500);
                                if(CeilWeight > CeilVolume && RowWeight % 1500 > 0){
                                    PallWeight -= RowWeight % 1500;
                                }
                            }

                            // Вычисление стоимости (может быть дробной), перевод в строку и добавление нулей при необходимости
                            if(PallWeight > 0 && PackagingService.Cost > 0){
                                TotalCost = String(PallWeight / 1000 * PackagingService.Cost);
                                if(TotalCost.indexOf('.') === -1){
                                    TotalCost += '.00';
                                }
                            }else if(PackagingService.Cost === '0' || PackagingService.Cost === 'Расчетная'){
                                TotalCost = 'Расчетная';
                            }else{
                                TotalCost = '';
                            }
                            SelectedStaffingServices.push({
                                PackageType: PackagingService.Title,
                                Number: PallWeight > 0 ? (PallWeight/1000) : 0,
                                UnitCost: PackagingService.Cost > 0 ? PackagingService.Cost+'.00' : 'Расчетная',
                                Cost: TotalCost,
                                Unit: PackagingService.Unit,
                                Art: PackagingService.Art
                            });
                        }

                        // Предоставление паллета
                        if(Packaging === 0 && Volume > 0){
                            // Услуга предоставления паллета
                            PackagingService = rootState.ReferenceData.Staffing[5][6];

                            // Округленный вверх объём в кубометрах
                            let CeilVolume = Math.ceil(Volume);
                            // Округленный вверх вес в полутора тоннах
                            let CeilWeight = Math.ceil(RowWeight / 1500);

                            SelectedStaffingServices.push({
                                PackageType: PackagingService.Title,
                                Number: (CeilVolume > CeilWeight ? CeilVolume : CeilWeight - 1),
                                UnitCost: PackagingService.Cost+'.00',
                                Cost: (PackagingService.Cost * (CeilVolume > CeilWeight ? CeilVolume : CeilWeight))+'.00',
                                Unit: PackagingService.Unit,
                                Art: PackagingService.Art
                            });

                            // Если паллет по весу выходит больше и остаток по весу (кратно 1500 кг) не нулевой добавляем увязку на остаток
                            if(CeilWeight > CeilVolume && RowWeight % 1500 > 0){
                                // Услуга увязки
                                PackagingService = rootState.ReferenceData.Staffing[5][1];

                                // Вычисление стоимости (может быть дробной), перевод в строку и добавление нулей при необходимости
                                let TotalCost = String((RowWeight % 1500) / 1000 * PackagingService.Cost);
                                if(TotalCost.indexOf('.') === -1){
                                    TotalCost += '.00';
                                }
                                SelectedStaffingServices.push({
                                    PackageType: PackagingService.Title,
                                    Number: (RowWeight % 1500) / 1000,     // Остаток в тоннах
                                    UnitCost: PackagingService.Cost+'.00',
                                    Cost: TotalCost,
                                    Unit: PackagingService.Unit,
                                    Art: PackagingService.Art
                                });
                            }
                        }

                        // Добавление пункта упаковка при упаковке и переупаковке
                        if((Packaging === 2 || Packaging === 3) && (Volume > 0 || RowWeight > 0)){
                            // Количство упаковки (не более куба или 1500 кг на упаковку)
                            let boxNumber = Math.ceil(Volume) > Math.ceil(RowWeight / 1500) ? Math.ceil(Volume) : Math.ceil(RowWeight / 1500);

                            SelectedStaffingServices.push({
                                PackageType: 'Упаковка',
                                Number: boxNumber,
                                UnitCost: 'Расчетная',
                                Cost: 'Расчетная',
                                Unit: 'штука',
                                Art: ''
                            });
                        }
                    }

                });
            }

            return SelectedStaffingServices;
        },

        /**
         * Объект с одиночными услугами
         * @param state
         * @param getters
         * @param rootState
         */
        SelectedSingleServices: (state, getters, rootState) => {

            let ReturnContainer;

            if(
                rootState.WebBid.wInlandTransportationIn && rootState.WebBid.wInlandTransportationIn.ReturnContainer ||
                rootState.WebBid.wInlandTransportationOut && rootState.WebBid.wInlandTransportationOut.ReturnContainer
            ){
                let Container = getters['WebGate' + (getters.isWebGateIn ? 'In' : 'Out') + 'Container'];
                if(Container){
                    ReturnContainer = {
                        Title: 'Обратная доставка'+(Container && Container.Full ? ' порожнего' : '')+(Container && Container.Empty ? ' груженого' : '')+' контейнера',
                        Address: 'Бахчиванджи, д2',
                        Cost: '1500.00',
                        Unit: 'контейнер',
                        Art: '18.1'
                    }
                }
            }

            return {
                DefectCheck: rootState.WebBid.DefectCheck && getters.getBasicServices['10.78'] ? [getters.getBasicServices['10.78']] : [],
                InlandReturnTransportations: ReturnContainer ? [ReturnContainer] : []
            };
        },

        SelectedPriceServices: (state, getters) => {
            let SelectedPriceServices = [];

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
                        SelectedPriceServices.push(Service);
                    }

                    SelectedPriceServices.filter(Service => Service.Title && Service.Art && ~Service.Category && ~Service.Type)
                        .sort((PredService, NextService) => PredService.Type > NextService.Type && PredService.Category > NextService.Category ? 1 : -1);

                    let lastType, lastCategory;

                    SelectedPriceServices.forEach((Service, Index) => {
                        if(Service.Type !== lastType){
                            SelectedPriceServices[Index].TypeTitle = getters.getPriceServices.Types[Service.Type];
                            lastType = Service.Type;
                        }
                        if(Service.Category !== lastCategory){
                            SelectedPriceServices[Index].CategoryTitle = getters.getPriceServices.Categories[Service.Category].Title;
                            lastCategory = Service.Category;
                        }
                    });
                }
            }

            return SelectedPriceServices;
        },

        /**
         * Итоговая стоимость услуг
         * @returns string
         */
        ServicesTotalCost(state, getters){
            /**
             * Переменные для вычисления общей стоимости
             * @type {Number}
             */
            let totalCost = 0;
            /**
             * Итоговый массив выбранных услуг
             * @type {Array}
             */
            let totalArray = getters.SelectedBasicServices.concat(
                getters.SelectedInlandTransportationServices,
                getters.SelectedRepairServices,
                getters.SelectedPriceServices,
                getters.SelectedStaffingServices,
                getters.SelectedSingleServices.DefectCheck,
                getters.SelectedSingleServices.InlandReturnTransportations
            );

            if(totalArray.length > 0){
                for(let i = 0; i < totalArray.length; i++){
                    if(totalArray[i].Cost === 'Расчетная'){
                        return  'Расчетная';
                    }else if(totalArray[i].Cost && +totalArray[i].Cost > 0)
                    {
                        totalCost += +totalArray[i].Cost;
                        if(i >= totalArray.length - 1 && totalCost > 0){
                            return  (totalCost ^ 0) === totalCost ? totalCost+'.00' : totalCost;
                        }
                    }
                }
            }

            return '';
        },

        // getSelectedServices: function (state, getters) {
        //
        //     /**
        //      * Переменные для вычисления общей стоимости
        //      * @type {Number}
        //      */
        //     let totalCost = 0;
        //     /**
        //      * Итоговый массив выбранных услуг
        //      * @type {Array}
        //      */
        //     let totalArray = getters.SelectedBasicServices.concat(
        //         getters.SelectedInlandTransportationServices,
        //         getters.SelectedRepairServices,
        //         getters.SelectedPriceServices,
        //         getters.SelectedSingleServices.DefectCheck,
        //         getters.SelectedSingleServices.InlandReturnTransportations,
        //         getters.SelectedStaffingServices
        //         );
        //     if(totalArray.length > 0){
        //         for(let i = 0; i < totalArray.length; i++){
        //             if(totalArray[i].Cost === 'Расчетная'){
        //                 return  'Расчетная';
        //             }else if(totalArray[i].Cost && +totalArray[i].Cost.slice(0, -3) > 0)
        //             {
        //                 totalCost += +totalArray[i].Cost.slice(0, -3);
        //                 if(i >= totalArray.length - 1 && totalCost > 0){
        //                     SelectedPriceList.TotalCost = totalCost+'.00';
        //                 }
        //             }
        //         }
        //     }
        //
        //     return totalCost;
        // },
    }
};