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

        Staffing: {},

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
                    '13.5': {
                        Title: 'Ремонт при повреждении до (длина), мм: 500 включительно. Исправление без замены элемента',
                        Category: 1
                    },
                    '13.6': {
                        Title: 'Восстановление при отсутствии или разрыве элемента, ремонт при повреждении более (длина), мм 500. Исправление с заменой элемента (включает стоимость элемента)',
                        Category: 2
                    },
                    '13.7': {
                        Title: 'Восстановление при отсутствии или разрыве элемента (включает стоимость элемента)',
                        Category: 2
                    },
                }
            },
            {
                Title: 'Деформация угловой стойки', Characteristics: {
                    '13.25': {
                        Title: 'Ремонт при деформации элемента не более (д/г), мм: 1000х50 включительно',
                        Category: 2
                    },
                    '13.26': {
                        Title: 'Ремонт при деформации элемента от (д/г), мм: 1001х50 до (д/г), мм: 1500х80 включительно',
                        Category: 3
                    },
                    '13.27': {Title: 'Ремонт при превышении характеристик по III категории', Category: 4}
                }
            },
        ],

        /**
         * Список базовых услуг
         */
        BasicServices: {
            '10.5': {Title: 'Прием контейнера на терминал', Unit: 'контейнер', Cost: '1500,00', Art: '10.5'},
            '10.6': {Title: 'Выдача контейнера с терминала', Unit: 'контейнер', Cost: '1500,00', Art: '10.6'},
            '10.30': {
                Title: 'Помещение контейнера на СВХ/ЗТК/Таможенный склад',
                Unit: 'контейнер',
                Cost: '1500,00',
                Art: '10.30'
            },
            '10.31': {Title: 'Выдача контейнера с СВХ/ЗТК/Таможенного склада', Unit: 'контейнер', Cost: '1500,00', Art: '10.31'},
            '10.78': {Title: 'Дефектовка повреждений контейнера', Unit: 'контейнер', Cost: '2000,00', Art: '10.78'},
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
        PriceServices: {
            Types: [
            //     'Терминальные услуги',
            //     'Склад временного хранения',
            ],
            Categories: [
            //     {Title: 'терминальное обслуживание рефрижераторного контейнера', Type: 0},
            //     {Title: 'экспедирование и логистические услуги', Type: 0},
            //     {Title: 'технологические операции по заявке Заказчика', Type: 1},
            ],
            Services: {
            //     '10.13': {
            //         Title: 'Хранение рефрижераторного контейнера с подключением к электроснабжению',
            //         Size: 20,
            //         Cost: 1500,
            //         Unit: 2,
            //         Category: 0
            //     },
            //     '10.14': {
            //         Title: 'Хранение рефрижераторного контейнера с подключением к электроснабжению',
            //         Size: 40,
            //         Cost: 2000,
            //         Unit: 2,
            //         Category: 0
            //     },
            //     '10.15': {
            //         Title: 'Хранение рефрижераторного контейнера с навесным дизель генератором под нагрузкой',
            //         Cost: 1000,
            //         Unit: 2,
            //         Category: 0
            //     },
            //     '10.19': {Title: 'Снятие навесного дизель-генератора с контейнера', Cost: 500, Unit: 3, Category: 0},
            //     '10.59': {Title: 'Оформление переадресации, оформление телеграммы', Cost: 500, Unit: 0, Category: 1},
            //     '10.60': {
            //         Title: 'Организация услуг по поиску и оформлению предоставления места на ж/д платформе',
            //         Cost: 5000,
            //         Unit: 0,
            //         Category: 1
            //     },
            //     '10.61': {
            //         Title: 'Организация услуг по поиску и оформлению пользования контейнером',
            //         Cost: 5000,
            //         Unit: 0,
            //         Category: 1
            //     },
            //     '11.21': {
            //         Title: 'Предоставление товара для досмотра/осмотра отбора проб/образцов',
            //         Cost: 600,
            //         Unit: 5,
            //         Category: 2
            //     },
            //     '11.22': {Title: 'Распаллетирование грузового места', Cost: 400, Unit: 5, Category: 2},
            },
        },

        packRequirements: [
            [
                'грузить навалом',
                'паллетировать',
                'увязать',
                'упаковать в короб',
                'упаковать в биг-бэк',
                'упаковать в мешок'
            ],
            [
                'переупаковать в биг-бэк',
                'переупаковать в мешок',
                'переупаковать в короб',
                'паллетировать',
                'увязать',
                'без переупаковки'
            ],
            [
                'паллетировать',
                'упаковать',
                'без переупаковки'
            ]
        ],

        PackTypes: [
            {Title: 'штучный', RequirementsIndex: 0},
            {Title: 'паллетированный', RequirementsIndex: 1},
            {Title: 'увязанный', RequirementsIndex: 1},
            {Title: 'упакованный', RequirementsIndex: 1},
            {Title: 'неделимый', RequirementsIndex: 2}
        ]
    },

    getters: {

        getRepairServices: state => state.RepairServices,

        getBasicServices: state => state.BasicServices,
        getPriceServices: state => state.PriceServices,

        getPackRequirementByType: state => typeTitle =>{
            let Requirements = [];
            state.PackTypes.find(type => {
                if(
                    type.Title === typeTitle &&
                    ~type.RequirementsIndex &&
                    Array.isArray(state.packRequirements[type.RequirementsIndex])
                ){
                    Requirements = state.packRequirements[type.RequirementsIndex];
                    return true;
                }
            });
            return Requirements;
        },

        /**
         * @param state
         * @return {Array.<String>|null}
         */
        getStreetsList: state => {
            let StreetsList = [];

            for (let StreetArt in state.Streets) {
                if (state.Streets.hasOwnProperty(StreetArt) && state.Streets[StreetArt].Title) {
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
            if (state && obj && obj.Prop && state.hasOwnProperty(obj.Prop) && obj.Value !== undefined) {
                state[obj.Prop] = obj.Value;
            }
        },

        /**
         * Добавление типа прайса
         * @param state
         * @param {Object} PayLoad
         * @param {Number} PayLoad.Index    - Индекс типа (важен для сохранения порядка перебора при формировании таблицы выбора)
         * @param {String} PayLoad.Title    - Название прайса
         */
        addPriceType: (state, PayLoad) => {
            if (~PayLoad.Index && PayLoad.Title) {
                state.PriceServices.Types[PayLoad.Index] = PayLoad.Title;
            }
        },

        /**
         * @typedef {Object} InputPriceService Объект услуги, получаемый от сервера
         * @property {String} Title     - Наименование
         * @property {String} Artic     - Артикул
         * @property {String} Price     - Стоимость
         * @property {String} Measure   - Ед. изм.
         *
         * @typedef {Object} InputPriceCategory Объект категории услуги, получаемый от сервера
         * @property {string}                       Title
         * @property {Array.<InputPriceService>}    ListSubNomenkl
         *
         *  Добавление услуг и категорий прайса
         * @param state
         * @param {Object}                      PayLoad
         * @param {number}                      PayLoad.Type            - Массив с категориями
         * @param {Array.<InputPriceService>}   PayLoad.Categories      - Массив объектов услуг
         */
        addPrices: (state, PayLoad) => {
            if(~PayLoad.Type && Array.isArray(PayLoad.Categories)){
                PayLoad.Categories.forEach(PriceCategory => {

                    // Добавление категории в список
                    let CategoryIndex = state.PriceServices.Categories.push({Title: PriceCategory.Title, Type: PayLoad.Type});

                    // Перебор объектов услуг и их добавление в список по артикулу
                    if(~CategoryIndex && Array.isArray(PriceCategory.ListSubNomenkl)){
                        let feet20regExp = new RegExp(/20\sфут\./),
                            feet40regExp = new RegExp(/40\sфут\./),
                            spaceRegExp = new RegExp(/\s/, 'g');
                        let formattedPrice;
                        PriceCategory.ListSubNomenkl.forEach(Price => {
                            formattedPrice = +(Price.Price.replace(spaceRegExp, ''));
                            if(Price.Artic && Price.Title && Price.Price && Price.Measure){
                                let NewPriceObject = {
                                    Title: Price.Title,
                                    Cost: formattedPrice > 0 ? formattedPrice : Price.Price,
                                    Unit: Price.Measure,
                                    Category: CategoryIndex
                                };
                                if(feet20regExp.test(Price.Title)){
                                    NewPriceObject.Size = 20;
                                }else if(feet40regExp.test(Price.Title)){
                                    NewPriceObject.Size = 40;
                                }
                                state.PriceServices.Services[Price.Artic] = NewPriceObject;
                            }
                        });
                    }
                });
            }
        },

        addStaffingServices: (state, inputStaffingServices) => {
            for(let i = 0; i < 6; i++){
                let inputStaffingServicesArr = inputStaffingServices['listNomenkl'+(i+1)];
                let spaceRegExp = new RegExp(/\s/, 'g');
                let formattedPrice;
                state.Staffing[i] = [];
                if(Array.isArray(inputStaffingServicesArr)){
                    inputStaffingServicesArr.forEach(inputStaffingService => {
                        formattedPrice = +(inputStaffingService.Price.replace(spaceRegExp, ''));
                        state.Staffing[i].push({
                            Title: inputStaffingService.Title,
                            Cost: formattedPrice > 0 ? formattedPrice : inputStaffingService.Price,
                            Unit: inputStaffingService.Measure,
                            Art: inputStaffingService.Artic
                        });
                    });
                }
            }
        }
    },

    actions: {
        getStreets: context => {
            fetch('http://api.cit-ekb.ru/GetNomenklOfAutoship')
                .then(GetNomenklOfAutoship => {
                    GetNomenklOfAutoship.json().then(resp => {
                        if (resp) {
                            context.commit('setDataElement', {Prop: 'Streets', Value: resp});
                        }
                    })
                });
        },

        getCustomsReleasePrices: context => {
            fetch('http://api.cit-ekb.ru/GetNomenklOfSVH')
                .then(GetNomenklOfSVH => {
                    GetNomenklOfSVH.json().then(ReleasePricesArr => {
                        // console.log(ReleasePricesArr);
                        if (Array.isArray(ReleasePricesArr)) {

                            context.commit('addPriceType', {Index: 1, Title: 'Склад временного хранения'});
                            context.commit('addPrices', {Type: 1, Categories: ReleasePricesArr});
                        }
                    })
                });
        },

        getTerminalPrices: context => {
            fetch('http://api.cit-ekb.ru/GetNomenklOfTerminal')
                .then(GetTerminalPrices => {
                    GetTerminalPrices.json().then(GetTerminalPricesArr => {
                        if (Array.isArray(GetTerminalPricesArr)) {
                            context.commit('addPriceType', {Index: 0, Title: 'Терминальные услуги'});
                            context.commit('addPrices', {Type: 0, Categories: GetTerminalPricesArr});
                        }
                    })
                });
        },

        getPRR: context => {
            fetch('http://api.cit-ekb.ru/GetNomenklOfPRR')
                .then(GetPRR => {
                    GetPRR.json().then(GetPRRArr => {
                        GetPRRArr['listNomenkl6'].push({
                            Title: 'Предоставление паллета',
                            Measure: 'штука',
                            Price: '250',
                            Artic: '17.53'
                        });
                        context.commit('addStaffingServices', GetPRRArr);

                    })
                });
        },

        getBasicServices: context => {
            fetch('http://api.cit-ekb.ru/GetNomenklOfAutomatically')
                .then(getBasicServices => {
                    getBasicServices.json().then(BasicServicesArr => {
                        // console.log(BasicServicesArr);
                    })
                });
        }
    }

};