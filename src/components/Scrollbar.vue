<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useEventListener } from '@vueuse/core'

const scrollContainer = ref(null)
const santasSleigh = ref(null)
const isDown = ref(false)
let startX
let scrollLeft

const handleMouseDown = (e) => {
  isDown.value = true
  startX = e.pageX - santasSleigh.value.offsetLeft
  scrollLeft = scrollContainer.value.scrollLeft
}

const handleMouseMove = (e) => {
  if (!isDown.value) return
  e.preventDefault()
  const x = e.pageX - scrollContainer.value.offsetLeft
  const walk = (x - startX) * 3 // The * 3 is the speed of the scroll
  scrollContainer.value.scrollLeft = scrollLeft - walk
}

const handleMouseUp = () => {
  isDown.value = false
}

onMounted(() => {
  useEventListener(document, 'mousemove', handleMouseMove)
  useEventListener(document, 'mouseup', handleMouseUp)
  useEventListener(scrollContainer, 'scroll', () => {
    const maxScrollLeft = scrollContainer.value.scrollWidth - scrollContainer.value.clientWidth
    const scrollPercent = scrollContainer.value.scrollLeft / maxScrollLeft
    const maxSleighX = scrollContainer.value.clientWidth - santasSleigh.value.offsetWidth
    santasSleigh.value.style.left = `${scrollPercent * maxSleighX}px`
  })
})

onUnmounted(() => {
  // Clean up event listeners if necessary
})
</script>

<style scoped>
.scroll-container {
  overflow: hidden;
  position: relative;
}

.horizontal-content {
  width: 2000px; /* Adjust as needed */
  position: relative;
}

.sleigh {
  position: absolute;
  top: 10px; /* Adjust as needed */
  cursor: pointer;
  /* Add your sleigh styling here */
}
</style>

<template>
  <div class="scroll-container" ref="scrollContainer">
    <div class="horizontal-content">
      <!-- Your long horizontal content goes here -->
    </div>
    <div ref="santasSleigh" class="sleigh" @mousedown="handleMouseDown">
      <!-- Santa's sleigh image or element -->
    </div>
  </div>
</template>
