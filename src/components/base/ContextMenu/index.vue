<template>
    <div class="context-menu">
            
    </div>
</template>


<script>
export default {
    name: 'context',
    props: {
        item: {
            type: Array[Object],
            required: false,
            default: [{
                icon: require('@/assets/svg/icons/missing.svg'),
                text: 'No Context Menu',
                bg: '#ffff'
            }]
        }
    }
}
</script>


<style scoped>

</style>