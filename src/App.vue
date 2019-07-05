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

  @import "../css2/var";
  @import "../css2/forms_elements";

  .cit_form .application{
    position: relative;
  }

    /***** кнопки в формах *****/
  .cit_btn{
    display: inline-flex;
    justify-content: center;
    align-items: center;
    background-color: $color_group_1;
    border: 2px solid $color_group_1;
    text-transform: uppercase;
    padding: 10px 25px;
    height: 40px;
    line-height: 1;
    transition: background-color 0.15s linear;
    margin-bottom: 15px;
    white-space: nowrap;

    &.btn_submit{
      color: white;

      &:disabled{
        opacity: 0.5;
      }
    }

    &:hover{
      background-color: lighten($color_group_1, 30%);

      &:disabled{
        opacity: 0.5;
        background-color: $color_group_1;
        cursor: not-allowed;
      }
    }

    &.btn_add{
      border: 2px solid $color_group_4;
      background-color: white;
      &:hover{
        border: 2px solid $color_group_2;
      }
    }

    &.btn_cancel{
      background-color: transparent;
      border-color: transparent;
      position: relative;
      margin-left: 30px;
      &::before,
      &::after{
        content: '';
        position: absolute;
        top:-1px;
        height: calc(100% - 2px);
        width: 7px;
        border: 2px solid $color_group_1;
        transition: all 0.1s ease-in-out;
      }
      &::before{
        left: 0;
        border-right: none;
      }
      &::after{
        right: 0;
        border-left: none;
      }
      &:hover{
        &::before{
          left: -3px;
        }
        &::after{
          right: -3px;
        }
      }
    }
  }
  .form_message{
    display: flex;
    align-items: center;
    justify-content: center;
    width: 50%;
    height: 100px;
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
