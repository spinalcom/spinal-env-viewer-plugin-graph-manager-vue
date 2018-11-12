import Vue from 'vue'
import App from './App.vue'
import VueMaterial from 'vue-material'
import Vuex from "vuex";
import {spinalContextMenuService} from "spinal-env-viewer-context-menu-service"

Vue.config.productionTip = false;

Vue.use(VueMaterial);
Vue.use(Vuex);

let store = new Vuex.Store({

    state: {
        topBarButton: [],
        sideBarButton: [],
        nodes: [],
        selectedNode: {}
    },
    getters: {},
    mutations: {
        ADD_NODES: (state, nodes) => {
            state.nodes.push(...nodes);
        },
        CHANGE_SIDE_BAR: (state, option) => {

            const buttons = [];
            for (let i = 0; i < option.buttons.length; i++) {
                console.log("CHANGE SIDE BAR", option.buttons[i]);
                if (option.buttons[i].length > 0) {
                    let button = option.buttons[i];
                    for (let j = 0; j < button.length; j++) {
                        if (typeof button[j].buttonCfg !== "undefined") {
                            let butcfg =button[j].buttonCfg;
                            butcfg.toolTip = button[j].label;
                            butcfg.action = button[j].action;
                            buttons.push({button: butcfg, badge_content: button[j].badgeCfg});
                        }
                    }
                }

            }

            state.sideBarButton = buttons;
            state.selectedNode = option.selectedNode;
        },
        SET_GLOBAL_BAR: (state, bts) => {
            console.log("set global bar ", bts);
            const buttons = [];
            for (let i = 0; i < bts.length; i++) {
                if (bts[i].length > 0) {
                    let button = bts[i];
                    for (let j = 0; j < button.length; j++) {
                        if ( button[j].hasOwnProperty('buttonCfg')) {
                            let butcfg = button[j].buttonCfg;
                            butcfg.toolTip = button[j].label;
                            butcfg.action = button[j].action;
                            buttons.push({
                                button: butcfg,
                                badge_content: button[j].badgeCfg
                            });
                        }
                    }
                }

            }

            state.sideBarButton = buttons;
        }
    },
    actions: {
        addNodes(context, nodes) {
            context.commit("ADD_NODES", nodes)
        },
        onNodeSelected(context, option) {
            spinalContextMenuService.getApps("GraphManagerSideBar", option)
                .then( buttons => {
                    option.buttons = buttons;
                    context.commit("CHANGE_SIDE_BAR", option);
                })
                .catch(e => {
                    console.error(e);
                });
        },

        retrieveGlobalBar(context, option){
            spinalContextMenuService.getApps("GraphManagerGlobalBar", option)
                .then(buttons => {
                    context.commit("SET_GLOBAL_BAR", buttons);
                })
                .catch(e => {
                console.error(e);
            });
        }
    }
});

function badgeCfg2badgeContent(badgeCfg){

}
function buttonCfg2button(buttonCfg){

}
let component = new Vue({
    render: h => h(App),
    store
});
export default {
    Component: component,
    Store: store
}
