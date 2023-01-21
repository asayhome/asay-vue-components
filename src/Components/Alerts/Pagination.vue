<template>
  <div v-if="links?.length > 0">
    <div class="d-flex flex-wrap -mb-1">
      <template v-for="(link, k) in links" :key="k">
        <div
          v-if="link.url === null"
          style="cursor: pointer"
          class="
            mr-1
            mb-1
            px-4
            py-3
            text-sm
            leading-4
            text-gray-400
            border
            rounded
          "
          v-html="link.label"
        />
        <Link
          v-else-if="!getPageNumberOnly"
          style="cursor: pointer"
          class="
            mr-1
            mb-1
            px-4
            py-3
            text-sm
            leading-4
            border
            rounded
            hover:bg-white
            focus:border-indigo-500 focus:text-indigo-500
          "
          :class="{ 'bg-primary text-white': link.active }"
          :href="link.url"
          v-html="link.label"
        />
        <a
          v-else
          style="cursor: pointer"
          class="
            mr-1
            mb-1
            px-4
            py-3
            text-sm
            leading-4
            border
            rounded
            hover:bg-white
            focus:border-indigo-500 focus:text-indigo-500
          "
          :class="{ 'bg-primary text-white': link.active }"
          v-html="link.label"
          @click="pressedLink(link)"
        />
      </template>
    </div>
  </div>
</template>



  <script>
import { Link } from "@inertiajs/vue3";
export default {
  components: {
    Link,
  },
  props: {
    links: Array,
    getPageNumberOnly: {
      default: false,
    },
  },
  methods: {
    pressedLink(link) {
      let value = link.label;
      if (link.label.includes("التالي") || link.label.includes("next")) {
        value = "next";
      } else if (
        link.label.includes("السابق") ||
        link.label.includes("previous")
      ) {
        value = "previous";
      }
      this.$emit("pageNo", value);
    },
  },
};
</script>
