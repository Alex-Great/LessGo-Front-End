<template>
    <svg xmlns="http://www.w3.org/2000/svg" :width="size" viewBox="0 0 15.219 15.22"><defs></defs><g transform="translate(0 0)"><g transform="translate(0 0)"><path :style="{'fill': color}" d="M14.21,21.72A7.61,7.61,0,1,0,6.6,14.11,7.614,7.614,0,0,0,14.21,21.72Zm0-14.155A6.545,6.545,0,1,1,7.665,14.11,6.546,6.546,0,0,1,14.21,7.565Z" transform="translate(-6.6 -6.5)"/><path :style="{'fill': color}" d="M58.2,39.461h2.331a.5.5,0,1,0,0-.991H58.691V35.6a.5.5,0,1,0-.991,0v3.37A.49.49,0,0,0,58.2,39.461Z" transform="translate(-51.202 -31.203)"/></g></g></svg>
</template> 

<script>
    export default{
        name: 'clockIcon',
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
    };
</script>