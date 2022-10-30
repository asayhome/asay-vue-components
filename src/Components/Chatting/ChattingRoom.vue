<template>
  <div>
    <div class="d-flex flex-row">
      <div
        v-if="showUserList"
        class="flex-row-auto offcanvas-mobile w-350px w-xl-300px"
        id="kt_chat_aside"
      >
        <!--begin::Card-->
        <div class="card card-custom">
          <!--begin::Body-->
          <div class="card-body">
            <!--begin:Search-->
            <div class="input-group input-group-solid">
              <div class="input-group-prepend">
                <span class="input-group-text">
                  <span class="svg-icon svg-icon-lg">
                    <i class="fa fa-search"></i>
                  </span>
                </span>
              </div>
              <input
                @input="search = $event.target.value"
                type="text"
                class="form-control py-4 h-auto"
                :placeholder="__('Search her')"
              />
            </div>
            <!--end:Search-->
            <!--begin:Users-->
            <div class="mt-7 scroll scroll-pull">
              <!--begin:Users-->
              <div
                v-for="(user, index) in usersList"
                :key="index"
                @click="switchTo(user)"
                class="d-flex align-items-center justify-content-between mb-5"
                :style="
                  'background-color:' +
                  (user.id == form.receiver_id ? '#fdf4de' : '')
                "
              >
                <div class="d-flex align-items-center">
                  <div class="symbol symbol-circle symbol-50 mr-3">
                    <img alt="Pic" :src="user.picture" />
                  </div>
                  <div class="d-flex flex-column">
                    <a
                      style="cursor: pointer"
                      class="
                        text-dark-75 text-hover-primary
                        font-weight-bold font-size-lg
                      "
                    >
                      {{ user.name }}
                    </a>
                    <span v-if="user.unread" class="badge bg-danger">
                      {{ user.unread }}
                    </span>
                  </div>
                </div>
                <div class="d-flex flex-column align-items-end">
                  <!-- <span class="text-muted font-weight-bold font-size-sm m-1"
                    >35 mins</span
                  > -->
                </div>
              </div>
              <!--end:Users-->
            </div>
            <!--end:Users-->
          </div>
          <!--end::Body-->
        </div>
        <!--end::Card-->
      </div>
      <div class="flex-row-fluid ml-lg-10" id="kt_chat_content">
        <div class="card card-custom">
          <div
            v-if="showUserList"
            class="card-header align-items-center px-4 py-3"
          >
            <div class="text-left flex-grow-1">
              <!--begin::Aside Mobile Toggle-->
              <button
                type="button"
                class="btn btn-clean btn-sm btn-icon btn-icon-md d-lg-none"
                id="kt_app_chat_toggle"
              >
                <span class="svg-icon svg-icon-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    xmlns:xlink="http://www.w3.org/1999/xlink"
                    width="24px"
                    height="24px"
                    viewBox="0 0 24 24"
                    version="1.1"
                  >
                    <g
                      stroke="none"
                      stroke-width="1"
                      fill="none"
                      fill-rule="evenodd"
                    >
                      <rect x="0" y="0" width="24" height="24" />
                      <path
                        d="M18,2 L20,2 C21.6568542,2 23,3.34314575 23,5 L23,19 C23,20.6568542 21.6568542,22 20,22 L18,22 L18,2 Z"
                        fill="#000000"
                        opacity="0.3"
                      />
                      <path
                        d="M5,2 L17,2 C18.6568542,2 20,3.34314575 20,5 L20,19 C20,20.6568542 18.6568542,22 17,22 L5,22 C4.44771525,22 4,21.5522847 4,21 L4,3 C4,2.44771525 4.44771525,2 5,2 Z M12,11 C13.1045695,11 14,10.1045695 14,9 C14,7.8954305 13.1045695,7 12,7 C10.8954305,7 10,7.8954305 10,9 C10,10.1045695 10.8954305,11 12,11 Z M7.00036205,16.4995035 C6.98863236,16.6619875 7.26484009,17 7.4041679,17 C11.463736,17 14.5228466,17 16.5815,17 C16.9988413,17 17.0053266,16.6221713 16.9988413,16.5 C16.8360465,13.4332455 14.6506758,12 11.9907452,12 C9.36772908,12 7.21569918,13.5165724 7.00036205,16.4995035 Z"
                        fill="#000000"
                      />
                    </g>
                  </svg>
                </span>
              </button>
            </div>
            <div class="text-left flex-grow-1"></div>
            <div class="text-center text-center">
              <div class="symbol-group symbol-hover justify-content-center">
                <div
                  v-if="(user, index) in usersList"
                  :key="index"
                  @click="switchTo(user)"
                  class="symbol symbol-35 symbol-circle"
                  data-toggle="tooltip"
                  :title="user.name"
                >
                  <img alt="Pic" :src="user.picture" />
                </div>
                <!-- <div
                  class="symbol symbol-35 symbol-circle symbol-light-success"
                  data-toggle="tooltip"
                  title="Invite someone"
                >
                  <span class="symbol-label font-weight-bold">0+</span>
                </div> -->
              </div>
            </div>
            <div class="text-right flex-grow-1"></div>
          </div>
          <template v-if="form.receiver_id && form.receiver_id != '*'">
            <div class="card-body">
              <div
                class="scroll"
                style="max-height: 400px; overflow-y: scroll"
                id="chat_div"
              >
                <div class="messages">
                  <!--begin::Message In-->
                  <div
                    v-for="(message, index) in messages"
                    :key="index"
                    :class="
                      'd-flex justify-content-' +
                      (message.sender_id == senderId ? 'start' : 'end') +
                      ' mb-10'
                    "
                  >
                    <div
                      :class="
                        'd-flex flex-column align-items-' +
                        (message.sender_id == senderId ? 'start' : 'end')
                      "
                    >
                      <div class="d-flex align-items-center mb-2">
                        <template v-if="message.sender_id == senderId">
                          <div class="symbol symbol-35px symbol-circle">
                            <img alt="Pic" :src="message.sender.picture" />
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
                              {{ message.sender.name }}
                            </a>
                            <br />
                            <span class="text-muted fs-7 mb-1">
                              {{ __(message.sender.description) }}
                            </span>
                            <br />
                            <span class="text-muted fs-7 mb-1">
                              {{ message.created_at }}
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
                              {{ message.sender.name }}
                            </a>
                            <br />
                            <span class="text-muted fs-7 mb-1">
                              {{ __(message.sender.description) }}
                            </span>
                            <br />
                            <span class="text-muted fs-7 mb-1">
                              {{ message.created_at }}
                            </span>
                          </div>
                          <div class="symbol symbol-35px symbol-circle">
                            <img alt="Pic" :src="message.sender.picture" />
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

                        <br />
                        <ul
                          style="display: inline-block; list-style-type: none"
                        >
                          <li
                            v-for="(attachment, index) in message.attachments"
                            :key="index"
                            style="
                              display: inline-block;
                              height: 55px;
                              margin: 1px;
                              border: 1px solid gray;
                              cursor: pointer;
                            "
                          >
                            <a @click="viewImages(message.id, attachment)">
                              <img
                                style="width: 50px; height: 50px"
                                :src="getImageUrl(attachment)"
                              />
                            </a>
                          </li>
                        </ul>
                        <p style="text-align: left; padding: 0px; margin: 0px">
                          <i
                            style="font-size: 10px; margin: 0px; padding: 0px"
                            class="flaticon2-check-mark p-0 m-0"
                          ></i>
                          <i
                            v-if="message.read_at"
                            style="font-size: 10px; margin: 0px; padding: 0px"
                            class="flaticon2-check-mark p-0 m-0"
                          ></i>
                        </p>
                      </div>
                    </div>
                  </div>
                  <span v-if="messages.length == 0">{{
                    __("You do not have new messages")
                  }}</span>
                  <!--end::Message In-->
                </div>
                <!--end::Messages-->
              </div>
              <!--end::Scroll-->
            </div>
            <div class="card-footer align-items-center">
              <textarea
                v-model="form.message"
                class="form-control border-0 p-0"
                rows="2"
                :placeholder="__('Type her')"
              ></textarea>
              <span v-if="form.errors.message" class="text-danger">
                {{ form.errors.message }}
              </span>
              <div
                class="d-flex align-items-center justify-content-between mt-5"
              >
                <div class="mr-3">
                  <!-- <a class="btn btn-clean btn-icon btn-md mr-1"
                      >
                      <i class="flaticon2-photograph icon-lg"></i>
                      </a> -->
                  <label
                    for="attachments"
                    class="btn btn-clean btn-icon btn-md"
                  >
                    <i class="flaticon2-photo-camera icon-lg"></i>
                  </label>
                  <input
                    id="attachments"
                    @input="form.attachments = $event.target.files"
                    type="file"
                    style="display: none"
                    name="attachments"
                    multiple
                  />
                  <ul style="display: inline" v-if="form.attachments.length">
                    <li
                      v-for="(attachment, index) in form.attachments"
                      :key="index"
                      style="display: inline; margin: 1px"
                    >
                      <img
                        style="width: 50px; height: 50px"
                        :src="getImageUrl(attachment)"
                      />
                    </li>
                  </ul>
                </div>
                <div>
                  <button
                    @click="send()"
                    class="
                      btn btn-primary btn-md
                      text-uppercase
                      font-weight-bold
                      chat-send
                      py-2
                      px-6
                    "
                  >
                    {{ __("Send") }}
                  </button>
                </div>
              </div>
            </div>
          </template>
          <div v-else class="card">
            <div class="card-body">
              {{ __("Choose the person you want to talk to first") }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "@vue/reactivity";
import { useForm } from "@inertiajs/inertia-vue3";
import NProgress from "nprogress";
import Axios from "axios";
import _ from "lodash";

export default {
  props: {
    group: String,
    groupId: {
      default: null,
    },
    senderId: {
      default: null,
    },
    receiverId: {
      default: null,
    },
    showUserList: {
      default: true,
    },
    workedRoute: {
      default: null,
    },
  },
  setup(props) {
    let form = ref(
      useForm({
        group: props.group,
        group_id: props.groupId,
        sender_id: props.senderId,
        receiver_id: props.receiverId,
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
      if (route().current(this.workedRoute)) {
        NProgress.start();
        Axios.post(route("chattings.getMessages"), {
          group: this.group,
          group_id: this.groupId,
          sender_id: this.senderId,
          receiver_id: this.form.receiver_id,
        }).then((res) => {
          if (res.data.success) {
            this.messages = res.data.messages;
            // scroll down to last message
            var objDiv = document.getElementById("chat_div");
            if (objDiv?.scrollHeight) {
              objDiv.scrollTop = objDiv.scrollHeight;
            }
          }
          NProgress.done();
        });
      }
    },
    getUsersList() {
      NProgress.start();
      Axios.post(route("chattings.getUsersList"), {
        group: this.group,
        group_id: this.groupId,
        sender_id: this.senderId,
        search: this.search,
      }).then((res) => {
        if (res.data.success) {
          this.usersList = res.data.usersList;
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
      await this.form.post(route("chattings.sendMessage"), {
        preserveScroll: true,
        onSuccess: (data) => {
          if (!this.form.hasErrors) {
            this.form.message = null;
            this.getMessages();
          }
        },
      });
    },
  },
  watch: {
    search: function (newVal, oldVal) {
      this.getUsersList();
    },
  },
  mounted() {
    this.getUsersList();

    this.getMessages();
    setInterval(() => {
      this.getMessages();
    }, 5000);
  },
};
</script>

<style>
</style> 