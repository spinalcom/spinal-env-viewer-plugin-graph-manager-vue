import Store from './store';
import App from './App.vue';
<<<<<<< HEAD
import Vue from 'vue';
=======
import VueMaterial from 'vue-material';
import Vuex from "vuex";
import { spinalContextMenuService } from "spinal-env-viewer-context-menu-service";

Vue.config.productionTip = false;

Vue.use( VueMaterial );
Vue.use( Vuex );
const OPTION_SELECTED_NODE_INFO = 'selectedNode';
const OPTION_CONTEXT_INFO = "context";

function initialState() {
  return {
    topBarButton: [],
    sideBarButton: [],
    contextIds: [],
    nodes: { hasbeen: false },
    selectedNode: {},
    pollingQueue: [],
    graph: {},
    childrenIds: [],
    binders: {},
    activeNode: {},
    reset: false
  };

}

let store = new Vuex.Store( {

  state: initialState(),

  mutations: {

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

    PULL_CHILDREN: ( state, nodeId ) => {
      state.pollingQueue.push( nodeId );
    },

    EMPTY_POLL: ( state, id ) => {
      const index = state.pollingQueue.indexOf( id );
      state.pollingQueue.splice( index, 1 );
    },


    ADD_CONTEXTS: ( state, contexts ) => {
      for (let i = 0; i < contexts.length; i++) {
        const contextId = contexts[i].id.get();

        if (!state.contextIds.includes( contextId )) {
          state.contextIds.push( contextId );
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
        state.childrenIds.push( nodeId );
      }
    },

    ADD_NODES: ( state, nodes ) => {
      for (let i = 0; i < nodes.length; i++) {
        const nodeId = nodes[i].id.get();
        if (!state.nodes.hasOwnProperty( nodeId )) {
          state.nodes = nodes[i];
          state.childrenIds.push( nodeId );
        }
      }
    },

    BIND_NODE: ( state, nodeId, binder ) => {
      if (state.nodes.hasOwnProperty( nodeId )) {
        state.binders[nodeId] = binder;
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
    SET_RESET: ( state, reset ) => {
      state.reset = reset;
    },
    RESET: ( state ) => {
      const s = initialState();

      for (let key in s) {
        if (s.hasOwnProperty( key )) {
          state[key] = s[key];
        }
      }
    }
  },

  actions: {

    addNodes( context, nodes ) {
      for (let i = 0; i < nodes.length; i++) {
        const nodeId = nodes[i].id.get();
        const node = nodes[i];
        if (!context.state.nodes.hasOwnProperty( nodeId )) {
          context.commit( 'ADD_NODE', node );
        }

        if (!context.state.binders.hasOwnProperty( nodeId )) {
          //TODO GRAPH SERVICE
          context.commit( 'BIND_NODE', { nodeId, func: watchNode.bind( this, context, nodeId ) } );
        }
      }
    },

    addContexts( context, contexts ) {
      for (let i = 0; i < contexts.length; i++) {
        const nodeId = contexts[i].id.get();
        if (!context.state.binders.hasOwnProperty( nodeId )) {
          context.commit( 'BIND_NODE', { nodeId, func: watchNode.bind( this, context, nodeId ) } );
        }
      }

      context.commit( "ADD_CONTEXTS", contexts );
    },

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

    setGraph( context, graph ) {
      context.commit( "SET_GRAPH", graph );
    },

    emptyPoll( context, id ) {
      context.commit( "EMPTY_POLL", id );
    }
  },

} );

function watchNode( context, nodeId ) {
  context.commit( 'PULL_CHILDREN', nodeId );
}
>>>>>>> parent of 2dee0bf... [UPDATE] add refresh button

let GraphManagerVue = Vue.extend( {
  render: h => h( App ),
  methods: {
    opened: function () {

    },
    closed: function () {

    },
    removed: function () {
    }
  },
  store: Store
} );

export {
  GraphManagerVue,
  Store
};

