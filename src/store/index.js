import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

/**
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
 * @type WebContainer
 */

/**
 * @typedef WebContainerList
 * @property {Number}                   Id
 * @property {String}                   BidType
 * @property {Number}                   BidId
 * @property {Array.<WebContainer>}     ContainerList
 *
 */

/**
 * @typedef WebGate     -   Объект заявки приёма/получения
 * @property {Number}                   Id
 * @property {Number}                   WebBidId
 * @property {String}                   State
 * @property {Number}                   Size
 * @property {Date}                     DatePlan
 * @property {WebContainerList|null}    Containers
 * @property {Object}                   Documents
 * @property {Object}                   Cargo
 */

/**
 * Данные по основной заявке
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
 * @property wInlandTransportation
 * @property wCustomsRelease
 */

const Cargo = {
    Id: null,
    BidType: null,
    BidId: null,
    Elements: [],
};

const WebBid = {
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
        wInlandTransportation: null,
        wCustomsRelease: null,
        wRepairContainer: null,
    },

    mutations: {
        setDefaultWebObject(state, type = '') {

            /**
             * @type WebGate
             */
            let WebGate = {
                Id: null,
                WebBidId: null,
                State: null,
                Size: null,
                DangerousGoods: false,
                DatePlan: null,
                Containers: null,
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
                case 'wInlandTransportation':
                    state.wInlandTransportation = {
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
                        Cargo: Cargo,
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
                state.wGateIn.Cargo = Cargo;
            }
        },

        addDefaultCargoElement(state, WebObjectType) {
            let WebObject = this.getters.getWebBidOperation(WebObjectType);

            console.log(WebObject);
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
                    RepairCategory: '',
                    SpecialRequirements: '',
                    ImageFiles: [],
                }
            );
        },

        /**
         *
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

        changeRepairElement(state, inputData) {
            if (state && state.wRepairContainer && Array.isArray(state.wRepairContainer.list) && inputData && ~inputData.index && state.wRepairContainer.list[inputData.index]) {
                if (
                    state.wRepairContainer.list[inputData.index].hasOwnProperty(inputData.prop) &&
                    inputData.value !== undefined
                ) {
                    state.wRepairContainer.list[inputData.index][inputData.prop] = inputData.value;
                }
                if(state.wRepairContainer.list[inputData.index].Name && state.wRepairContainer.list[inputData.index].Characteristic && inputData.prop === 'Characteristic'){
                    let repairVariantIndex = this.getters.getRepairVariants.findIndex(repairVariant => repairVariant.title === state.wRepairContainer.list[inputData.index].Name);
                    if(~repairVariantIndex && this.getters.getRepairVariants[repairVariantIndex].characteristics){
                        for(let repairCategory in this.getters.getRepairVariants[repairVariantIndex].characteristics){
                            if(this.getters.getRepairVariants[repairVariantIndex].characteristics.hasOwnProperty(repairCategory) &&
                                this.getters.getRepairVariants[repairVariantIndex].characteristics[repairCategory] === state.wRepairContainer.list[inputData.index].Characteristic){
                                switch (+repairCategory) {
                                    case 1:
                                        this.commit('changeRepairElement', {prop: 'RepairCategory', index: inputData.index, value: 'I категория'});
                                        break;
                                    case 2:
                                        this.commit('changeRepairElement', {prop: 'RepairCategory', index: inputData.index, value: 'II категория'});
                                        break;
                                    case 3:
                                        this.commit('changeRepairElement', {prop: 'RepairCategory', index: inputData.index, value: 'III категория'});
                                        break;
                                    case 4:
                                        this.commit('changeRepairElement', {prop: 'RepairCategory', index: inputData.index, value: 'IV категория'});
                                        break;
                                }
                            }
                        }
                    }
                }
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
        isWebGateIn(state) {
            return !!state.wGateIn;
        },
        isEmptyInGateContainer(state){
            return state.wGateIn && state.wGateIn.Containers && Array.isArray(state.wGateIn.Containers.ContainerList) && state.wGateIn.Containers.ContainerList[0] && state.wGateIn.Containers.ContainerList[0].State === 'порожний';
        },
        isFullInGateContainer(state){
            return state.wGateIn && state.wGateIn.Containers && Array.isArray(state.wGateIn.Containers.ContainerList) && state.wGateIn.Containers.ContainerList[0] && state.wGateIn.Containers.ContainerList[0].State === 'груженый';
        },
        isWebGateOut(state) {
            return !!state.wGateOut;
        },
        isEmptyOutGateContainer(state){
            console.log(state.wGateOut);
            return state.wGateOut && state.wGateOut.Containers && Array.isArray(state.wGateOut.Containers.ContainerList) && state.wGateOut.Containers.ContainerList[0] && state.wGateOut.Containers.ContainerList[0].State === 'порожний';
        },
        isFullOutGateContainer(state){
            return state.wGateOut && state.wGateOut.Containers && Array.isArray(state.wGateOut.Containers.ContainerList) && state.wGateOut.Containers.ContainerList[0] && state.wGateOut.Containers.ContainerList[0].State === 'груженый';
        },
        isDangerousGoods(state){
            return (state.wGateIn && state.wGateIn.DangerousGoods) || (state.wGateOut && state.wGateOut.DangerousGoods);
        },
        getWebBidOperation(state) {
            return (WebGateType) => {
                if (WebGateType in state) {
                    return state[WebGateType];
                }
                return false;
            }
        },

        getCharacteristicsFromVariantName(state, getters){
            return repairElementName => {
                if(state && state.wRepairContainer && Array.isArray(state.wRepairContainer.list)){
                    if(repairElementName){
                        let repairVariantIndex = getters.getRepairVariants.findIndex(repairVariant => repairVariant.title === repairElementName);
                        if(~repairVariantIndex && getters.getRepairVariants[repairVariantIndex].characteristics){
                            let characteristics = [];
                            for(let characteristic in getters.getRepairVariants[repairVariantIndex].characteristics){
                                if(getters.getRepairVariants[repairVariantIndex].characteristics.hasOwnProperty(characteristic)){
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
    }
};

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
        WebBid: [
            {title: 'Сухая очистка (уборка) контейнера после выгрузки груза', unit: 'контейнер', price: 2000},
            {title: 'Навешивание/наклеивание сертификационных табличек (КБК, КТК)', unit: 'штука', price: 200},
            {title: 'Предоставление ЗПУ на контейнер', unit: 'штука', price: 300},
            {title: 'Предоставление ЗПУ на контейнер для перевозки опасных грузов', unit: 'штука', price: 600},
        ],
        selected: {WebBid: []},
    },

    mutations: {
        changePrice: function (state, obj) {
            if (state && obj && Array.isArray(state[obj.price]) && state[obj.price][obj.index]) {
                state[obj.price][obj.index].checked = !state[obj.price][obj.index].checked;
            }
        }
    },

    getters: {
        getSelectedPriceElements: function (state) {
            return state.WebBid.filter(elem => elem.checked);
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
            console.log(state);
            console.log(popup);
            console.log(Object.getOwnPropertyDescriptor(state, popup));
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
            '3-го Интернационала',
            '3-й Пятилетки',
            '8 марта, 10',
            '8 марта, 84, 101',
        ],
        RepairVariants: [
            {title: 'Повреждения верхних/нижних стопоров кулачков запорных штанг', characteristics:{
                1: 'Исправление без замены элемента', 2: 'Исправление с заменой элемента (включает стоимость элемента)'
                }},
            {title: 'Деформация кулачка', characteristics:{
                    1: 'Исправление без замены элемента', 2: 'Исправление с заменой элемента (включает стоимость элемента)'
                }},
            {title: 'Повреждение уплотнителя', characteristics:{
                    1: 'Ремонт при повреждении до (длина), мм: 500 включительно. Исправление без замены элемента', 2: 'Восстановление при отсутствии или разрыве элемента, ремонт при повреждении более (длина), мм 500. Исправление с заменой элемента (включает стоимость элемента)'
                }},
        ],
    },

    getters: {

        getRepairVariants(state){
            return state.RepairVariants;
        },

      getTitlesRepairVariants(state) {
          let TitlesRepairVariants = [];

          if(state && Array.isArray(state.RepairVariants)){
              for (let i = 0; i < state.RepairVariants.length; i++){
                  TitlesRepairVariants.push(state.RepairVariants[i].title);
              }
          }

          return TitlesRepairVariants;
      }
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