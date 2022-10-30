<template>
  <div>
    <div v-for="message in messages?.data" :key="message.id" class="row mt-2">
      <div class="col-md-12 rounded p-3" style="background-color: #e2e0e9">
        <div class="d-flex flex-row justify-content-between">
          <div>
            <strong>
              {{ message.title }}
            </strong>
          </div>
          <div class="d-flex flex-row">
            <a @click="select(message)" class="btn btn-primary m-1">
              <span>{{ __("Select") }}</span>
            </a>
            <a @click="display(message.id)" class="btn btn-dark m-1">
              {{ __("Display") }}
            </a>
            <a @click="edit(message)" class="btn btn-success m-1">
              <span>{{ __("Edit") }}</span>
            </a>
            <a @click="deleteMessage(message.id)" class="btn btn-danger m-1">
              {{ __("Delete") }}
            </a>
          </div>
        </div>
        <p>{{ message.description }}</p>
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
    <div class="row mt-3">
      <div class="col-md-2">
        <label for="">{{ __("Description") }}</label>
      </div>
      <div class="col-md-10">
        <textarea
          rows="5"
          class="form-control"
          id="description"
          v-model="form.description"
        ></textarea>
        <div>
          <span v-if="errors?.description" class="text-danger">{{
            errors.description
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
import Paginations from "./Paginations.vue";
import NProgress from "nprogress";
import Swal from "sweetalert2";

export default {
  components: { Paginations },
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
      description: null,
      pageNo: 1,
      action: "save",
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
      this.form.action = "update";
      this.form.id = message.id;
      this.form.title = message.title;
      this.form.content = message.content;
      this.$refs.alertsEditorRef.setContent(message.content);
      this.form.description = message.description;
    },
    select(message) {
      this.$emit("setMessage", message);
    },
    deleteMessage(id) {
      NProgress.start();
      axios
        .post(this.deleteRouteUrl, { id: id })
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
          if (!res.data.success) {
            this.errors = res.data.errors;
          } else {
            this.errors = {};
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
            this.form.content = null;
            this.$refs.alertsEditorRef.setContent("");
            this.form.description = null;
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
    //this.getMessages();
  },
};
</script>
  
  <style>
</style>