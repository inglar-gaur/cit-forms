import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

let defaultWebBid = {
    BidEmpty: '',
    ContainerNumber: '',
    BidSize: null,
    ApplicationDate: '',
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
            if(Object.getOwnPropertyDescriptor(state, popup) !== undefined){
                state[popup] = true;
            }
        },
        /**
         * @param state
         * @param {String} popup - Переменная закрываемого окна
         */
        closePopup(state, popup) {
            if(Object.getOwnPropertyDescriptor(state, popup) !== undefined){
                state[popup] = false;
            }
        }
    }
};

/**
 * Данные по основной заявке
 * @typedef {Object} WebBidState
 * @property {String} BidEmpty
 * @property {String} ContainerNumber
 * @property {Number} BidSize
 * @property {String} ApplicationDate
 */
const WebBid = {
    /**
     * @type WebBidState
     */
    state: defaultWebBid,

    mutations: {
        /**
         * Установка свойства
         * @param state
         * @param {Object}  obj
         * @param {String}  obj.prop    - Название свойства
         * @param {*}       obj.value   - Новое значение свойства
         */
        setBidProp: function(state, obj){
            if(obj && obj.prop && Object.getOwnPropertyDescriptor(state, obj.prop) !== undefined && obj.value !== undefined){
                state[obj.prop] = obj.value;
            }
        },
    }
};

/**
 * Выбранные пункты заявки
 * @typedef SelectedBidPointsState
 * @property {Array} list
 */
const SelectedBidPoints = {
    /**
     * @type SelectedBidPointsState
     */
    state: {
        list: [],
    },

    mutations: {
        addPoint: function (state, point) {
            if(!state.list.includes(point)){
                state.list.push(point);
            }
        },
        removePoint: function (state, point) {
            let pointIndex = state.list.indexOf(point);
            if(~pointIndex){
                state.list.splice(pointIndex, 1);
            }
        }
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
            if(!state.list.includes(message)){
                state.list.push(message);
                state.Timeout = setTimeout(() => {state.list = []}, 4000);
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
            if(state && obj && Array.isArray(state[obj.price]) && state[obj.price][obj.index]){
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

const WebInlandTransportation = {
    state: {
        Contacts: '',
        Phone: '',
        Street: '',
        Streets: [
            '3-го Интернационала',
            '3-й Пятилетки',
            '8 марта, 10',
            '8 марта, 84, 101',
        ]
    },

    mutations: {
        /**
         * Установка свойства
         * @param state
         * @param {Object}  obj
         * @param {String}  obj.prop    - Название свойства
         * @param {*}       obj.value   - Новое значение свойства
         */
        setTransportationProp: function(state, obj){
            if(obj && obj.prop && Object.getOwnPropertyDescriptor(state, obj.prop) !== undefined && obj.value !== undefined){
                state[obj.prop] = obj.value;
            }
        },

        selectStreet: function (state, selectedStreet) {
            let streetIndex = state.Streets.findIndex(street => street === selectedStreet);
            if(~streetIndex){
                state.Street = streetIndex;
            }
        },
    },

    getters:{
      getSelectedStreet: function (state) {
          return state.Streets[state.Street] ? state.Streets[state.Street] : '';
      }
    }
};

const WebCargoElements = {
    state: {
        list: []
    },

    mutations: {
        addWebCargoElement: function (state) {
            state.list.push({
                Name: '',
                UnitCount: null,
                UnitWeight: null,
                UnitSize: '',
                PackageDescription: '',
                DangerousClassification: '',
            });
        },
        
        setWebCargoElementProp: function(state, obj){
            if(obj && state.list[obj.index] && obj.value !== undefined){
                state.list[obj.index][obj.prop] = obj.value;
            }
        }
    }
};

export default new Vuex.Store({
    modules: {
        Popups: PopupsModule,
        WebBid: WebBid,
        SelectedBidPoints: SelectedBidPoints,
        Messages: Messages,
        Price: Price,
        WebInlandTransportation: WebInlandTransportation,
        WebCargoElements: WebCargoElements
    },

    mutations: {
        clearForm(state){
            for(let defaultWebBidIndex in defaultWebBid){
                if(defaultWebBid.hasOwnProperty(defaultWebBidIndex) && state.WebBid.hasOwnProperty(defaultWebBidIndex)){
                    state.WebBid[defaultWebBidIndex] = defaultWebBid[defaultWebBidIndex];
                }
            }

            state.SelectedBidPoints.list = [];
        }
    },
});