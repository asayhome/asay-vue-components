<template>
  <div v-if="isAdmin">
    <div class="row mt-5">
      <label class="col-md-12">{{ __("Title") }}</label>
      <div class="col-md-12">
        <input
          type="text"
          v-model="form.title"
          class="form-control"
          style="width: 100%"
        />
        <span v-if="errors?.title" class="text-danger mt-1">{{
          errors.title
        }}</span>
      </div>
    </div>
    <div class="row mt-5">
      <div class="col-md-12">
        <div class="d-flex align-items-center">
          <span class="m-1">{{ __("Message") }}</span>
          <button @click="selectReply" class="btn btn-sm btn-primary m-1">
            {{ __("Select message") }}
          </button>
        </div>
      </div>
      <div class="col-md-12">
        <asay-ckeditor
          v-model="form.message"
          :errorMessage="form.errors?.message"
        />
        <span v-if="errors?.message" class="text-danger mt-1">{{
          errors.message
        }}</span>
      </div>
    </div>
    <div class="row mt-3">
      <div class="col-md-3">
        <div class="form-group row">
          <label class="col-md-12">{{ __("Sending by") }}</label>
          <div class="col-md-12">
            <v-select
              :reduce="(item) => item.value"
              v-model="form.sending_by"
              :options="getDriversList()"
              multiple="true"
            />
            <span v-if="errors?.sending_by" class="text-danger mt-1">{{
              __(errors.sending_by)
            }}</span>
          </div>
        </div>
      </div>
      <div
        v-if="roles.length && form.receiversIds === '*' && showRoles"
        class="col-md-3"
      >
        <div class="form-group row">
          <label class="col-md-12">{{ __("Permissions") }}</label>
          <div class="col-md-12">
            <v-select
              :reduce="(item) => item.value"
              v-model="form.selected_roles"
              :options="getRoles()"
              multiple="true"
            />
            <span v-if="errors?.selected_roles" class="text-danger mt-1">{{
              __(errors.selected_roles)
            }}</span>
          </div>
        </div>
      </div>
      <div class="col-md-3" v-if="showSendTo">
        <div class="form-group row">
          <label class="col-md-12">{{ __("Send to") }}</label>
          <div class="col-md-12">
            <v-select
              :reduce="(item) => item.value"
              v-model="form.received_by"
              :options="receivers"
              :searchable="true"
              :multiple="true"
            />
            <span v-if="errors?.received_by" class="text-danger mt-1">{{
              __(errors.received_by)
            }}</span>
          </div>
        </div>
      </div>
      <div
        v-if="roles.length && form.receiversIds === '*' && showUserStatuses"
        class="col-md-3"
      >
        <div class="form-group row">
          <label class="col-md-12">{{ __("Status") }}</label>
          <div class="col-md-12">
            <v-select
              :reduce="(item) => item.value"
              v-model="form.statuses"
              :options="getStatuses()"
              multiple="true"
              :searchable="true"
            />
            <span v-if="errors?.statuses" class="text-danger mt-1">{{
              __(errors.statuses)
            }}</span>
          </div>
        </div>
      </div>
      <div class="col-md-12">
        <div class="row mt-5">
          <div class="col-md-6">
            <div class="d-flex">
              <input
                class="m-1"
                type="radio"
                value="now"
                v-model="form.sendingType"
                name="sending_time"
              />
              <span class="m-1">{{ __("Send now") }}</span>
            </div>
          </div>
          <div class="col-md-6">
            <div class="d-flex justify-content-center">
              <input
                class="m-1"
                type="radio"
                value="later"
                v-model="form.sendingType"
                name="sending_time"
              />
              <span class="m-1">{{ __("Send later") }}</span>
              <input
                type="datetime-local"
                class="form-control m-1"
                v-model="form.sending_time"
              />
            </div>
            <span v-if="errors?.sending_time" class="text-danger m-1">{{
              __(errors.sending_time)
            }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-md-12">
        <button
          @click.prevent="send()"
          class="btn btn-light-primary font-weight-bold m-1"
        >
          {{ __("Send") }}
        </button>
      </div>
    </div>
  </div>

  <div class="row" v-if="showMessages">
    <div class="col-md-12">
      <hr />
      <div
        v-for="message in messages?.data"
        :key="message.id"
        class="mt-3 p-3"
        style="background-color: #fdf4de; border-radius: 15px"
      >
        <div class="d-flex justify-content-between flex-wrap">
          <div class="p-3">
            {{ __("Subject") }}
            <h5>
              {{ message.title }}
            </h5>
          </div>
          <div class="p-3">
            {{ __("Sending with") }}:
            <p class="text-muted">{{ getMessageDrivers(message) }}</p>
          </div>
          <div class="p-3">
            {{ __("Created at") }}
            <p class="text-muted ml-2">
              {{ message.created_time }}
            </p>
          </div>
        </div>
        <div class="mt-3 mb-3 px-7 py-3">
          <div v-html="message.message"></div>
        </div>

        <div
          class="d-flex justify-content-between flex-wrap align-items-center"
        >
          <div class="p-3">
            <span class="text-muted">{{ __("Sending time") }}</span>
            <p class="text-muted">{{ message.sending_at }}</p>
          </div>
          <div class="p-3">
            <span class="text-muted">{{ __("Status") }}</span>
            <br />
            <p v-if="message.status == 0" class="text-muted">
              {{ __("In waiting") }}
            </p>
            <p v-else-if="message.status == 2" class="text-muted">
              {{ __("Sent") }}
            </p>
          </div>
          <div class="p-3 d-flex flex-column" v-if="isAdmin">
            <span
              >{{ __("Sent to") }}: ({{
                message.receivers ? message.receivers.length : 0
              }}) {{ __("User") }}</span
            >
            <p
              @click="showUsers(message)"
              class="cursor-pointer inline-block btn btn-sm btn-success"
            >
              {{ __("Details") }}
            </p>
          </div>
          <div class="p-3 d-flex">
            <i
              v-if="!message.read_at && message.status != 0"
              @click="makeAlertMessageAsRead(message.id)"
              class="fa fa-eye m-1"
              style="color: blue"
            ></i>
            <i
              v-if="isAdmin"
              style="color: red"
              @click="deleteAlertMessage(message.id)"
              class="bi bi-trash m-1"
            ></i>
          </div>
        </div>
      </div>

      <div class="mt-3">
        <pagination
          v-if="messages?.links"
          :links="messages.links"
          :getPageNumberOnly="true"
          @pageNo="setPageNo"
        />
      </div>

      <div
        v-if="!messages"
        style="
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100%;
          background-color: #e1f0ff;
          margin-top: 15px;
          min-height: 100px;
        "
      >
        <span style="font-weight: bold">{{
          __("There are no messages yet")
        }}</span>
      </div>
    </div>
  </div>

  <Modal id="motifyModal" ref="motifyModal" :title="__('Details')">
    <asay-notifications-logs-table
      ref="notifyMessageRef"
      :notifyId="selectedMessage.id"
      v-if="selectedMessage"
    />
  </Modal>
  <Modal id="repliesModal" ref="repliesModalRef" :title="__('Messages')">
    <asay-alert-replies
      :canEdit="isAdmin"
      :deleteRouteUrl="route('admin.replies.destroy')"
      :getRepliesRouteUrl="route('admin.replies.getReplies')"
      :storeRelyRouteUrl="route('admin.replies.store')"
      ref="alertRepliesRef"
      @setMessage="setMessage"
    />
  </Modal>
</template>
  
  <script>
import { ref } from "vue";
import moment from "moment";
import NProgress from "nprogress";
import vSelect from "vue-select";
import Swal from "sweetalert2";
import Pagination from "./Pagination.vue";
import Modal from "../Modal.vue";
import AlertReplies from "./AlertReplies.vue";

export default {
  components: {
    vSelect,
    Pagination,
    Modal,
    AlertReplies,
  },
  props: {
    group: {
      default: "users",
    },
    groupId: {
      default: null,
    },
    senderId: {
      default: null,
    },
    receiversIds: {
      default: [],
    },
    receivedBy: {
      default: [],
    },
    isAdmin: {
      default: false,
    },
    showMessages: {
      default: true,
    },
    showRoles: {
      default: true,
    },
    showUserStatuses: {
      default: true,
    },
    showSendTo: {
      default: true,
    },
    getConfigUrl: String,
    getAlertsUrl: String,
    getReceiversUrl: String,
    makeAlertMessageAsReadUrl: String,
    deleteAlertMessageUrl: String,
    sendAlertUrl: String,
  },
  setup(props) {
    let form = ref({
      action: null,
      title: null,
      message: "",
      sending_by: null,
      received_by: props.receivedBy,
      selected_roles: [],
      statuses: [],
      sending_time: null,
      sender_id: props.senderId,
      group: props.group,
      group_id: props.groupId,
      receiversIds: props.receiversIds.length ? props.receiversIds : "*",
      pageNo: 1,
      user_id: props.senderId,
      sendingType: "now",
    });

    let drivers = ref([]);
    let receivers = ref([]);
    let roles = ref([]);
    let account_statuses = ref([]);
    let messages = ref([]);
    let message_statuses = ref([]);
    let selectedMessage = ref(null);
    let errors = ref({});
    let params = ref({});
    let configs = ref(null);

    return {
      form,
      drivers,
      receivers,
      roles,
      account_statuses,
      messages,
      message_statuses,
      selectedMessage,
      errors,
      params,
      configs,
    };
  },
  methods: {
    setMessage(message) {
      this.form.title = message.title;
      this.form.message = message.content;
      this.$refs.repliesModalRef.close();
    },
    selectReply() {
      this.$refs.repliesModalRef.show();
      this.$refs.alertRepliesRef.getMessages();
    },
    getAppName() {
      if (this.params?.appName) {
        return this.params?.appName + " - " + __("Sending messages");
      }
      return this.__("Sending messages");
    },
    getDrivers(drivers) {
      let data = [];
      for (let i = 0; i < drivers.length; i++) {
        let label = drivers[i];
        if (drivers[i] === "database") {
          label = "Local";
        } else if (drivers[i] === "mail") {
          label = "Email";
        } else {
          label = drivers[i].charAt(0).toUpperCase() + drivers[i].slice(1);
        }
        data.push({
          value: drivers[i],
          label: this.__(label),
        });
      }
      return data;
    },
    getDriversList() {
      return this.getDrivers(this.drivers);
    },
    getMessageDrivers(message) {
      let drivers = this.getDrivers(JSON.parse(message.drivers));
      return drivers?.map((driver) => driver.label).join(",");
    },
    getRoles() {
      let data = [];
      for (let i = 0; i < this.roles.length; i++) {
        data.push({
          value: this.roles[i],
          label: this.__(this.roles[i]),
        });
      }
      return data;
    },
    getStatuses() {
      let data = [];
      for (let i = 0; i < this.account_statuses.length; i++) {
        data.push({
          value: this.account_statuses[i],
          label: this.__(this.account_statuses[i]),
        });
      }
      return data;
    },
    getReceivers() {
      NProgress.start();
      axios
        .post(this.getReceiversUrl, this.form)
        .then((res) => {
          if (res.data.success) {
            this.receivers = res.data.receivers?.map((receiver) => {
              return {
                value: receiver.id,
                label: receiver.name,
              };
            });

            if (this.receivers.length) {
              this.receivers.push({
                value: "*",
                label: this.__("All"),
              });
            }
          }
          NProgress.done();
        })
        .catch((err) => {
          NProgress.done();
        });
    },
    getAlertsConfigs() {
      NProgress.start();
      axios
        .post(this.getConfigUrl, this.form)
        .then((res) => {
          this.drivers = res.data.drivers;
          this.roles = res.data.roles;
          this.account_statuses = res.data.account_statuses;
          this.message_statuses = res.data.message_statuses;
          this.params = res.data.params;
          this.configs = res.data;
          NProgress.done();
        })
        .catch((err) => {
          NProgress.done();
        });
    },
    getAlertsMessages() {
      NProgress.start();
      axios
        .post(this.getAlertsUrl, this.form)
        .then((res) => {
          this.messages = res.data.messages;
          NProgress.done();
        })
        .catch((err) => {
          NProgress.done();
        });
    },
    setContent(content) {
      this.form.message = content;
    },
    setPageNo(pageNo) {
      this.form.pageNo = pageNo;
      this.getAlertsMessages();
    },
    send() {
      this.form.action = "getCount";
      NProgress.start();
      axios
        .post(this.sendAlertUrl, this.form)
        .then((res) => {
          if (res.data.success) {
            this.errors = {};
            Swal.fire({
              title: this.__("Are you sure?"),
              text:
                this.__("This message will be sent to") +
                " (" +
                res.data.count +
                ") " +
                this.__("User") +
                "," +
                this.__("Do you definitely want to complete this procedure?"),
              icon: "warning",
              showCancelButton: true,
              cancelButtonText: this.__("Cancel"),
              confirmButtonText: this.__("Send"),
            }).then((action) => {
              if (action.isConfirmed) {
                this.form.action = "send";
                NProgress.start();
                axios
                  .post(this.sendAlertUrl, this.form)
                  .then((res) => {
                    if (!res.data.success) {
                      this.errors = res.data.errors;
                      if (!this.errors) {
                        Swal.fire({
                          text: res.data.msg,
                          icon: "error",
                          confirmButtonText: this.__("Ok"),
                        });
                      }
                    } else {
                      this.errors = {};
                      Swal.fire({
                        text: this.__(res.data.msg),
                        icon: "success",
                        confirmButtonText: this.__("Ok"),
                      });
                      this.getAlertsMessages();
                    }
                    NProgress.done();
                  })
                  .catch((err) => {
                    NProgress.done();
                  });
              } else {
                Swal.fire({
                  text: this.__("The procedure has been cancelled."),
                  icon: "success",
                  confirmButtonText: this.__("Ok"),
                });
              }
            });
          } else {
            this.errors = res.data.errors;
          }
          NProgress.done();
        })
        .catch((err) => {
          NProgress.done();
        });
    },
    makeAlertMessageAsRead(id) {
      NProgress.start();
      axios
        .post(this.makeAlertMessageAsReadUrl, { id: id })
        .then((res) => {
          Swal.fire({
            text: res.data.msg,
            icon: res.data.success ? "success" : "error",
            confirmButtonText: this.__("Ok"),
          });
          if (res.data.success) {
            this.getAlertsMessages();
          }
          NProgress.done();
        })
        .catch((err) => {
          NProgress.done();
        });
    },
    deleteAlertMessage(id) {
      NProgress.start();
      axios
        .post(this.deleteAlertMessageUrl, { id: id })
        .then((res) => {
          if (res.data.success) {
            Swal.fire({
              text: res.data.msg,
              icon: "success",
              confirmButtonText: this.__("Ok"),
            });
            this.getAlertsMessages();
          } else {
            Swal.fire({
              text: res.data.msg,
              icon: "error",
              confirmButtonText: this.__("Ok"),
            });
          }
          NProgress.done();
        })
        .catch((err) => {
          NProgress.done();
        });
    },
    showUsers(message) {
      this.selectedMessage = message;
      this.$refs.motifyModal.show();
      setTimeout(() => {
        this.$refs.notifyMessageRef.refreshData();
      }, 1000);
    },
  },

  updated() {},
  mounted() {
    moment.locale("ar");
    this.getAlertsConfigs();
    this.getReceivers();
    this.getAlertsMessages();
    this.form.received_by = ["*"];
  },

  watch: {
    "form.selected_roles": function (newVal) {
      this.getReceivers();
    },
  },
};
</script>
  <style>
@import "vue-select/dist/vue-select.css";
</style>