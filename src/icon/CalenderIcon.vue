<template>
<svg :width="size" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15.05 15.05">
<defs>
    
</defs>
<g transform="translate(0 0)">
    <path :style="{'fill': color}" d="M13.8,1.411H11.758V.47a.47.47,0,1,0-.941,0v.941H8V.47a.47.47,0,1,0-.941,0v.941H4.233V.47a.47.47,0,1,0-.941,0v.941H1.254A1.254,1.254,0,0,0,0,2.665V13.8A1.254,1.254,0,0,0,1.254,15.05H13.8A1.254,1.254,0,0,0,15.05,13.8V2.665A1.253,1.253,0,0,0,13.8,1.411ZM14.109,13.8a.314.314,0,0,1-.313.314H1.254A.314.314,0,0,1,.941,13.8V2.665a.314.314,0,0,1,.314-.313H3.292v.941a.47.47,0,1,0,.941,0V2.352H7.055v.941a.47.47,0,1,0,.941,0V2.352h2.822v.941a.47.47,0,1,0,.941,0V2.352H13.8a.314.314,0,0,1,.313.313Z"/><rect :style="{'fill': color}" width="1.881" height="1.411" transform="translate(3.292 5.644)"/>
    <rect :style="{'fill': color}" width="1.881" height="1.411" transform="translate(3.292 7.995)"/>
    <rect :style="{'fill': color}" width="1.881" height="1.411" transform="translate(3.292 10.347)"/>
    <rect :style="{'fill': color}" width="1.881" height="1.411" transform="translate(6.584 10.347)"/>
    <rect :style="{'fill': color}" width="1.881" height="1.411" transform="translate(6.584 7.995)"/>
    <rect :style="{'fill': color}" width="1.881" height="1.411" transform="translate(6.584 5.644)"/>
    <rect :style="{'fill': color}" width="1.881" height="1.411" transform="translate(9.877 10.347)"/>
    <rect :style="{'fill': color}" width="1.881" height="1.411" transform="translate(9.877 7.995)"/>
    <rect :style="{'fill': color}" width="1.881" height="1.411" transform="translate(9.877 5.644)"/>
</g>
</svg>
</template>

<script>
export default {
    name: 'calenderIcon',
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