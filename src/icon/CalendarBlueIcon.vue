<template>
    <svg xmlns="http://www.w3.org/2000/svg" :width="size" viewBox="0 0 16 16"><defs></defs><path :style="{'fill': color}" d="M0,9.614H0L0,0H14.932V9.556ZM10,6.743h0v1.4h2.028v-1.4Zm-3.55,0h0v1.4H8.478v-1.4Zm-3.55,0h0v1.4H4.927v-1.4ZM10,4.413h0v1.4h2.028v-1.4Zm-3.55,0h0v1.4H8.478v-1.4Zm-3.55,0h0v1.4H4.927v-1.4ZM10,2.084v1.4h2.028v-1.4Zm-3.55,0v1.4H8.478v-1.4Zm-3.55,0v1.4H4.927v-1.4Z" transform="translate(0.536 5.672)"/><path  :style="{'fill': color}" d="M14.667,1.5H12.5V.5a.5.5,0,0,0-1,0v1h-3V.5a.5.5,0,1,0-1,0v1h-3V.5a.5.5,0,1,0-1,0v1H1.334A1.333,1.333,0,0,0,0,2.833V14.667A1.333,1.333,0,0,0,1.334,16H14.667A1.333,1.333,0,0,0,16,14.667V2.833A1.333,1.333,0,0,0,14.667,1.5ZM15,14.667a.334.334,0,0,1-.333.334H1.334A.334.334,0,0,1,1,14.667V2.833A.334.334,0,0,1,1.334,2.5H3.5v1a.5.5,0,1,0,1,0v-1h3v1a.5.5,0,1,0,1,0v-1h3v1a.5.5,0,0,0,1,0v-1h2.167A.334.334,0,0,1,15,2.833Z" transform="translate(0 0)"/></svg>
</template>

<script>
export default {
    name: 'calendarBlueIcon',
    props: {
        size: {
            type: Number,
            required: false,
            default: 10
        },
        color: {
            type: String,
            required: false,
            default: 'grey'
        }
    }
}
</script>