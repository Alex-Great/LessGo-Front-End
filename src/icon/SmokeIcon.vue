<template>
    <svg :width="size" id="Capa_1" enable-background="new 0 0 512 512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><g><path d="m452 213.197h-271l-30 30v30 30l30 30h271l30-30v-30-30z" fill="#edf5ff"/><path d="m181 333.197h271l30-30v-30h-331v30z" fill="#d5e8fe"/><path d="m452 123.197c0-33.091-26.909-60-60-60h-136c-8.276 0-15-6.724-15-15s6.724-15 15-15v-30c-24.814 0-45 20.186-45 45s20.186 45 45 45h45c0 33.091 26.909 60 60 60h91c16.538 0 30 13.462 30 30h30c0-33.091-26.909-60-60-60zm-121-30h61c16.538 0 30 13.462 30 30h-61c-16.538 0-30-13.462-30-30z" fill="#d5e8fe"/><path d="m0 213.197v60 60h181v-60-60z" fill="#fed843"/><path d="m0 273.197h181v60h-181z" fill="#fabe2c"/><path d="m452 213.197v60 60h60v-60-60z" fill="#ff6c6c"/><path d="m452 273.197h60v60h-60z" fill="#e63950"/><path d="m292.211 273.197-265.606-265.605-21.21 21.211 244.394 244.394 235.606 235.606 21.21-21.211z" fill="#ff6c6c"/><path d="m506.605 487.592-214.394-214.395h-42.422l235.606 235.606z" fill="#e63950"/></g></svg>
</template>

<script>
export default {
    name: 'smokeIcon',
    props: {
        size: {
            type: Number,
            required: false,
            default: 10
        }
    }
}
</script>