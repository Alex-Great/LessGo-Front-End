<template>
<transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">

          <!-- <div class="modal-header">
            <slot name="header"></slot>
          </div> -->

          <div class="modal-body">
            <slot name="body"></slot>
          </div>

          <!-- <div class="modal-footer" v-if="!hideFooter">
            <slot name="footer">
              <button class="modal-default-button btn btn-link" @click="$emit('close')">Close</button>
            </slot>
          </div> -->
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
    name: 'modal',
    data () {
        return {
        };
    },
    mounted () {

    },
    methods: {
    },

    props: [
        'hideFooter'
    ]
};
</script>

<style scoped>
    .modal-mask {
        position: fixed;
        z-index: 9998;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, .5);
        display: table;
        transition: opacity .3s ease;
    }

    .modal-wrapper {
        display: table-cell;
        vertical-align: middle;
    }

    .modal-container {
        max-width: 600px;
        width: 90%;
        margin: 0px auto;
        padding: 0%;
        background-color: #fff;
        border-radius: 15px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
        transition: all .3s ease;
        color: #333333;
    }

    .modal-header h3 {
        margin-top: 0;
    }

   

.modal-footer{
    border-top: none;
}
    .modal-default-button {
        float: right;
  width: 2em;
    border: solid 1px #EB5557;
    font-size: 10px;
    width: 3vh;
    left: -5px;
    margin: 1vh;
    background-color: unset;
    color: #EB5557;
    font-weight: bold;
    display: -ms-flexbox;
    display: flex;
    text-align: center;
    -ms-flex-direction: row;
    flex-direction: row;
    -ms-flex-pack: center;
    justify-content: center;
    -ms-flex-align: center;
    align-items: center;
    border-radius: 18px !important;
    height: 70%;
    font-family: 'Poppins', sans-serif;
    position: relative;    }

    /*
    * The following styles are auto-applied to elements with
    * transition="modal" when their visibility is toggled
    * by Vue.js.
    *
    * You can easily play with the modal transition by editing
    * these styles.
    */

    .modal-enter {
        opacity: 0;
    }

    .modal-leave-active {
        opacity: 0;
    }

    .modal-enter .modal-container,
    .modal-leave-active .modal-container {
        -webkit-transform: scale(1.1);
        transform: scale(1.1);
    }
</style>
