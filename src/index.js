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
        CHANGE_SELECTED_NODE: (state, node) => {
            state.selectedNode = node;
        },
        ADD_NODES: (state, nodes) => {
            state.nodes.push(...nodes);
        },
        CHANGE_SIDE_BAR: (state, option) => {

            const buttons = [];
            for (let i = 0; i < option.buttons.length; i++) {
                let button = option.buttons[i];
                console.log(button);
                if (button.hasOwnProperty("buttonCfg")) {
                    let butcfg = button.buttonCfg;
                    butcfg.toolTip = button.label;
                    butcfg.action = button.action;
                    buttons.push({button: butcfg, badge_content: button.badgeCfg});
                }
            }

            state.sideBarButton = buttons;
            state.selectedNode = option.selectedNode;
        },
        SET_GLOBAL_BAR: (state, bts) => {
            console.log("set global bar ", bts);
            const buttons = [];
            for (let i = 0; i < bts.length; i++) {
                let button = bts[i];
                if (button.hasOwnProperty('buttonCfg')) {
                    let butcfg = button.buttonCfg;
                    butcfg.toolTip = button.label;
                    butcfg.action = button.action;
                    buttons.push({
                        button: butcfg,
                        badge_content: button.badgeCfg
                    });
                }

            }

            state.topBarButton = buttons;
        }
    },
    actions: {
        addNodes(context, nodes) {
            context.commit("ADD_NODES", nodes)
        },
        onNodeSelected(context, option) {
            spinalContextMenuService.getApps("GraphManagerSideBar", option)
                .then(buttons => {
                    option.buttons = buttons;
                    context.commit("CHANGE_SIDE_BAR", option);
                    context.commit("")
                })
                .catch(e => {
                    console.error(e);
                });
        },

        retrieveGlobalBar(context, option) {
            spinalContextMenuService.getApps("GraphManagerGlobalBar", option)
                .then(buttons => {
                    context.commit("SET_GLOBAL_BAR", buttons);
                    context.commit("CHANGE_SELECTED_NODE", option)
                })
                .catch(e => {
                    console.error(e);
                });
        }
    }
});

function badgeCfg2badgeContent(badgeCfg) {

}

function buttonCfg2button(buttonCfg) {

}

let component = new Vue({
    render: h => h(App),
    store
});
export default {
    Component: component,
    Store: store
}
