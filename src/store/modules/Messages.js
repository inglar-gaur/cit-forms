/**
 * Сообщения
 * @typedef MessagesState
 * @property {Array} Messages
 * @property {Number} Timeout
 */
export default {
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
            if (!state.Messages.includes(message)) {
                state.Messages.push(message);
                state.Timeout = setTimeout(() => {
                    state.Messages = []
                }, 4000);
            }
        },
        clearMessages: function (state) {
            state.Messages = [];
            clearTimeout(state.Timeout);
        }
    }
};