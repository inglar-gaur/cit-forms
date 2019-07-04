<template>
    <ul>
        <li v-for="(menuItem) in menuItems">
            <router-link :to="menuItem.link" exact><span>{{menuItem.text}}</span></router-link>
        </li>
    </ul>
</template>

<script>
    export default {
        name: "home_intro",
        data: function () {
            return {
                menuItems: [
                    {text: "Приём / выдача", link: "/receiving"}
                ]
            }
        }
    }
</script>

<style lang="scss" scoped>
</style>