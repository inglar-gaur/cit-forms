import Vue from 'vue';
import Vuex from 'vuex';
import WebBid from "./modules/WebBid";
import Price from "./modules/Price";
import Messages from "./modules/Messages";
import Popups from "./modules/Popups";
import ReferenceData from "./modules/ReferenceData";

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        Popups: Popups,
        WebBid: WebBid,
        Messages: Messages,
        Price: Price,
        ReferenceData: ReferenceData
    },
});