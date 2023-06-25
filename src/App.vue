<template>
  <div>
    <Popup v-if="showModal" @close="closeModal" />
  </div>
</template>

<script>
import Popup from '@/components/Popup.vue';

export default {
  name: 'CustomPopup',
  components: {
    Popup
  },
  data() {
    return {
      showModal: false
    };
  },
  mounted() {
    setTimeout(() => {
      this.openModal();
    }, 2000);
  },
  methods: {
    openModal() {
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    }
  }
};
</script>

<style>

</style>
