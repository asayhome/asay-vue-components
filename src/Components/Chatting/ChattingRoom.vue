<template>
  <div class="row mt-3">
    <div class="col-md-2">
      <div
        v-for="(user, index) in usersList"
        :key="index"
        @click="switchTo(user)"
        class="symbol symbol-35 symbol-circle"
      >
        <img alt="Pic" :src="defaultAvatar" />
        <p>{{ user?.name }}</p>
      </div>
    </div>
    <div class="col-md-10">
      <div
        class="scroll"
        style="max-height: 400px; overflow-y: scroll"
        id="chat_div"
      >
        <div class="messages">
          <div
            v-for="(message, index) in messages"
            :key="index"
            :class="
              'd-flex justify-content-' +
              (message.sender_id == senderId ? 'start' : 'end')
            "
          >
            <div
              :class="
                'd-flex flex-column align-items-' +
                (message.sender_id == senderId ? 'start' : 'end')
              "
            >
              <div class="d-flex align-items-center">
                <template v-if="message.sender_id == senderId">
                  <div class="symbol symbol-35px symbol-circle">
                    <img
                      alt="Pic"
                      :src="
                        message?.sender?.picture
                          ? message?.sender?.picture
                          : defaultAvatar
                      "
                    />
                  </div>
                  <div class="ms-3">
                    <a
                      href="#"
                      class="
                        fs-5
                        fw-bolder
                        text-gray-900 text-hover-primary
                        me-1
                      "
                    >
                      {{ message?.sender?.name }}
                    </a>
                    <br />
                    <span class="text-muted fs-7 mb-1">
                      {{ message.created_time }}
                    </span>
                  </div>
                </template>
                <template v-else>
                  <div class="me-3">
                    <a
                      href="#"
                      class="
                        fs-5
                        fw-bolder
                        text-gray-900 text-hover-primary
                        ms-1
                      "
                    >
                      {{ message.sender?.name }}
                    </a>
                    <br />
                    <span class="text-muted fs-7 mb-1">
                      {{ message.created_time }}
                    </span>
                  </div>
                  <div class="symbol symbol-35px symbol-circle">
                    <img
                      alt="Pic"
                      :src="
                        message?.sender?.picture
                          ? message?.sender?.picture
                          : defaultAvatar
                      "
                    />
                  </div>
                </template>
              </div>
              <div
                :class="
                  'p-5 rounded bg-light-' +
                  (message.sender_id == senderId ? 'info' : 'primary') +
                  ' text-dark fw-bold w-100 mw-lg-400px text-' +
                  (message.sender_id == senderId ? 'start' : 'end')
                "
                data-kt-element="message-text"
              >
                <p v-html="message.message"></p>
                <div v-if="message.attachments">
                  <span
                    v-for="(attachment, index) in message?.attachments"
                    :key="index"
                  >
                    <i
                      @click="download(attachment)"
                      class="bi bi-paperclip fs-3"
                    ></i
                  ></span>
                </div>
              </div>
            </div>
          </div>
          <span v-if="messages.length == 0">{{
            __("You do not have messages until now")
          }}</span>
          <!--end::Message In-->
        </div>
        <!--end::Messages-->
      </div>
    </div>
  </div>
  <div class="row mt-3">
    <div class="col-md-12">
      <textarea
        v-model="form.message"
        class="form-control border-0 p-0"
        rows="2"
        :placeholder="__('Type her')"
      ></textarea>
      <span v-if="form.errors.message" class="text-danger">
        {{ form.errors.message }}
      </span>
      <div class="d-flex align-items-center justify-content-between mt-5">
        <div class="mr-3">
          <label for="attachments" class="btn">
            <i class="bi bi-upload fs-3"></i>
            <span style="margin-right: 5px; margin-left: 5px">{{
              __("Add attachments")
            }}</span>
            <span v-if="form.attachments">
              ({{ form.attachments.length }})
            </span>
          </label>
          <input
            id="attachments"
            @input="form.attachments = $event.target.files"
            type="file"
            style="display: none"
            name="attachments"
            multiple
          />
        </div>
        <div>
          <button
            @click="send()"
            class="
              btn btn-primary btn-md
              text-uppercase
              font-weight-bold
              chat-send
            "
          >
            {{ __("Send") }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useForm } from "@inertiajs/vue3";
import NProgress from "nprogress";
import Axios from "axios";
import _ from "lodash";
import { ref } from "vue";

export default {
  props: {
    group: String,
    groupId: Number,
    senderId: Number,
    receiverId: Number,
    showUserList: {
      default: true,
    },
    getMessagesUrl: {
      default: null,
    },
    getUsersUrl: {
      default: null,
    },
    sendMessageUrl: {
      default: null,
    },
    defaultAvatar: {
      default: "/assets/img/avatar.png",
    },
  },
  setup(props) {
    let form = ref(
      useForm({
        group: props.group,
        group_id: props.groupId,
        sender_id: props.senderId,
        receiver_id: props.receiverId ? props.receiverId : "*",
        attachments: [],
        message: null,
      })
    );

    let usersList = ref([]);
    let messages = ref([]);
    let search = ref(null);
    return {
      form,
      messages,
      search,
      usersList,
    };
  },
  methods: {
    getMessages() {
      NProgress.start();
      Axios.post(this.getMessagesUrl, {
        group: this.group,
        group_id: this.groupId,
        sender_id: this.senderId,
        receiver_id: this.form.receiver_id,
      }).then((res) => {
        if (res.data.success) {
          this.messages = res.data.messages;
          // scroll down to last message
          setTimeout(() => {
            var objDiv = document.getElementById("chat_div");
            if (objDiv?.scrollHeight) {
              objDiv.scrollTop = objDiv.scrollHeight;
            }
          }, 1000);
        }
        NProgress.done();
      });
    },
    getUsersList() {
      NProgress.start();
      Axios.post(this.getUsersUrl, {
        group: this.group,
        group_id: this.groupId,
        sender_id: this.senderId,
      }).then((res) => {
        if (res.data.success) {
          this.usersList = res.data.users;
        }
        NProgress.done();
      });
    },
    getImageUrl(image) {
      if (typeof image === "string") {
        return "/storage/" + image;
      } else {
        return URL.createObjectURL(image);
      }
    },
    viewImages(id, image) {
      let images = [];
      this.messages.forEach((message) => {
        if (message.id == id) {
          message.attachments.forEach((attachment) => {
            images.push({
              path: "/storage/" + attachment,
              title: "",
              selected: attachment == image,
            });
          });
        }
      });
      this.openImagesViewer(images);
    },
    switchTo(user) {
      this.form.receiver_id = user.id;
      this.getMessages();
    },
    async send() {
      await this.form.post(this.sendMessageUrl, {
        preserveScroll: true,
        onSuccess: () => {
          if (!this.form.hasErrors) {
            this.form.message = null;
            this.form.attachments = [];
            this.getMessages();
          }
        },
        onError: (error) => {
          console.log(error);
        },
      });
    },
    refreshData() {
      this.getUsersList();
      this.getMessages();
    },
    download(attachment) {
      let path = "/storage/" + attachment;
      let extension = path.split(".").pop();
      this.downloadFile(path, "file", extension);
    },
  },
  watch: {},
  mounted() {
    this.refreshData();
  },
};
</script>

<style>
</style>
