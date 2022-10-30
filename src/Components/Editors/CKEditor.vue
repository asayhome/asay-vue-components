<template>
  <div class="row">
    <div class="col-md-2" v-if="label">
      {{ label }}
    </div>
    <div class="col-md-10" :class="{ 'col-md-12': !label }">
      <div v-if="action != 'show'">
        <ckeditor
          :editor="editor"
          v-model="editorData"
          :config="editorConfig"
        ></ckeditor>
        <span v-if="errorMessage" class="text-danger">
          {{ errorMessage }}
        </span>
      </div>
      <div v-else v-html="editorData"></div>
    </div>
  </div>
</template>

<script>
import CKEditor from "@ckeditor/ckeditor5-vue";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import "@ckeditor/ckeditor5-build-classic/build/translations/ar";
import "@ckeditor/ckeditor5-build-classic/build/translations/en-au";

import { ref } from "vue";

export default {
  components: {
    ckeditor: CKEditor.component,
  },
  props: {
    lang: {
      default: "ar",
    },
    label: String,
    action: String,
    modelValue: {
      default: "",
    },
    errorMessage: {
      default: null,
    },
  },
  setup(props) {
    let editorConfig = ref({
      language: props.lang,
    });
    let editorData = ref(props.modelValue ? props.modelValue : "");
    return {
      editorConfig,
      editorData,
    };
  },
  watch: {
    modelValue: function (newVal) {
      this.editorData = newVal;
    },
    editorData: function (newVal) {
      this.$emit("update:modelValue", newVal);
    },
  },
  data() {
    return {
      editor: ClassicEditor,
    };
  },
  mounted() {},
};
</script>

<style>
</style>