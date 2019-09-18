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

export default {
    /**
     * Получение объектов по умолчанию
     * @param ClassName
     * @return {WebInlandTransportation|WebGate|WebInlandTransportation}}
     */
    getObject(ClassName) {
        switch (ClassName) {
            case 'Id':
                return 0;
            case 'wGateIn':
            case 'wGateOut':
                /**
                 * Объект приёма или выдачи контейнера
                 * @type WebGate
                 */
                const WebGate = {
                    Id: 0,
                    WebBidId: 0,
                    State: '',
                    Size: 0,
                    DangerousGoods: false,
                    DatePlan: null,
                    Containers: null,
                };

                // Объект приёма
                if(ClassName === 'wGateIn'){
                    WebGate.Cargo = null;
                    // Объект выдачи
                }else if (ClassName === 'wGateOut'){
                    WebGate.Documents = null;
                }

                return WebGate;

            case 'wInlandTransportationIn':
            case 'wInlandTransportationOut':
                /**
                 * Объект автоперевозки
                 * @type WebInlandTransportation
                 */
                const WebInlandTransportation = {
                    Id: 0,
                    Comment: '',
                    TimeIdle: 0,
                    Phone: '',
                    Contacts: '',
                    ServiceDatePlan: null,
                    DanderousGoods: false,
                    CustomsSchedule: false,
                    DoubleOperationType: '',
                    GateOutOperation: false,
                    GateInOperation: false,
                    WebBidId: 0,
                    Containers: null,
                    Documents: null,
                    ReturnContainer: null,
                    street: '',
                    houseNumber: '',
                };

                Object.defineProperty(WebInlandTransportation, 'Address', {
                    get: function () {
                        return this.street + (this.street && this.houseNumber ? ', ' + this.houseNumber : '');
                    }
                });
                return WebInlandTransportation;

            case 'wStaffingStripping':
                return  {
                    Id: 0,
                    WebBidId: 0,
                    ExecutePeriodStart: null,
                    ExecutePeriodEnd: null,
                    Source: '',
                    Receiver: '',
                    SourceDescription: '',
                    ReceiverDescription: '',
                    Containers: null,
                    Documents: null,
                    Cargo: this.getObject('CargoList'),
                };

            case 'wCustomsRelease':
                return {
                    Id: 0,
                    WebBidId: 0,
                    Containers: null,
                    Documents: null,
                };
            case 'wRepairContainer':
                /**
                 * Объект списка услуг по ремонту контейнера
                 * @type WebRepairContainer
                 */
                return  {
                    Id: 0,
                    list: [],
                };

            case 'WebContainerList':
                /**
                 * Список контейнеров
                 * @type WebContainerList
                 */
                return {
                    Id: 0,
                    BidType: '',
                    BidId: 0,
                    ContainerList: [],
                };

            case 'WebContainer':
                /**
                 * @type WebContainer
                 */
                return {
                    Id: 0,
                    Number: null,
                    Size: 0,
                    State: '',
                    StatePrism: '',
                    CustomsStatus: '',
                    Seal: false,
                    DangerSign: false,
                    SecurityService: false,
                    InsuranceService: false,
                    WeightGross: 0,
                    VGM: 0,
                };

            case 'CargoList':
                return {
                    Id: 0,
                    BidType: 0,
                    BidId: 0,
                    Elements: []
                };

            case 'CargoElement':
                return {
                    Id: 0,
                    Name: '',
                    CodeETSNG: '',
                    UnitCount: 1,
                    UnitWeight: 0,
                    UnitSize: '',
                    PackageType: '',
                    PackageRequirement: '',
                    PackageDescription: '',
                    DangerousClassification: '',
                };
            case 'RepairElement':
                return {
                    ServiceIndex: -1,
                    Characteristic: '',
                    SpecialRequirements: '',
                    ImageFiles: [],
                };
            default:
                return {};
        }
    },

    getProperty(PropertyName = ''){
        switch (PropertyName) {
            case 'Id':
                return 0;
            case 'Account':
            case 'Status':
                return '';
            case 'gId':
                return "00000000-0000-0000-0000-000000000000";
            case 'DefectCheck':
                return false;
            case 'wCustomsRelease':
                return [];
            default:
                return null;
        }
    }
};