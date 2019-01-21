import Vue from 'vue';
import VueMaterial from 'vue-material';
import Vuex from "vuex";
import { spinalContextMenuService } from "spinal-env-viewer-context-menu-service";
import {
  OPTION_SELECTED_NODE_INFO,
  OPTION_CONTEXT_INFO
} from './config.js';
import { SpinalGraphService } from "spinal-env-viewer-graph-service";

Vue.config.productionTip = false;

Vue.use( VueMaterial );
Vue.use( Vuex );

function initialState() {
  return {
    topBarButton: [],
    sideBarButton: [],
    contextsId: [],
    searchId: [],
    nodes: new Map(),
    activeNodesId: [],
    sync: [],
    selectedNode: {},
    refreshed: false,
    childrenPull: []

    /*
     graph: {},
     activeNodesId: [],
     childrenMapping: new Map()*/
  };

}
function refreshState() {
  return {
    activeNodesId: [],
    sync: [],
    selectedNode: {},
    refreshed: true,
  };
}

let store = new Vuex.Store( {

  state: initialState(),

  mutations: {
    ADD_CONTEXT: ( state, context ) => {
      const contextId = context.id.get();
      if (state.contextId.includes( contextId )) {
        state.contextId.push( contextId );
        if (!state.nodes.has( contextId )) {
          state.nodes.set( contextId, context );
        }
      }
    },
    ADD_CONTEXTS: ( state, contexts ) => {
      
      for (let i = 0; i < contexts.length; i++) {
        const contextId = contexts[i].id.get();

        if (!state.contextsId.includes( contextId )) {
          state.contextsId.push( contextId );
        }
        if (!state.nodes.has( contextId )) {
          state.nodes.set( contextId, contexts[i] );
        }
      }
    },

    SET_SIDE_BAR: ( state, buttons ) => {

      const res = [];
      for (let i = 0; i < buttons.length; i++) {
        const button = buttons[i];
        if (button.hasOwnProperty( "buttonCfg" )) {
          const butCfg = button.buttonCfg;
          butCfg.toolTip = button.label;
          butCfg.action = button.action;
          res.push( { button: butCfg, badge_content: button.badgeCfg } );
        }
      }

      state.sideBarButton = res;
    },

    SET_ACTIVE_NODE: ( state, activeNode ) => {
      state.activeNodesId = [activeNode];
    },

    SET_SELECTED_NODE: ( state, option ) => {
      state.selectedNode = option;
      state.selectedNode.graph = state.graph;
    },
    GET_NODE: ( state ) => {
      state.sync.splice( 0 );
      state.refreshed = true;
      //cf GraphManager
    },
    ADD_NODE: ( state, node ) => {
      if (typeof node !== "undefined") {
        state.nodes.set( node.id.get(), node );
        state.refreshed = false;
      }
    },
    ADD_NODES: ( state, nodes ) => {
      for (let i = 0; i < nodes.length; i++) {
        const nodeId = nodes[i].id.get();
        state.nodes.set( nodeId, nodes[i] );
      }
      state.refreshed = false;
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
    REFRESH: ( state ) => {
      const s = refreshState();

      for (let key in s) {
        if (s.hasOwnProperty( key )) {
          state[key] = s[key];
        }
      }
    },

    SET_GRAPH: ( state, graph ) => {
      state.graph = graph;
    },
    REFRESHED: ( state ) => {
      state.refreshed = true;
    },
    SET_NODE:(state, node )=> {
      if (typeof node !== "undefined") {
        state.nodes.set( node.id.get(), node );
        state.refreshed = false;
      }
    },
    REMOVE_NODE: ( state, id ) => {
      if (state.nodes.has( id )) {
        state.childrenIds.splice( state.childrenIds.indexOf( id ), 1 );
        state.nodes.delete(id);
      }
    },
    ADD_PARENT(state, nodeId){
      state.childrenPull.push(nodeId);
    },

    SEARCH_TEXT(state, text){
      while (state.searchId.length > 0) {
        state.searchId.splice(0);
      }

      for (const [key,node] of state.nodes) {
        if (node.name.get().toLowerCase().includes(text.toLowerCase()))
        {
          state.searchId.push(key);
        }
      }
    }
  },

  actions: {
    getNode(context, event){
      SpinalGraphService.findNode(event).then(
        node => context.commit('ADD_NODE', node)
      ).catch(e => console.error(e));
    },
    onNodeSelected( context, event ) {
      const option = {};
      option[OPTION_SELECTED_NODE_INFO] = context.state.nodes.get( event.nodeId );
      option[OPTION_CONTEXT_INFO] = context.state.nodes.get( event.contextId );
      context.commit( "SET_ACTIVE_NODE", event.nodeId );
      spinalContextMenuService
        .getApps( "GraphManagerSideBar", option )
        .then( buttons => {
          context.commit( "SET_SIDE_BAR", buttons );
          context.commit( "SET_SELECTED_NODE", option );
        } )
        .catch( e => {
          console.error( e );
        } );
    },

    retrieveGlobalBar( context, option ) {
      spinalContextMenuService.getApps( "GraphManagerTopBar", option )
        .then( buttons => {
          context.commit( "SET_GLOBAL_BAR", buttons );
        } )
        .catch( e => {
          console.error( e );
        } );
    },

    pullChildren(context, nodeId){
      if (!context.state.childrenPull.includes(nodeId)){
        context.commit('ADD_PARENT', nodeId);
        SpinalGraphService.getChildren(nodeId, [])
          .then(children => context.commit('ADD_NODES', children));
      }
    }


  },

} )
;


export default store;