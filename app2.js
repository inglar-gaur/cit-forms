let app2 = new Vue({
    el: '#app2',
    data: {
        // logic
        step: 1,
        step_1_get: null,
        step_2_fill: null,

        // content
        title: 'Заявка на автоперевозку',
        stepDescription: 'Выберите необходимые параметры грузоперевозки, чтобы продолжить, и нажмите кнопку "Продолжить".',
        stepsContent: [
            {
                step: 1,
                title: 'Заявка на автоперевозку',
                stepDescription: 'Выберите необходимые параметры грузоперевозки, чтобы продолжить, и нажмите кнопку "Продолжить".',
                reached: true,
                active: true
            },
            {
                step: 2,
                title: 'Заявка на автоперевозку продолжение',
                stepDescription: 'Внезапно, некоторые особенности внутренней политики призваны к ответу.',
                reached: false,
                active: false
            },
            {
                step: 3,
                title: 'Заявка на автоперевозку - это уже третий шаг',
                stepDescription: 'Ясность нашей позиции очевидна: сложившаяся структура организации играет важную роль в формировании стандартных подходов.',
                reached: false,
                active: false
            },
            {
                step: 4,
                title: 'Приложите доверенность и теперь можно подписать и отправить!!!',
                stepDescription: 'Безусловно, высокое качество позиционных исследований не оставляет шанса для поставленных обществом задач.',
                reached: false,
                active: false
            },
            // {
            //     step: 5,
            //     title: 'Скоро финишь!',
            //     stepDescription: 'Для современного мира существующая теория требует определения и уточнения модели развития.',
            //     reached: false,
            //     active: false
            // },
            // {
            //     step: 6,
            //     title: 'Теперь можно подписать и отправить!!!',
            //     stepDescription: 'Кстати, интерактивные прототипы и по сей день остаются уделом либералов, которые жаждут быть призваны к ответу.',
            //     reached: false,
            //     active: false
            // }
        ],
    },
    methods: {
        nextStep(e){
            e.preventDefault();
            if(this.step < this.stepsContent.length){
                this.step++;
            }
        },
        prevStep(e){
            e.preventDefault();
            if(this.step !== 1){
                this.step--;
            }
        },
        stepClick(e){
            if(e.target.classList.contains('reached')){
                this.step = +(e.target.getAttribute('data-step'));
            }
        },

        step_1_get_true(){
            if(this.step===1){
                this.step_1_get = true;
            }
        },
        step_1_get_false(){
            if(this.step===1){
                this.step_1_get = false;
            }
        },
        step_2_fill_false(){
            if(this.step===2){
                this.step_2_fill = false;
            }
        },
        step_2_fill_true(){
            if(this.step===2){
                this.step_2_fill = true;
            }
        }
    },
    watch: {
        step: function(newVal, oldVal){
            this.stepsContent[oldVal - 1].active = false;
            this.stepsContent[newVal - 1].active = true;
            this.stepsContent[newVal - 1].reached = true;

            this.title = this.stepsContent[newVal - 1].title;
            this.stepDescription = this.stepsContent[newVal - 1].stepDescription;
        }
    }
});