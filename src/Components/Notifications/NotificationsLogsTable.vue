<template>
  <asay-vue-datatable
    ref="notificationsLogsDataTableRef"
    :columns="columns"
    :ajaxUrl="route('admin.notifications.getNotificationsLogs')"
    :params="queryParams"
    @setAction="setAction"
    :key="compKey"
  >
    <template #datatable-actions>
      <div
        class="
          d-flex
          justify-centent-center
          align-items-center
          flex-row-fluid flex-wrap
        "
      >
        <div>{{ __("Type") }}:</div>
        <div>
          <select
            @change="refreshData($event)"
            class="form-control"
            v-model="queryParams.notify_type"
          >
            <option value="*">{{ __("All") }}</option>
            <option value="database">{{ __("Local") }}</option>
            <option value="mail">{{ __("Email") }}</option>
            <option value="sms">{{ __("SMS") }}</option>
            <option value="oneSignal">{{ __("oneSignal") }}</option>
          </select>
        </div>
      </div>
    </template>
  </asay-vue-datatable>
  <modal
    id="detailsModal"
    ref="detailsModalRef"
    :title="__('Details')"
    :size="'lg'"
  >
    <div>
      <div
        v-if="selectedNotifyHtml"
        v-html="selectedNotifyHtml"
        style="direction: ltr"
      ></div>
    </div>
    <!-- <template v-slot:footer>
        <button @click="doChangeOrderStatus()" class="btn btn-success">
          {{ __("Change") }}
        </button>
      </template> -->
  </modal>
</template>
  
  <script>
import { ref } from "vue";
import Modal from "../Modal.vue";
export default {
  components: {
    DataTable,
    Modal,
    DataTable,
    Modal,
  },
  props: {
    notifyId: {
      default: null,
    },
  },
  setup(props) {
    let columns = ref([
      { data: "name", name: "name", label: "Sent to" },
      { data: "subject", name: "subject", label: "Subject" },
      { data: "notify_type", name: "notify_type", label: "Sent by" },
      { data: "status", name: "status", label: "Status" },
      { data: "actions", name: "actions", label: "Details", exportable: false },
    ]);

    let queryParams = ref({
      notifyId: props.notifyId,
      notify_type: "*",
    });
    let selectedNotify = ref(null);
    let selectedNotifyHtml = ref(null);
    let compKey = ref(1);
    return {
      columns,
      queryParams,
      selectedNotifyHtml,
      selectedNotify,
      compKey,
    };
  },
  methods: {
    close() {
      this.$refs.detailsModalRef.close();
      this.$refs.notificationsLogsDataTableRef?.reloadData();
    },
    setAction(data) {
      if (data.action == "openDetails") {
        console.log("details");
        console.log(data.data.details);

        this.selectedNotifyHtml = '<table class="table">';
        if (data.data.details) {
          this.selectedNotifyHtml += "<tr><td colspan='2'>Status:</td></tr>";
          Object.entries(data.data.details.notify_result).forEach(
            ([key, value]) => {
              this.selectedNotifyHtml +=
                "<tr><td>" + key + "</td><td>" + value + "</td></tr>";
            }
          );
          this.selectedNotifyHtml +=
            "<tr><td colspan='2'>More information:</td></tr>";
          Object.entries(data.data.details.notify_data).forEach(
            ([key, value]) => {
              this.selectedNotifyHtml +=
                "<tr><td>" + key + "</td><td>" + value + "</td></tr>";
            }
          );
        }
        this.selectedNotifyHtml += "</table>";
        this.selectedNotify = data.data;
        this.$refs.detailsModalRef.show();
      }
    },
    refreshData() {
      // this.compKey++;
      console.log(this.notifyId);
      this.$refs.notificationsLogsDataTableRef.reloadData();
    },
  },
  watch: {
    notifyId: function (newVal) {
      // console.log("yes");
    },
  },
  updated() {
    //
  },
  mounted() {
    //
  },
};
</script>
  
  <style>
</style>