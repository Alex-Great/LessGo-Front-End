<template>
    <svg :width="size" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
      viewBox="0 0 405.526 405.526" style="enable-background:new 0 0 405.526 405.526;"
     xml:space="preserve">
<g>
    <path :style="{'fill': color}" d="M202.764,0C90.958,0,0,90.958,0,202.763c0,111.809,90.958,202.764,202.763,202.764
        c111.808,0,202.763-90.955,202.763-202.764C405.526,90.958,314.571,0,202.764,0z M22.952,202.763
        c0-99.146,80.665-179.811,179.812-179.811v359.623C103.616,382.574,22.952,301.91,22.952,202.763z"/>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
</svg>
</template>

<script>
export default {
    name: 'halfCircleIcon',
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