
import Constants from './../../Constants';
import DefaultValues from './../../DefaultValues.js';

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
        Id: DefaultValues.getProperty('Id'),
        gId: DefaultValues.getProperty('gId'),
        ApplicationDate: DefaultValues.getProperty(),
        Account: DefaultValues.getProperty('Account'),
        Status: DefaultValues.getProperty('Status'),
        DangerousGoods: DefaultValues.getProperty(),
        Documents: DefaultValues.getProperty(),
        DefectCheck: DefaultValues.getProperty('DefectCheck'),
        wGateOut: DefaultValues.getProperty(),
        wGateIn: DefaultValues.getProperty(),
        wShipping: DefaultValues.getProperty(),
        wStaffingStripping: DefaultValues.getProperty(),
        wInlandTransportationIn: DefaultValues.getProperty(),
        wInlandTransportationOut: DefaultValues.getProperty(),
        wCustomsRelease: DefaultValues.getProperty('wCustomsRelease'),
        wRepairContainer: DefaultValues.getProperty(),
    },

    mutations: {
        /**
         * Установка в свойство основной заявки объекта по умолчанию
         * @param state
         * @param {String} PropertyObjectName
         */
        setDefaultWebObject(state, PropertyObjectName) {

            if(state.hasOwnProperty(PropertyObjectName)){
                state[PropertyObjectName] = DefaultValues.getObject(PropertyObjectName);
            }
        },

        /**
         * Добавление контейнера в список заявки получения или выдачи
         * @param state
         * @param {String} type - Тип заявки (получение или выдача)
         */
        addDefaultContainer(state, type = '') {

            let WebGate = this.getters.getWebBidOperation(type);

            if (WebGate) {
                if (!WebGate.Containers || !Array.isArray(WebGate.Containers.ContainerList)) {
                    WebGate.Containers = DefaultValues.getObject('WebContainerList');
                }

                WebGate.Containers.ContainerList.push(DefaultValues.getObject('WebContainer'));
            }
        },

        /**
         * Полезная нагрузка для передачи в мутации
         * @typedef {Object} PayLoad
         * @property {String} WebObjectType - Имя объекта как свойство другого объекта (опционально)
         * @property {String} ElementIndex  - Индекс элемента (если в массиве) (опционально)
         * @property {String} PropName      - Имя изменяемого свойства
         * @property {*} PropValue          - Значение изменяемого свойства
         */

        /**
         * Изменение свойства объекта (который может являться свойством другого объекта, например какая-то более конкретная заявка)
         * Если PayLoad.WebObjectType не будет передан будет попытка установить свойство объекта state
         * @param state
         * @param {PayLoad} PayLoad
         */
        setWebObjectValue(state, PayLoad) {
            if (PayLoad) {
                let WebGate;
                if(PayLoad && PayLoad.WebObjectType){
                    WebGate = this.getters.getWebBidOperation(PayLoad.WebObjectType);
                }else{
                    WebGate = state;
                }

                if (WebGate && PayLoad.PropName && PayLoad.PropName in WebGate && PayLoad.PropValue !== undefined) {
                    WebGate[PayLoad.PropName] = PayLoad.PropValue;
                }
            }
        },

        /**
         * Изменение свойства контейнера
         * @param state
         * @param {PayLoad} PayLoad
         */
        setContainerValue(state, PayLoad) {
            if (state && PayLoad && PayLoad.WebObjectType) {
                let WebGate = this.getters.getWebBidOperation(PayLoad.WebObjectType);

                if (
                    WebGate &&
                    WebGate.Containers &&
                    Array.isArray(WebGate.Containers.ContainerList) &&
                    WebGate.Containers.ContainerList[PayLoad.ElementIndex] &&
                    PayLoad.PropName in WebGate.Containers.ContainerList[PayLoad.ElementIndex] &&
                    PayLoad.PropValue !== undefined
                ) {
                    WebGate.Containers.ContainerList[PayLoad.ElementIndex][PayLoad.PropName] = PayLoad.PropValue;
                }
            }
        },

        /**
         * Установка даты операции для завок
         *
         * Пока она одна на все виды заявок и хранится в свойстве для даты создания. Перемещение этой даты в остальные заявки и замена на дату создания
         * происходит перед отправкой на сервер.
         * @param state
         * @param date
         */
        setBidDate(state, date) {
            if (date && date.setMilliseconds) {
                state.ApplicationDate = new Date();
                state.ApplicationDate.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
                state.ApplicationDate.setHours(0, 0, 0, 0);
            }
        },

        /**
         * Установка времени операции для заявок
         * @param state
         * @param {Object} time
         * @param {Number} time.hours       - часы
         * @param {Number} time.minutes     - минуты
         */
        setBidTime(state, time) {
            if (state.ApplicationDate && state.ApplicationDate.setHours && time && (time.hours || time.minutes)) {
                let newDate = new Date();
                newDate.setFullYear(state.ApplicationDate.getFullYear(), state.ApplicationDate.getMonth(), state.ApplicationDate.getDate());
                newDate.setHours(isFinite(time.hours) && 0 <= time.hours <= 23 ? time.hours : state.ApplicationDate.getHours());
                newDate.setMinutes(isFinite(time.minutes) && 0 <= time.minutes <= 59 ? time.minutes : state.ApplicationDate.getMinutes());
                state.ApplicationDate = newDate;
            }
        },

        /**
         * Добавление списка грузов в заявку приёма контейнера
         * Если выбрана погрузка при приёме порожнего контейнера или обратная достака груженого контейнера
         * @param state
         */
        setCargoToWebGateIn(state) {
            if (state.wGateIn) {
                state.wGateIn.Cargo = DefaultValues.getObject('CargoList');
            }
        },

        /**
         * Добавления элемента по умалчанию в список грузов
         * @param state
         * @param WebObjectType
         */
        addDefaultCargoElement(state, WebObjectType) {

            /**
             * В случае обратной доставки груженого контейнера заявка получения как таковая не должна быть создана.
             * Мы создаём объект заявки получения контейнера, чтоб в нём передать список грузов и золняем только свойство с этим списком.
             * Сторона сервера должна быть в курсе: их предложение.
             */
            if (
                this.getters.WebGateOutContainer &&                     // Есть контейнер в заявке выдачи
                this.getters.WebGateOutContainer.Empty &&               // Контейнер в заявке выдачи пуст
                state.wInlandTransportationOut &&                       // Выбрана автоперевозка контейнера
                state.wInlandTransportationOut.ReturnContainer &&       // Выбрана обратная доставка
                !state.wGateIn                                          // Заявка получения контейнера еще не существует
            ) {
                this.commit('setDefaultWebObject', 'wGateIn');          // Создание заявки получения контейнера
                this.commit('setCargoToWebGateIn');                     // Создание списка с грузами
            }

            let WebObject = this.getters.getWebBidOperation(WebObjectType);

            console.log(WebObject);

            if (WebObject && WebObject.Cargo && Array.isArray(WebObject.Cargo.Elements)) {
                WebObject.Cargo.Elements.push(DefaultValues.getObject('CargoElement'));
            }
        },

        /**
         * Добавление услуги по ремонту в список
         */
        addDefaultRepairElement: state => state.wRepairContainer.list.push(DefaultValues.getObject('RepairElement')),

        delRepairElement(state, index){
            if(Array.isArray(state.wRepairContainer.list) && state.wRepairContainer.list[index]){
                state.wRepairContainer.list.splice(index, 1);
            }
        },

        /**
         * Изменение элемента списка товаров
         * @param state
         * @param {PayLoad} PayLoad
         */
        changeCargoElement(state, PayLoad) {
            if (state && PayLoad && PayLoad.WebObjectType && ~PayLoad.ElementIndex) {
                let WebObject = this.getters.getWebBidOperation(PayLoad.WebObjectType);
                let CargoElement = WebObject && WebObject.Cargo && Array.isArray(WebObject.Cargo.Elements) ? WebObject.Cargo.Elements[PayLoad.ElementIndex] : false;

                if (
                    CargoElement &&
                    PayLoad.PropName in CargoElement &&
                    PayLoad.PropValue !== undefined
                ) {
                    CargoElement[PayLoad.PropName] = PayLoad.PropValue;
                }
            }
        },

        /**
         * Изменение элемента списка услуг по ремонту
         * @param state
         * @param {PayLoad} PayLoad
         */
        changeRepairElement(state, PayLoad) {

            if (
                state && state.wRepairContainer && Array.isArray(state.wRepairContainer.list) && // Проверка наличия объекта ремонта и массива услуг в нём
                PayLoad && ~PayLoad.ElementIndex && state.wRepairContainer.list[PayLoad.ElementIndex]    // Проверка входящего индекса и наличия соответствующего элемента
            ) {

                // Если изменилось название, сбрасываем выбранную ранее характеристику
                if(PayLoad.PropName === 'ServiceIndex'){
                    state.wRepairContainer.list[PayLoad.ElementIndex].ServiceIndex = PayLoad.PropValue;
                    state.wRepairContainer.list[PayLoad.ElementIndex].Characteristic = null;
                    state.wRepairContainer.list[PayLoad.ElementIndex].RepairCategory = null;
                    state.wRepairContainer.list[PayLoad.ElementIndex].RepairCategoryText = null;
                }
                // Иначе если изменилась характеристика, устанавливаем её и вычисляем и устанавливаем категорию
                else if (
                    PayLoad.PropName === 'Characteristic' &&
                    state.wRepairContainer.list[PayLoad.ElementIndex] &&
                    ~state.wRepairContainer.list[PayLoad.ElementIndex].ServiceIndex
                ) {

                    let RepairService = this.getters.getRepairServices[state.wRepairContainer.list[PayLoad.ElementIndex].ServiceIndex];

                    if(RepairService && RepairService.Characteristics && RepairService.Characteristics[PayLoad.PropValue]){
                        state.wRepairContainer.list[PayLoad.ElementIndex].Characteristic = PayLoad.PropValue;

                        // Если найдена соответствующая характеристика то присваиваем категорию
                        this.commit('changeRepairElement', {PropName: 'RepairCategory', ElementIndex: PayLoad.ElementIndex, PropValue: RepairService.Characteristics[PayLoad.PropValue].Category});
                        if(this.getters.getSelectedServices.TotalRepairCategory >= 4){
                            this.commit('addMessage', 'Для данной категории ремонта цена расчетная. Предварительно требуется провести дефектовку контейнера');
                        }
                    }

                }else if (state.wRepairContainer.list[PayLoad.ElementIndex].hasOwnProperty(PayLoad.PropName) && PayLoad.PropValue !== undefined) {
                    state.wRepairContainer.list[PayLoad.ElementIndex][PayLoad.PropName] = PayLoad.PropValue;
                }

                state.wRepairContainer = copyObject(state.wRepairContainer);
            }
        },

        /**
         * Очистка формы
         * @param state
         */
        clearForm(state) {
            // Возвращаем свойствам основной заявки значений по умолчанию
            for (let stateProp in state) {
                if (state.hasOwnProperty(stateProp)) {
                    state[stateProp] = DefaultValues.getProperty(stateProp);
                }
            }
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        }
    },

    getters: {
        // State может быть не заполнен для случая, когда выдача порожнего и обратная доставка груженого (тогда этот объект только для списка товаров)
        isWebGateIn: state => !!(state.wGateIn && state.wGateIn.State),
        isWebGateOut: state => !!(state.wGateOut && state.wGateOut.State),

        /**
         * Кэшированные данные о первом в списке контейнере входящей и исходящей заявок
         * @typedef CachedContainerParams
         * @property {Number}   Size
         * @property {Boolean}  Empty
         * @property {Boolean}  Full
         * @property {String}   WaitingTime
         * @property {Number}   WeightGross
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
                    Number: WebGateObject.Containers.ContainerList[0].Number,
                    State: WebGateObject.Containers.ContainerList[0].State,
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

        /**
         * Выбран опасный груз  в заявке получения или выдачи
         * @return {Boolean}
         */
        isDangerousGoods: state => (state.wGateIn && state.wGateIn.DangerousGoods) || (state.wGateOut && state.wGateOut.DangerousGoods),

        /**
         * Функция получения свойства основной заявки по его имени
         * @param state
         * @returns {Function}
         */
        getWebBidOperation: state =>

            /**
             * @param {String} WebBidPropName
             * @return {WebGate|WebInlandTransportation|null}
             */
                WebBidPropName => {
                if (WebBidPropName in state) {
                    return state[WebBidPropName];
                }
                return null;
            },

        /**
         * Возможность отправить форму на сервер
         * @param state
         * @param getters
         * @returns {boolean}
         */
        canSubmitBid(state, getters) {
            if (state.ApplicationDate) {
                let container;
                if (getters.isWebGateIn) {
                    container = getters.WebGateInContainer;
                } else if (getters.isWebGateOut) {
                    container = getters.WebGateOutContainer;
                }

                return !!(container && container.Size && container.Number);
            }
            return false;
        }
    }
};