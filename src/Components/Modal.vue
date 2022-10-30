<template>
  <div
    class="modal fade"
    :id="id"
    tabindex="-1"
    role="dialog"
    :aria-labelledby="id"
    aria-hidden="true"
  >
    <div
      :class="
        'modal-dialog modal-dialog-centered modal-' +
        size +
        (scrollable ? ' modal-dialog-scrollable' : '')
      "
      role="document"
    >
      <div class="modal-content">
        <div class="modal-header" v-if="hasHeader">
          <h5 class="modal-title" v-if="title">
            {{ title }}
          </h5>
          <i class="fas fa-close" @click="close"></i>
        </div>
        <div class="modal-body">
          <slot />
        </div>
        <div class="modal-footer" v-if="hasFooter">
          <slot name="footer">
            <button
              type="button"
              class="btn btn-light-primary font-weight-bold"
              @click="close"
            >
              {{ __("Close") }}
            </button>
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    id: {
      default: "modal",
    },
    hasHeader: {
      default: true,
    },
    hasFooter: {
      default: true,
    },
    size: {
      default: "lg",
    },
    scrollable: {
      default: true,
    },
    title: String,
  },
  methods: {
    show() {
      $("#" + this.id).modal("show");
    },
    close() {
      $("#" + this.id).modal("hide");
    },
  },
};
</script>

<style>
</style>