<template>
  <div>
    <div v-for="message in messages?.data" :key="message.id" class="row mt-2">
      <div class="col-md-12 rounded p-3" style="background-color: #e2e0e9">
        <div class="d-flex flex-row justify-content-between">
          <div>
            <strong> {{ message.title }}#{{ message.id }}# </strong>
          </div>
          <div class="d-flex flex-row">
            <a @click="select(message)" class="btn btn-sm btn-primary m-1 p-2">
              <span>{{ __("Select") }}</span>
            </a>
            <a @click="display(message.id)" class="btn btn-sm btn-dark m-1 p-2">
              {{ __("Display") }}
            </a>
            <a @click="edit(message)" class="btn btn-sm btn-success m-1 p-2">
              <span>{{ __("Edit") }}</span>
            </a>
            <a
              @click="deleteMessage(message.id)"
              class="btn btn-sm btn-danger m-1 p-2"
            >
              {{ __("Delete") }}
            </a>
          </div>
        </div>
        <div v-if="message.id == collapse_id" v-html="message.content"></div>
      </div>
    </div>
    <paginations
      v-if="messages?.links"
      :links="messages.links"
      :getPageNumberOnly="true"
      @pageNo="setPageNo"
    />
  </div>
  <div class="mt-5" v-if="canEdit">
    <h5>
      <strong>{{ __("New reply") }}</strong>
    </h5>
    <div class="row">
      <div class="col-md-2">
        <label for="">{{ __("Title") }}</label>
      </div>
      <div class="col-md-10">
        <input type="text" v-model="form.title" class="form-control" />
        <div>
          <span v-if="errors?.title" class="text-danger">{{
            errors.title
          }}</span>
        </div>
      </div>
    </div>
    <div class="row mt-3">
      <div class="col-md-2">
        <label for="">{{ __("Reply") }}</label>
      </div>
      <div class="col-md-10">
        <asay-ckeditor
          v-model="form.content"
          :errorMessage="form.errors?.content"
        />
        <div>
          <span v-if="errors?.content" class="text-danger">{{
            errors.content
          }}</span>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-md-12">
        <button @click="saveMessage" type="submit" class="btn btn-primary mt-3">
          {{ __("Save") }}
        </button>
      </div>
    </div>
  </div>
</template>
  
  <script>
import { ref } from "vue";
import Pagination from "./Pagination.vue";
import NProgress from "nprogress";
import Swal from "sweetalert2";

export default {
  components: { Pagination },
  props: {
    canEdit: {
      default: true,
    },
    deleteRouteUrl: String,
    getRepliesRouteUrl: String,
    storeRelyRouteUrl: String,
  },
  setup() {
    let form = ref({
      title: null,
      content: null,
      pageNo: 1,
      id: null,
    });
    let errors = ref({});
    let messages = ref([]);
    let collapse_id = ref(null);
    return {
      form,
      errors,
      messages,
      collapse_id,
    };
  },
  methods: {
    setContent(content) {
      this.form.content = content;
    },
    display(id) {
      if (this.collapse_id == id) {
        this.collapse_id = null;
      } else {
        this.collapse_id = id;
      }
    },
    edit(message) {
      console.log(message);
      this.form.id = message.id;
      this.form.title = message.title;
      this.form.content = message.content;
    },
    select(message) {
      this.$emit("setMessage", message);
    },
    deleteMessage(id) {
      NProgress.start();
      axios
        .post(this.deleteRouteUrl, {
          id: id,
        })
        .then((res) => {
          if (res.data.success) {
            Swal.fire({
              text: res.data.msg,
              icon: "success",
              confirmButtonText: this.__("Ok"),
            });
            this.getMessages();
          }
          NProgress.done();
        })
        .catch((err) => {
          NProgress.done();
        });
    },
    setPageNo(pageNo) {
      this.form.pageNo = pageNo;
      this.getMessages();
    },
    getMessages() {
      NProgress.start();
      axios
        .post(this.getRepliesRouteUrl, this.form)
        .then((res) => {
          if (res.data.success) {
            this.messages = res.data.messages;
          }
          NProgress.done();
        })
        .catch((err) => {
          NProgress.done();
        });
    },
    saveMessage() {
      NProgress.start();
      axios
        .post(this.storeRelyRouteUrl, this.form)
        .then((res) => {
          if (!res.data.success) {
            this.errors = res.data.errors;
          } else {
            this.errors = {};
            Swal.fire({
              text: res.data.msg,
              icon: "success",
              confirmButtonText: this.__("Ok"),
            });
            this.form.title = null;
            this.form.content = "";
            this.form.action = "save";
            this.getMessages();
          }
          NProgress.done();
        })
        .catch((err) => {
          NProgress.done();
        });
    },
  },
  mounted() {
    this.getMessages();
  },
};
</script>
  
  <style>
</style>