<template>
    <div>
    <div v-if="showMenu" class="show-menu" @click="showVisibility">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="feather feather-menu" style="color: rgb(28, 137, 131)"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
    </div>
    <div v-if="!showMenu" class="show-menu" style="background: rgb(28, 137, 131)" @click="showVisibility">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="feather feather-menu" style="color: white; transform: rotate(90deg)"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
    </div>
    </div>
</template>

<script>
    export default {
        name: 'menuIcon',
        data () {
            return {
                showMenu: true
            }
        },
        methods: {
            showVisibility () {
                this.showMenu = !this.showMenu;
            }
        }
    };
</script>

<style>
    .show-menu {
        background: white;
        border: none;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        position: absolute;
        right: 20px;
        top: 40px;
        text-align: center;
        padding: 9px 0;
        cursor: pointer;
    }
</style>
