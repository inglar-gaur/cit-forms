import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

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
            if(state.hasOwnProperty(popup)){
                state[popup] = true;
            }
        },
        /**
         * @param state
         * @param {String} popup - Переменная закрываемого окна
         */
        closePopup(state, popup) {
            if(state.hasOwnProperty(popup)){
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
    state: {
        BidEmpty: '',
        ContainerNumber: '',
        BidSize: null,
        ApplicationDate: '',
    },

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
    }
};

const WebInlandTransportation = {
    state: {
        Contacts: '',
        Phone: '',
        Address: '',
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


    getters: {

    },
});