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
        contextIds: [],
        nodes: {},
        selectedNode: {},
        pollingQueue: [],
        graph: {}
    },
    mutations: {
        CHANGE_SELECTED_NODE: (state, node) => {
            state.selectedNode = node;
            state.selectedNode.graph = state.graph;
        },
        ADD_CONTEXTS: (state, contexts) => {
            for (let i = 0; i < contexts.length; i++) {
                state.contextIds.push(contexts[i].info.id.get());
                if (!state.nodes.hasOwnProperty(contexts[i].info.id.get())) {
                    state.nodes[contexts[i].info.id.get()] = contexts[i];

                }
            }
        },
        ADD_NODES: (state, nodes) => {
            for (let i = 0; i < nodes.length; i++) {
                state.nodes[nodes[i].info.id.get()] = nodes[i];
            }
        },
        CHANGE_SIDE_BAR: (state, buttons) => {

            const res = [];
            for (let i = 0; i < buttons.length; i++) {
                let button = buttons[i];
                if (button.hasOwnProperty("buttonCfg")) {
                    let butcfg = button.buttonCfg;
                    butcfg.toolTip = button.label;
                    butcfg.action = button.action;
                    res.push({button: butcfg, badge_content: button.badgeCfg});
                }
            }

            state.sideBarButton = res;
        },
        SET_GLOBAL_BAR: (state, bts) => {
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
        },
        PULL_CHILDREN: (state, nodeId) => {
            state.pollingQueue.push(nodeId);
        },
        SET_GRAPH: (state, graph) => {
            state.graph = graph;
        },
        EMPTY_POLL: (state, id) => {
            const index = state.pollingQueue.indexOf(id);
            state.pollingQueue.splice(index, 1);
        }
    },
    actions: {

        addNodes(context, nodes) {
            context.commit("ADD_NODES", nodes)
        },

        addContexts(context, contexts) {
            context.commit("ADD_CONTEXTS", contexts);
        },

        onNodeSelected(context, ids) {
            const option = {};
            option['selectedNode'] = context.state.nodes[ids[0]];
            option['context'] = context.state.nodes[ids[ids.length - 1]];
            spinalContextMenuService.getApps("GraphManagerSideBar", option)
                .then(buttons => {
                    context.commit("CHANGE_SIDE_BAR", buttons);
                    context.commit("CHANGE_SELECTED_NODE", option)
                })
                .catch(e => {
                    console.error(e);
                });
        },

        retrieveGlobalBar(context, option) {
            spinalContextMenuService.getApps("GraphManagerTopBar", option)
                .then(buttons => {
                    context.commit("SET_GLOBAL_BAR", buttons);
                    context.commit("CHANGE_SELECTED_NODE", option)
                })
                .catch(e => {
                    console.error(e);
                });
        },

        setGraph(context, graph) {
            context.commit("SET_GRAPH", graph);
        },

        emptyPoll(context, id){
            context.commit("EMPTY_POLL", id);
        }
    }

});


let component = Vue.extend({
    render: h => h(App),
    methods: {
        opened: function (a, b) {

        },
        closed: function (a, b) {

        },
        removed: function (a, b) {
        }
    },
    store
});
export default {
    Component: component,
    Store: store
}
