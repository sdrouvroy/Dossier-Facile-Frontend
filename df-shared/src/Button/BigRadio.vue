<template>
  <button
    class="br"
    :class="{ selected: isEqual(value, val), big: big }"
    @click="setValue()"
    type="button"
  >
    <slot></slot>
  </button>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class BigRadio extends Vue {
  @Prop() val!: unknown;
  @Prop() value!: unknown;
  @Prop({ default: false }) big!: boolean;

  setValue() {
    this.$emit("input", this.val);
  }

  isEqual(value: any, val: any) {
    if (value.key && val.key) {
      return value.key === val.key;
    }
    return value === val;
  }
}
</script>

<style scoped lang="scss">
.br {
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  margin-right: 0.5rem;
  font-size: 14px;
  line-height: 24px;
  cursor: pointer;
  border: solid 1px var(--primary);
  border-radius: 0.5rem;
  text-align: center;
  background-color: var(--background-default-grey);
  @media all and (min-width: 992px) {
    max-width: 15rem;
  }
  @media all and (max-width: 767px) {
    margin-right: 0;
    width: 100%;
  }

  &:hover {
    background-color: var(--primary);
    border: 1px solid #2b8bf7;
    color: white;
    box-shadow: 0 0 0.666em rgba(0, 0, 0, 0.25);
    &.big {
      @media all and (min-width: 767px) {
        background-color: var(--bf200-bf300);
        color: var(--g800);
      }
      border: solid 1px var(--primary);
    }
  }

  &.selected {
    border: 1px solid #2b8bf7;
    background-color: var(--primary);
    color: white;
    &.big {
      @media all and (min-width: 767px) {
        background-color: var(--bf200-bf300);
        color: var(--g800);
      }
      border: solid 1px var(--primary);
    }
  }
}

.big {
  @media all and (min-width: 992px) {
    height: 12rem;
    width: 10rem;
  }
  width: 100%;
  padding: 1rem;
  font-size: 1rem;
  margin: 0;
}

.small {
  color: none;
  &.selected {
    background-color: var(--primary);
    color: white;
  }
}
</style>
