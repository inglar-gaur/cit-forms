/**
 * Модуль всплывающих окон
 * @typedef {Object} PopupsState
 * @property {Boolean} PriceSelectPopup         - Окно с добавлением пунктов из прайса
 * @property {Boolean} PriceSelectedPopup       - Окно с добавленными пунктами из прайса
 */
export default {
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