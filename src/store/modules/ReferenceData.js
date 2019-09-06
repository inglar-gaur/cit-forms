export default {
    state: {
        Hours: [10, 12, 14, 17],
        Minutes: [10, 12, 14, 17],

        /**
         * Список улиц для доставвки
         */
        // Streets: {
        //     '18.2': {Title: '3-го Интернационала', Art: '18.2', 20: 8800, '20h': 10300, 40: 10500, '40h': 11100},
        //     '18.3': {Title: '3-й Пятилетки', Art: '18.3', 20: 8500, '20h': 9800, 40: 10000, '40h': 10500},
        //     '18.4': {Title: '8 марта, 10', Art: '18.4', 20: 8500, '20h': 9800, 40: 10000, '40h': 10500},
        //     '18.5': {Title: '8 марта, 84, 101', Art: '18.5', 20: 8500, '20h': 9800, 40: 10000, '40h': 10500},
        //     '18.6': {Title: '8 марта, 181', Art: '18.6', 20: 8300, '20h': 9400, 40: 98000, '40h': 10300},
        // },
        Streets: {},

        /**
         * Список услуг ремонта
         */
        RepairServices: [
            {
                Title: 'Повреждения верхних/нижних стопоров кулачков запорных штанг', Characteristics: {
                    '13.1': {Title: 'Исправление без замены элемента', Category: 1},
                    '13.2': {Title: 'Исправление с заменой элемента (включает стоимость элемента)', Category: 2}
                }
            },
            {
                Title: 'Деформация кулачка', Characteristics: {
                    '13.3': {Title: 'Исправление без замены элемента', Alt: '13.3', Category: 1},
                    '13.4': {Title: 'Исправление с заменой элемента (включает стоимость элемента)', Category: 2}
                }
            },
            {
                Title: 'Повреждение уплотнителя', Characteristics: {
                    '13.5': {Title: 'Ремонт при повреждении до (длина), мм: 500 включительно. Исправление без замены элемента', Category: 1},
                    '13.6': {Title: 'Восстановление при отсутствии или разрыве элемента, ремонт при повреждении более (длина), мм 500. Исправление с заменой элемента (включает стоимость элемента)', Category: 2},
                    '13.7': {Title: 'Восстановление при отсутствии или разрыве элемента (включает стоимость элемента)', Category: 2},
                }
            },
            {
                Title: 'Деформация угловой стойки', Characteristics: {
                    '13.25': {Title: 'Ремонт при деформации элемента не более (д/г), мм: 1000х50 включительно', Category: 2},
                    '13.26': {Title: 'Ремонт при деформации элемента от (д/г), мм: 1001х50 до (д/г), мм: 1500х80 включительно', Category: 3},
                    '13.27': {Title: 'Ремонт при превышении характеристик по III категории', Category: 4}
                }
            },
        ],

        /**
         * Список базовых услуг
         */
        BasicServices: {
            '10.5':     {Title: 'Прием контейнера на терминал',                     Unit: 0, Cost: '1500,00', Art: '10.5'},
            '10.6':     {Title: 'Выдача контейнера с терминала',                    Unit: 0, Cost: '1500,00', Art: '10.6'},
            '10.30':    {Title: 'Помещение контейнера на СВХ/ЗТК/Таможенный склад', Unit: 0, Cost: '1500,00', Art: '10.30'},
            '10.31':    {Title: 'Выдача контейнера с СВХ/ЗТК/Таможенного склада',   Unit: 0, Cost: '1500,00', Art: '10.31'},
            '10.78':    {Title: 'Дефектовка повреждений контейнера',                Unit: 0, Cost: '2000,00', Art: '10.78'},
        },

        /**
         * Список с названиями единиц измерения
         */
        UnitTitles: [
            'контейнер',
            'штука',
            'контейнер/сутки',
            'операция',
            'грузовое место',
            'паллета',
        ],

        /**
         * Список услуг по прайсу
         */
        PriceServices:{
            Types:[
                'Терминальные услуги',
                'Склад временного хранения',
            ],
            Categories: [
                {Title: 'терминальное обслуживание рефрижераторного контейнера', Type: 0},
                {Title: 'экспедирование и логистические услуги', Type: 0},
                {Title: 'технологические операции по заявке Заказчика', Type: 1},
            ],
            Services:{
                '10.13': {Title: 'Хранение рефрижераторного контейнера с подключением к электроснабжению', Size: 20, Cost: 1500, Unit: 2, Category: 0},
                '10.14': {Title: 'Хранение рефрижераторного контейнера с подключением к электроснабжению', Size: 40, Cost: 2000, Unit: 2, Category: 0},
                '10.15': {Title: 'Хранение рефрижераторного контейнера с навесным дизель генератором под нагрузкой', Cost: 1000, Unit: 2, Category: 0},
                '10.19': {Title: 'Снятие навесного дизель-генератора с контейнера', Cost: 500, Unit: 3, Category: 0},
                '10.59': {Title: 'Оформление переадресации, оформление телеграммы', Cost: 500, Unit: 0, Category: 1},
                '10.60': {Title: 'Организация услуг по поиску и оформлению предоставления места на ж/д платформе', Cost: 5000, Unit: 0, Category: 1},
                '10.61': {Title: 'Организация услуг по поиску и оформлению пользования контейнером', Cost: 5000, Unit: 0, Category: 1},
                '11.21': {Title: 'Предоставление товара для досмотра/осмотра отбора проб/образцов', Cost: 600, Unit: 5, Category: 2},
                '11.22': {Title: 'Распаллетирование грузового места', Cost: 400, Unit: 5, Category: 2},
            }
        },
    },

    getters: {

        getRepairServices: state => state.RepairServices,

        getBasicServices: state => state.BasicServices,
        getPriceServices: state => state.PriceServices,

        /**
         * @param state
         * @return {Array.<String>|null}
         */
        getStreetsList: state => {
            let StreetsList = [];

            for(let StreetArt in state.Streets){
                if(state.Streets.hasOwnProperty(StreetArt) && state.Streets[StreetArt].Title){
                    StreetsList.push(state.Streets[StreetArt].Title);
                }
            }
            return StreetsList;
        },

        getStreets: state => state.Streets,
        // getStreetZoneCost: state => streetTitle => {
        //     let streetIndex = state.Streets.findIndex(street => street.title === streetTitle);
        //     if (~streetIndex && state.Streets[streetIndex].zone && state.StreetZoneCosts[state.Streets[streetIndex].zone]) {
        //         return state.StreetZoneCosts[state.Streets[streetIndex].zone];
        //     }
        //     return null;
        // }

        getUnitTitle: state =>
            unitIndex => state.UnitTitles && state.UnitTitles[unitIndex] ? state.UnitTitles[unitIndex] : ''
    },

    mutations: {
        /**
         * Установка какого-либо из справочников
         * @param state
         * @param obj
         */
        setDataElement: (state, obj) => {
            if(state && obj && obj.Prop && state.hasOwnProperty(obj.Prop) && obj.Value !== undefined){
                state[obj.Prop] = obj.Value;
            }
        }
    },

    actions: {
        getStreets: context => {
            fetch('http://api.cit-ekb.ru/GetNomenklOfAutoship')
                .then(GetNomenklOfAutoship => {
                    GetNomenklOfAutoship.json().then(resp => {
                        if(resp){
                            context.commit('setDataElement', {Prop: 'Streets', Value: resp});
                        }
                    })
                });
            // axios({
            //     url: 'http://api.cit-ekb.ru/GetNomenklOfAutoship'
            // }).then(resp => {
            //     if(resp && resp.data){
            //         context.commit('setDataElement', {Prop: 'Streets', Value: JSON.parse(resp.data)});
            //     }
            // });
        }
    }

};