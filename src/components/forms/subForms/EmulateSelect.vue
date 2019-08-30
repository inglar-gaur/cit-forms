<template>
    <div class="emulated-list" :class="{open: openList}">
        <div class="input-wrap">
            <input @focus="openList = true" type="text" v-model="inputValue" :placeholder="placeholder">
            <span @click="openList = !openList" class="list-chevron"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="svg-inline--fa fa-chevron-down fa-w-14 fa-3x"><path fill="currentColor" d="M443.5 162.6l-7.1-7.1c-4.7-4.7-12.3-4.7-17 0L224 351 28.5 155.5c-4.7-4.7-12.3-4.7-17 0l-7.1 7.1c-4.7 4.7-4.7 12.3 0 17l211 211.1c4.7 4.7 12.3 4.7 17 0l211-211.1c4.8-4.7 4.8-12.3.1-17z" class=""></path></svg></span>
        </div>
        <div class="emulated-list-list" v-show="openList">
            <div v-for="(element) in filteringList" @click="selectElement(element)">{{element}}</div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "EmulateSelect",

        data: function(){
            return {
                inputValue: '',
                openList: false,
            }
        },

        props: {
            elementsList: {type: Array, default: []},
            placeholder: {type: String, default: ''},
        },

        computed: {
            filteringList: function () {
                if(this.inputValue.length > 2){
                    return this.elementsList;
                }
                return this.elementsList;
            },
        },

        methods:{
            selectElement: function (element) {
                this.openList = false;
                this.$emit('selectElement', element);
            }
        },

        mounted() {
            document.body.addEventListener('click', (e) => {
                if(e.target && !this.$el.contains(e.target)){
                    this.openList = false;
                }
            })
        }
    }
</script>

<style lang="scss" scoped>
    .emulated-list{
        position: relative;

        .input-wrap{
            position: relative;
        }
    }
    .list-chevron{
        position: absolute;
        right: 5px;
        top: 50%;
        transform: translateY(-50%);
        transition: all 0.2s;
        cursor: pointer;

        svg{
            width: 15px;
        }
    }
    .emulated-list-list{
        position: absolute;
        background-color: white;
        width: 200%;
        padding-top: 10px;
        z-index: 10;
        height: 350px;
        overflow: auto;

        >div{
            cursor: pointer;
            margin-left: 5px;
            margin-bottom: 7px;
            line-height: 1.2;
        }
    }

    .emulated-list.open{
        .list-chevron{
            transform: translateY(-50%) rotate(180deg);
        }
    }
</style>