<template>
    <svg :width="size" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
      viewBox="0 0 31.668 31.668" style="enable-background:new 0 0 31.668 31.668;"
     xml:space="preserve">
<g>
    <path :style="{'fill': color}" d="M25.501,5H6.167V0h19.334V5z M0.168,8.889v5H31.5v-5H0.168z M6.167,17.777v5h19.334v-5H6.167z M0.168,31.668H31.5v-5H0.168
        V31.668z"/>
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
    name: 'alignInfoIcon',
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