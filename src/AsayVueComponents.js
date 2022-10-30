
import ChattingRoom from "./Components/Chatting/ChattingRoom.vue";
import AlertsDashboard from "./Components/Alerts/AlertsDashboard.vue";
import CKEditor from "./Components/Editors/CKEditor.vue";
import { mixins } from "./Mixin";
import vSelect from "vue-select";
export default {
    install: (app, options) => {
        app
            .mixin(mixins)
            .component("v-select", vSelect)
            .component("asay-chatting-room", ChattingRoom)
            .component("asay-alert-dashboard", AlertsDashboard)
            .component("asay-ckeditor", CKEditor)
            ;
        /*  our code for the plugin goes here
                app is the result of createApp()
                options is user options passed in
            */
    },
};
