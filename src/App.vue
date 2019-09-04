<template>
  <div id="app">
    <router-view

    ></router-view>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style lang="scss">

  @import "../public/css2/var";
  @import "../public/css2/forms_elements";

  .cit_form .application{
    position: relative;
  }


  .form_message{
    display: flex;
    align-items: center;
    justify-content: center;
    width: 50%;
    padding: 30px;
    background-color: #00b159;
    border-radius: 10px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform:translate(-50%, -50%);
    z-index: 1;
    font-weight: bold;
    font-size: 22px;
  }
</style>
