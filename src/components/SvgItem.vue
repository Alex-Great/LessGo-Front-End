<template>
  <span class="svgItem">
    <svg
      v-if="icon === 'profile'"
      :height="computedSize"
      viewBox="0 0 24 24"
      :width="computedSize"
      xmlns="http://www.w3.org/2000/svg"
    >
      <!-- <path
        d="M3 5v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2H5c-1.11 0-2 .9-2 2zm12 4c0 1.66-1.34 3-3 3s-3-1.34-3-3 1.34-3 3-3 3 1.34 3 3zm-9 8c0-2 4-3.1 6-3.1s6 1.1 6 3.1v1H6v-1z"
      ></path>-->
      <!-- <path d="M0 0h24v24H0z" fill="none"></path> -->
    </svg>

    <svg
      v-else-if="icon === 'addPhoto'"
      :height="computedSize"
      viewBox="0 0 24 24"
      :width="computedSize"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
    >
      <defs>
        <path d="M24 24H0V0h24v24z" id="a"></path>
      </defs>
      <clipPath id="b">
        <use overflow="visible" xlink:href="#a"></use>
      </clipPath>
      <path
        clip-path="url(#b)"
        d="M3 4V1h2v3h3v2H5v3H3V6H0V4h3zm3 6V7h3V4h7l1.83 2H21c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2V10h3zm7 9c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-3.2-5c0 1.77 1.43 3.2 3.2 3.2s3.2-1.43 3.2-3.2-1.43-3.2-3.2-3.2-3.2 1.43-3.2 3.2z"
      ></path>
    </svg>

    <svg
      v-else-if="icon === 'home'"
      :height="computedSize"
      viewBox="0 0 24 24"
      :width="computedSize"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"></path>
      <path d="M0 0h24v24H0z" fill="none"></path>
    </svg>

    <svg
      v-else-if="icon === 'message'"
      :height="computedSize"
      viewBox="0 0 19 19"
      :width="computedSize"
      xmlns="http://www.w3.org/2000/svg"
    >
    <g transform="translate(0)">
      <path fill="none" d="M0,0H20.569V20.569H0Z"/>
      <path fill="#1C8983" class="b" d="M3.714,3.714H17.427V14H4.717l-1,1V3.714M3.714,2A1.712,1.712,0,0,0,2.009,3.714L2,19.141l3.428-3.428h12A1.719,1.719,0,0,0,19.141,14V3.714A1.719,1.719,0,0,0,17.427,2ZM5.473,9.515H15.758V11.23H5.473Zm0-3.569H15.758V7.661H5.473Z" transform="translate(-0.286 -0.286)"/>
    </g>
    </svg>

    <svg
      v-else-if="icon === 'bell'"
      :height="computedSize"
      viewBox="0 0 24 24"
      :width="computedSize"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"
      ></path>
    </svg>

    <svg
      v-else-if="icon === 'contact'"
      :height="computedSize"
      viewBox="0 2 20.569 20.569"
      :width="computedSize"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path fill="#1C8983" d="M12,5.9A2.1,2.1,0,1,1,9.9,8,2.1,2.1,0,0,1,12,5.9m0,9c2.97,0,6.1,1.46,6.1,2.1v1.1H5.9V17c0-.64,3.13-2.1,6.1-2.1M12,4a4,4,0,1,0,4,4A4,4,0,0,0,12,4Zm0,9c-2.67,0-8,1.34-8,4v3H20V17C20,14.34,14.67,13,12,13Z"/>
      <path fill="none" d="M0,0H24V24H0Z"/>
    </svg>

    <svg
      v-else-if="icon === 'thumbDown'"
      :height="computedSize"
      viewBox="0 0 24 24"
      :width="computedSize"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M0 0h24v24H0z" fill="none"></path>
      <path
        d="M15 3H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v1.91l.01.01L1 14c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17.79.44 1.06L9.83 23l6.59-6.59c.36-.36.58-.86.58-1.41V5c0-1.1-.9-2-2-2zm4 0v12h4V3h-4z"
      ></path>
    </svg>

    <svg
      v-else-if="icon === 'thumbUp'"
      :height="computedSize"
      viewBox="0 0 24 24"
      :width="computedSize"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M0 0h24v24H0z" fill="none"></path>
      <path
        d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-1.91l-.01-.01L23 10z"
      ></path>
    </svg>

    <svg
      v-else-if="icon === 'add'"
      :height="computedSize"
      viewBox="0 0 16 16"
      :width="computedSize"
      xmlns="http://www.w3.org/2000/svg"
    >
     <path fill="#1C8983" d="M7,16V9H0V7H7V0H9V7h7V9H9v7Z"/>
    </svg>
    <svg
      v-else-if="icon === 'search'"
      :height="computedSize"
      viewBox="0 0 20.569 20.569"
      :width="computedSize"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path fill="#1C8983" d="M15.5,14h-.79l-.28-.27a6.51,6.51,0,1,0-.7.7l.27.28v.79l5,4.99L20.49,19Zm-6,0A4.5,4.5,0,1,1,14,9.5,4.494,4.494,0,0,1,9.5,14Z"/>
      <path fill="none" d="M0,0H24V24H0Z"/>
      <!-- <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path> -->
      <!-- <path d="M0 0h24v24H0z" fill="none"></path> -->
    </svg>
    <svg
      v-else-if="icon === 'trips'"
      :width="computedSize"
      viewBox="0 0 20.678 20.678"
      style="enable-background:new 0 0 20.678 20.678;"
      x="0px"
      y="0px"
      id="Layer_1"
      :height="computedSize"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      xml:space="preserve"
    >
     <g transform="translate(-475.174 -401.906) rotate(-45)">
      <path class="tripsa" d="M2.624,16.621H0V0H2.624a2.174,2.174,0,0,0,.641,1.546,2.172,2.172,0,0,0,1.546.641A2.19,2.19,0,0,0,7,0H9.622V16.619H7a2.187,2.187,0,0,0-4.374,0Z" transform="translate(46.997 626.5)"/>
     <path class="tripsb" d="M56.619,631.851H46.978" transform="translate(0 0.996)"/>
     </g>
    </svg>
</span>
</template>


<script>
export default {
  name: 'svgItem',
  data () {
    return {};
  },
  props: ['icon', 'size'],
  computed: {
    computedSize () {
      if (!this.size) {
        return 48;
      } else {
        return this.size;
      }
    }
  }
};
</script>

<style scoped>
.tripsa,.tripsb{
  fill:none;
  stroke:#1c8983;}
.tripsa{
  stroke-width:1.5px;}
.tripsb{
  stroke-dasharray:2 1;}
.st0{
  fill: #EB5557;
}
svg {
  fill: #000;
}
.profile_image-edit svg {
  fill: #016587;
}
.profile_image-edit:hover svg {
  fill: #0f90bb;
}
.trip-detail-component .profile-info--ratings svg {
  display: inline;
  margin-right: 0.4em;
  vertical-align: middle;
  fill: #fff;
}
.actionbar-bottom .actionbar_item svg {
  fill: #666;
}
.actionbar-bottom .actionbar_item .big svg {
  margin-top: 6px;
  fill: #fff;
}
.actionbar-bottom .actionbar_item .big .svgItem path:first-child {
  stroke: #fff;
}
</style>
