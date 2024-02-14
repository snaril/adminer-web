<template>
  <div>
    <input type="text" :value="parentProp" @input="updateValue" />
  </div>
</template>

<script>
export default {
  props: ['parentProp'],
  methods: {
    updateValue(event) {
      this.$emit('update:parentProp', event.target.value);
    }
  },
  
};
</script>