<template>
    <div v-show="$store.state.Messages.Messages.length > 0" class="form_message success">
        <div @click="$store.commit('clearMessages')">
            <svg class="close-cross" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                <path fill="gray"
                      d="M193.94 256L296.5 153.44l21.15-21.15c3.12-3.12 3.12-8.19 0-11.31l-22.63-22.63c-3.12-3.12-8.19-3.12-11.31 0L160 222.06 36.29 98.34c-3.12-3.12-8.19-3.12-11.31 0L2.34 120.97c-3.12 3.12-3.12 8.19 0 11.31L126.06 256 2.34 379.71c-3.12 3.12-3.12 8.19 0 11.31l22.63 22.63c3.12 3.12 8.19 3.12 11.31 0L160 289.94 262.56 392.5l21.15 21.15c3.12 3.12 8.19 3.12 11.31 0l22.63-22.63c3.12-3.12 3.12-8.19 0-11.31L193.94 256z"
                      class=""
                ></path>
            </svg>
        </div>
        <p v-for="(message, index) in $store.state.Messages.Messages" :key="index">{{ message }}</p>
    </div>
</template>

<script>
    export default {
        name: "Messages"
    }
</script>

<style scoped>
    .close-cross {
        width: 25px;
        height: 25px;
        position: absolute;
        top: 10px;
        right: 10px;
        cursor: pointer;
    }
</style>