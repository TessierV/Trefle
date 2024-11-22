<template>
    <div class="content-section">
        <div class="content-container">
            <slot></slot>
        </div>
    </div>
</template>

<style scoped>
.content-section {
    @apply w-full lg:w-2/3 bg-white rounded-lg shadow-xl;
}

.content-container {
    @apply p-4 lg:p-6;
}
</style>
