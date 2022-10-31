
import ChattingRoom from "./Components/Chatting/ChattingRoom.vue";
import AlertsDashboard from "./Components/Alerts/AlertsDashboard.vue";
import AlertReplies from "./Components/Alerts/AlertReplies.vue";
import CKEditor from "./Components/Editors/CKEditor.vue";
import NotificationsLogsTable from "./Components/Notifications/NotificationsLogsTable.vue";
import { mixins } from "./Mixin";
import vSelect from "vue-select";
export default {
    install: (app, options) => {
        app
            .mixin(mixins)
            .component("v-select", vSelect)
            .component("asay-chatting-room", ChattingRoom)
            .component("asay-alert-dashboard", AlertsDashboard)
            .component("asay-alert-replies", AlertReplies)
            .component("asay-ckeditor", CKEditor)
            .component("asay-notifications-logs-table", NotificationsLogsTable)
            ;
        /*  our code for the plugin goes here
                app is the result of createApp()
                options is user options passed in
            */
    },
};
