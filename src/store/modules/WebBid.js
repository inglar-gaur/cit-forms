
import Constants from './../../Constants';

/**
 * Описание используемых объектов
 *
 *      Объект контейнера
 * @typedef WebContainer
 * @property {Number}   Id
 * @property {Number}   Number
 * @property {Number}   Size
 * @property {String}   State
 * @property {String}   StatePrism
 * @property {String}   CustomsStatus
 * @property {Boolean}  Seal
 * @property {Boolean}  DangerSign
 * @property {Boolean}  SecurityService
 * @property {Boolean}  InsuranceService
 * @property {Number}   WeightGross
 * @property {Number}   VGM
 *
 *      Объект списка контейнеров
 * @typedef WebContainerList
 * @property {Number}                   Id
 * @property {String}                   BidType
 * @property {Number}                   BidId
 * @property {Array.<WebContainer>}     ContainerList
 *
 *      Объект заявки приёма/получения
 * @typedef WebGate
 * @property {Number}                   Id
 * @property {Number}                   WebBidId
 * @property {String}                   State
 * @property {Number}                   Size
 * @property {Date}                     DatePlan
 * @property {Boolean}                  DangerousGoods
 * @property {WebContainerList|null}    Containers
 * @property {Object}                   Documents
 * @property {Object}                   Cargo
 *
 *      Объект автоперевозки
 * @typedef {Object}        WebInlandTransportation
 * @property {Number} Id
 * @property {String} Comment
 * @property {Number} TimeIdle
 * @property {String} Phone
 * @property {String} Contacts
 * @property {String} Address
 * @property {Date} ServiceDatePlan
 * @property {Boolean} DanderousGoods
 * @property {Boolean} CustomsSchedule
 * @property {String} DoubleOperationType
 * @property {Boolean} GateOutOperation
 * @property {Boolean} GateInOperation
 * @property {Number} WebBidId
 * @property {WebContainerList|null} Containers
 * @property  Documents
 * @property {Boolean} ReturnContainer
 * @property {String} street
 * @property {String} houseNumber
 *
 *      Объект списка услуг по ремонту контейнера
 * @typedef {Object} WebRepairContainer
 * @property {Number} Id
 * @property {Array} list
 *
 *      Данные по основной заявке
 * @typedef {Object}        WebBidState
 * @property {Number}       Id
 * @property {String}       gId
 * @property {Date}         ApplicationDate
 * @property {String}       Account
 * @property {String}       Status
 * @property {Boolean}      DangerousGoods
 * @property Documents
 * @property {WebGate|null}  wGateOut
 * @property {WebGate|null}  wGateIn
 * @property wShipping
 * @property wStaffingStripping
 * @property {WebInlandTransportation|null} wInlandTransportation
 * @property {WebRepairContainer|null} wCustomsRelease
 */

function getDefaultCargo(){
    return  {
        Id: null,
        BidType: null,
        BidId: null,
        Elements: []
    }
}

function copyObject(oldObject) {
    let newObject = {};
    if(oldObject){
        for (let prop in oldObject){
            if(oldObject.hasOwnProperty(prop)){
                newObject[prop] = oldObject[prop];
            }
        }
    }
    return newObject;
}

export default {
    /**
     * @type WebBidState
     */
    state: {
        Id: null,
        gId: null,
        ApplicationDate: null,
        Account: null,
        Status: null,
        DangerousGoods: false,
        Documents: null,
        wGateOut: null,
        wGateIn: null,
        wShipping: null,
        wStaffingStripping: null,
        wInlandTransportationIn: null,
        wInlandTransportationOut: null,
        wCustomsRelease: null,
        wRepairContainer: null,
    },

    mutations: {
        setDefaultWebObject(state, type = '') {

            /**
             * @type WebGate
             */
            const WebGate = {
                Id: null,
                WebBidId: null,
                State: null,
                Size: null,
                DangerousGoods: false,
                DatePlan: null,
                Containers: null,
            };

            /**
             * @type WebInlandTransportation
             */
            const WebInlandTransportation = {
                Id: null,
                Comment: null,
                TimeIdle: null,
                Phone: null,
                Contacts: null,
                Address: null,
                ServiceDatePlan: null,
                DanderousGoods: null,
                CustomsSchedule: null,
                DoubleOperationType: null,
                GateOutOperation: null,
                GateInOperation: null,
                WebBidId: null,
                Containers: null,
                Documents: null,
                ReturnContainer: null,
                street: null,
                houseNumber: null,
            };

            switch (type) {
                case 'wGateIn':
                    WebGate.Cargo = null;
                    state.wGateIn = WebGate;
                    break;
                case 'wGateOut':
                    WebGate.Documents = null;
                    state.wGateOut = WebGate;
                    break;
                case 'wInlandTransportationIn':
                    state.wInlandTransportationIn = WebInlandTransportation;
                    break;
                case 'wInlandTransportationOut':
                    state.wInlandTransportationOut = WebInlandTransportation;
                    break;
                case 'wStaffingStripping':
                    state.wStaffingStripping = {
                        Id: null,
                        WebBidId: null,
                        ExecutePeriodStart: null,
                        ExecutePeriodEnd: null,
                        Source: null,
                        Receiver: null,
                        SourceDescription: null,
                        ReceiverDescription: null,
                        Containers: null,
                        Documents: null,
                        Cargo: getDefaultCargo(),
                    };
                    break;
                case 'wCustomsRelease':
                    state.wCustomsRelease = {
                        Id: null,
                        WebBidId: null,
                        Containers: null,
                        Documents: null,
                    };
                    break;
                case 'wRepairContainer':
                    state.wRepairContainer = {
                        Id: null,
                        list: [],
                    };
                    break;
            }
        },

        addDefaultContainer(state, type = '') {

            let WebGate = this.getters.getWebBidOperation(type);

            if (WebGate) {
                if (!WebGate.Containers || !Array.isArray(WebGate.Containers.ContainerList)) {
                    /**
                     * @type WebContainerList
                     */
                    WebGate.Containers = {
                        Id: null,
                        BidType: null,
                        BidId: null,
                        ContainerList: [],
                    };
                }

                WebGate.Containers.ContainerList.push(
                    /**
                     * @type WebContainer
                     */
                    {
                        Id: null,
                        Number: null,
                        Size: null,
                        State: null,
                        StatePrism: null,
                        CustomsStatus: null,
                        Seal: null,
                        DangerSign: null,
                        SecurityService: null,
                        InsuranceService: null,
                        WeightGross: null,
                        VGM: null,
                    }
                );
            }
        },

        /**
         *
         * @param state
         * @param {Object} inputData
         * @param {String} inputData.WebObjectType
         * @param {String} inputData.prop
         * @param {*} inputData.value
         */
        setWebObjectValue(state, inputData) {
            if (inputData && inputData.WebObjectType) {
                let WebGate = this.getters.getWebBidOperation(inputData.WebObjectType);

                if (WebGate && inputData.prop && inputData.prop in WebGate && inputData.value !== undefined) {
                    WebGate[inputData.prop] = inputData.value;
                }
            }
        },

        /**
         *
         * @param state
         * @param {Object} inputData
         * @param {String} inputData.WebGateType
         * @param {String} inputData.prop
         * @param {Number} inputData.index
         * @param {*} inputData.value
         */
        setContainerValue(state, inputData) {
            if (state && inputData && inputData.WebGateType) {
                let WebGate = this.getters.getWebBidOperation(inputData.WebGateType);

                if (
                    WebGate &&
                    WebGate.Containers &&
                    Array.isArray(WebGate.Containers.ContainerList) &&
                    WebGate.Containers.ContainerList[inputData.index] &&
                    inputData.prop in WebGate.Containers.ContainerList[inputData.index] &&
                    inputData.value !== undefined
                ) {
                    WebGate.Containers.ContainerList[inputData.index][inputData.prop] = inputData.value;
                }
            }
        },

        setBidDate(state, date) {
            if (date && date.setMilliseconds) {
                state.ApplicationDate = new Date();
                state.ApplicationDate.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
                state.ApplicationDate.setHours(0, 0, 0, 0);
            }
        },
        setBidTime(state, time) {
            if (state.ApplicationDate && state.ApplicationDate.setHours && time && (time.hours || time.minutes)) {
                let newDate = new Date();
                newDate.setFullYear(state.ApplicationDate.getFullYear(), state.ApplicationDate.getMonth(), state.ApplicationDate.getDate());
                newDate.setHours(isFinite(time.hours) && 0 <= time.hours <= 23 ? time.hours : state.ApplicationDate.getHours());
                newDate.setMinutes(isFinite(time.minutes) && 0 <= time.minutes <= 59 ? time.minutes : state.ApplicationDate.getMinutes());
                state.ApplicationDate = newDate;
            }
        },

        setCargoToWebGateIn(state) {
            if (state.wGateIn) {
                state.wGateIn.Cargo = getDefaultCargo();
            }
        },

        addDefaultCargoElement(state, WebObjectType) {

            if (
                this.getters.WebGateOutContainer &&
                this.getters.WebGateOutContainer.Empty &&
                state.wInlandTransportationOut &&
                state.wInlandTransportationOut.ReturnContainer &&
                !state.wGateIn
            ) {
                this.commit('setDefaultWebObject', 'wGateIn');
                this.commit('setCargoToWebGateIn');
            }

            let WebObject = this.getters.getWebBidOperation(WebObjectType);

            if (WebObject && WebObject.Cargo && Array.isArray(WebObject.Cargo.Elements)) {
                WebObject.Cargo.Elements.push(
                    {
                        Name: '',
                        UnitCount: null,
                        UnitWeight: null,
                        UnitSize: '',
                        PackageDescription: '',
                        DangerousClassification: '',
                    }
                );
            }
        },

        addDefaultRepairElement(state) {

            state.wRepairContainer.list.push(
                {
                    Name: '',
                    Characteristic: '',
                    RepairCategory: null,
                    RepairCategoryText: '',
                    Barcode: null,
                    SpecialRequirements: '',
                    ImageFiles: [],
                }
            );
        },

        delRepairElement(state, index){
            if(Array.isArray(state.wRepairContainer.list) && state.wRepairContainer.list[index]){
                state.wRepairContainer.list.splice(index, 1);
            }
        },

        /**
         * Изменение элемента списка товаров
         * @param state
         * @param {Object} inputData
         * @param {String} inputData.WebObjectType
         * @param {String} inputData.prop
         * @param {Number} inputData.index
         * @param {*} inputData.value
         */
        changeCargoElement(state, inputData) {
            if (state && inputData && inputData.WebObjectType && ~inputData.index) {
                let WebObject = this.getters.getWebBidOperation(inputData.WebObjectType);
                let CargoElement = WebObject && WebObject.Cargo && Array.isArray(WebObject.Cargo.Elements) ? WebObject.Cargo.Elements[inputData.index] : false;

                if (
                    CargoElement &&
                    inputData.prop in CargoElement &&
                    inputData.value !== undefined
                ) {
                    CargoElement[inputData.prop] = inputData.value;
                }
            }
        },

        /**
         * Изменение элемента списка услуг по ремонту
         * @param state
         * @param {Object}  inputData
         * @param {Number}  inputData.index     индекс изменяемого элемента
         * @param {String}  inputData.prop      название изменяемого свойства
         * @param {*}       inputData.value     значение изменяемого свойства
         */
        changeRepairElement(state, inputData) {

            if (
                state && state.wRepairContainer && Array.isArray(state.wRepairContainer.list) && // Проверка наличия объекта ремонта и массива услуг в нём
                inputData && ~inputData.index && state.wRepairContainer.list[inputData.index]    // Проверка входящего индекса и наличия соответствующего элемента
            ) {

                // Если изменилось название, сбрасываем выбранную ранее характеристику
                if(inputData.prop === 'Name'){
                    let MainRepairServiceIndex = this.getters.getRepairVariants.findIndex(MainRepairService => MainRepairService.title === inputData.value && ~MainRepairService.Barcode);
                    if(~MainRepairServiceIndex){
                        state.wRepairContainer.list[inputData.index].Name = inputData.value;
                        state.wRepairContainer.list[inputData.index].Barcode = +MainRepairServiceIndex;
                        state.wRepairContainer.list[inputData.index].Characteristic = null;
                        state.wRepairContainer.list[inputData.index].RepairCategory = null;
                        state.wRepairContainer.list[inputData.index].RepairCategoryText = null;
                    }
                }
                // Иначе если изменилась характеристика, устанавливаем её и вычисляем категорию
                else if (inputData.prop === 'Characteristic' && state.wRepairContainer.list[inputData.index]) {

                    // console.log(state.wRepairContainer.list[inputData.index].Characteristic);
                    // console.log(this.getters.getRepairVariants[repairVariantIndex].characteristics[repairCategory]);
                    /**
                     * Ищем индекс данной услуги в общем списке услуг по ремонту
                     * @type {number}
                     */
                    let repairVariantIndex = this.getters.getRepairVariants.findIndex(repairVariant => repairVariant.title === state.wRepairContainer.list[inputData.index].Name);

                    /**
                     * Если найдена услуга, имеет характеристики, перебираем их ищем соответсвующую выбранной
                     * (repairCategory не индекс массива, а имя св-ва потому что есть услуги без первой категории)
                     */
                    if (~repairVariantIndex && this.getters.getRepairVariants[repairVariantIndex].characteristics) {
                        for (let repairCategory in this.getters.getRepairVariants[repairVariantIndex].characteristics) {
                            if (this.getters.getRepairVariants[repairVariantIndex].characteristics.hasOwnProperty(repairCategory) &&
                                this.getters.getRepairVariants[repairVariantIndex].characteristics[repairCategory] === inputData.value) {

                                state.wRepairContainer.list[inputData.index][inputData.prop] = inputData.value;
                                // Если найдена соответствующая характеристика то присваиваем категорию и её текстовое отображение
                                this.commit('changeRepairElement', {prop: 'RepairCategory', index: inputData.index, value: +repairCategory});
                                if(this.getters.getSelectedPriceElements.TotalRepairCategory >= 4){
                                    this.commit('addMessage', 'Для данной категории ремонта цена расчетная. Предварительно требуется провести дефектовку контейнера');
                                }
                            }
                        }
                    }
                    // Если есть такое свойство, устанавливаем его
                }else if (state.wRepairContainer.list[inputData.index].hasOwnProperty(inputData.prop) && inputData.value !== undefined) {
                    state.wRepairContainer.list[inputData.index][inputData.prop] = inputData.value;
                }

                state.wRepairContainer = copyObject(state.wRepairContainer);
            }
        },

        clearForm(state) {
            for (let stateProp in state) {
                if (state.hasOwnProperty(stateProp)) {
                    state[stateProp] = null;
                }
            }
        }
    },

    getters: {
        // State может быть не заполнен для случая, когда выдача порожнего и обратная доставка груженого (тогда этот объект только для списка товаров)
        isWebGateIn: state => !!state.wGateIn && state.wGateIn.State,
        isWebGateOut: state => !!state.wGateOut && state.wGateOut.State,

        /**
         * Кэшированные данные о первом в списке контейнере входящей и исходящей заявок
         * @typedef CachedContainerParams
         * @property {Number}   Size
         * @property {Boolean}  Empty
         * @property {Boolean}  Full
         * @property {String}   WaitingTime
         *
         * @return null|CachedContainerParams
         */
        WebGateInContainer: (state, getters) => getters.WebGateContainer('In'),
        WebGateOutContainer: (state, getters) => getters.WebGateContainer('Out'),
        WebGateContainer: (state, getters) => WebGateTypePostfix => {
            let container = null;

            let WebGateObject = getters.getWebBidOperation('wGate' + WebGateTypePostfix);
            if (WebGateObject && WebGateObject.Containers && Array.isArray(WebGateObject.Containers.ContainerList) && WebGateObject.Containers.ContainerList[0]) {
                container = {
                    Size: WebGateObject.Containers.ContainerList[0].Size,
                    Empty: WebGateObject.Containers.ContainerList[0].State === Constants.ContainerTitleOfEmpty,
                    Full: WebGateObject.Containers.ContainerList[0].State === Constants.ContainerTitleOfFull,
                    WeightGross: WebGateObject.Containers.ContainerList[0].WeightGross,
                };
                switch (container.Size) {
                    case 20:
                        container.WaitingTime = '90 мин';
                        break;
                    case 40:
                        container.WaitingTime = '180 мин';
                        break;
                }
            }

            return container;
        },


        isDangerousGoods(state) {
            return (state.wGateIn && state.wGateIn.DangerousGoods) || (state.wGateOut && state.wGateOut.DangerousGoods);
        },
        /**
         * @param state
         * @return {WebGate|WebInlandTransportation|null}
         */
        getWebBidOperation(state) {
            return (WebGateType) => {
                if (WebGateType in state) {
                    return state[WebGateType];
                }
                return null;
            }
        },

        getCharacteristicsFromVariantName(state, getters) {
            return repairElementName => {
                if (state && state.wRepairContainer && Array.isArray(state.wRepairContainer.list)) {
                    if (repairElementName) {
                        let repairVariantIndex = getters.getRepairVariants.findIndex(repairVariant => repairVariant.title === repairElementName);
                        if (~repairVariantIndex && getters.getRepairVariants[repairVariantIndex].characteristics) {
                            let characteristics = [];
                            for (let characteristic in getters.getRepairVariants[repairVariantIndex].characteristics) {
                                if (getters.getRepairVariants[repairVariantIndex].characteristics.hasOwnProperty(characteristic)) {
                                    characteristics.push(getters.getRepairVariants[repairVariantIndex].characteristics[characteristic]);
                                }
                            }
                            return characteristics;
                        }
                    }
                    return null;
                }

                return false;
            }
        },

        getSelectedRepairServices: (state) =>
            state.wRepairContainer && Array.isArray(state.wRepairContainer.list) ?
                state.wRepairContainer.list.filter(service => ~service.Barcode).map(service => service.Barcode) : []},
};