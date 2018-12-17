import Vue from 'vue';
import VueMaterial from 'vue-material';
import Vuex from "vuex";
import { spinalContextMenuService } from "spinal-env-viewer-context-menu-service";
import {
  OPTION_CONTEXT_INFO,
  OPTION_SELECTED_NODE_INFO
} from './config.js';

Vue.config.productionTip = false;

Vue.use( VueMaterial );
Vue.use( Vuex );

function initialState() {
  return {
    topBarButton: [],
    sideBarButton: [],
    contextsId: [],
    nodes: {},
    selectedNode: {},
    graph: {},
    activeNodesId: [],
    childrenMapping: new Map()
  };

}

let store = new Vuex.Store( {

  state: initialState(),

  mutations: {

    ADD_CONTEXTS: ( state, contexts ) => {
      for (let i = 0; i < contexts.length; i++) {
        const contextId = contexts[i].id.get();

        if (!state.contextsId.includes( contextId )) {
          state.contextsId.push( contextId );
        }
        if (!state.nodes.hasOwnProperty( contextId )) {
          state.nodes[contextId] = contexts[i];
        }
      }
    },

    ADD_NODE: ( state, node ) => {
      const nodeId = node.id.get();
      if (!state.nodes.hasOwnProperty( nodeId )) {
        state.nodes[nodeId] = node;
      }
    },

    ADD_NODES: ( state, nodes ) => {
      for (let i = 0; i < nodes.length; i++) {
        const nodeId = nodes[i].id.get();
        if (!state.nodes.hasOwnProperty( nodeId )) {
          state.nodes[nodeId] = nodes[i];
        }
      }
    },

    CHANGE_SELECTED_NODE: ( state, node ) => {
      state.selectedNode = node;
      state.selectedNode.graph = state.graph;
    },

    CHANGE_SIDE_BAR: ( state, buttons ) => {

      const res = [];
      for (let i = 0; i < buttons.length; i++) {
        let button = buttons[i];
        if (button.hasOwnProperty( "buttonCfg" )) {
          let butcfg = button.buttonCfg;
          butcfg.toolTip = button.label;
          butcfg.action = button.action;
          res.push( { button: butcfg, badge_content: button.badgeCfg } );
        }
      }

      state.sideBarButton = res;
    },

    REFRESH: ( state ) => {
      const s = initialState();

      for (let key in s) {
        if (s.hasOwnProperty( key )) {
          state[key] = s[key];
        }
      }
    },

    REMOVE_NODE: ( state, id ) => {
      if (state.nodes.hasOwnProperty( id )) {
        state.childrenIds.splice( state.childrenIds.indexOf( id ), 1 );
        delete state.nodes[id];
      }
    },

    SET_GLOBAL_BAR: ( state, bts ) => {
      const buttons = [];
      for (let i = 0; i < bts.length; i++) {
        let button = bts[i];
        if (button.hasOwnProperty( 'buttonCfg' )) {
          let butcfg = button.buttonCfg;
          butcfg.toolTip = button.label;
          butcfg.action = button.action;
          buttons.push( {
            button: butcfg,
            badge_content: button.badgeCfg
          } );
        }
      }

      state.topBarButton = buttons;
    },

    SET_NODE_ID: ( state, info ) => {
      if (state.nodes.hasOwnProperty( info.id.get() )) {
        state.nodes[info.id.get()] = info;

      }
    },

    SET_GRAPH: ( state, graph ) => {
      state.graph = graph;
    },

    SET_ACTIVE_NODE: ( state, activeNode ) => {
      state.activeNode = activeNode;
    },

    SET_CHILDREN_MAPPING: ( state, mapping ) => {
      state.childrenMapping = mapping;
    }
  },

  actions: {


    onNodeSelected( context, ids ) {
      const option = {};
      option[OPTION_SELECTED_NODE_INFO] = context.state.nodes[ids[0]];
      option[OPTION_CONTEXT_INFO] = context.state.nodes[ids[ids.length - 1]];
      const promise = spinalContextMenuService.getApps( "GraphManagerSideBar", option );
      if (typeof promise !== 'undefined') {
        promise.then( buttons => {
          context.commit( "CHANGE_SIDE_BAR", buttons );
          context.commit( "CHANGE_SELECTED_NODE", option );
        } )
          .catch( e => {
            console.error( e );
          } );
      }
    },

    retrieveGlobalBar( context, option ) {
      spinalContextMenuService.getApps( "GraphManagerTopBar", option )
        .then( buttons => {
          context.commit( "SET_GLOBAL_BAR", buttons );
          context.commit( "CHANGE_SELECTED_NODE", option );
        } )
        .catch( e => {
          console.error( e );
        } );
    },
  },

} );


export default store;