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
    nodes: {},
    activeNodesId: [],
    sync: [],
    selectedNode: {},
    refreshed: false,
    childrenMapping: new Map()
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
          if (!state.nodes.hasOwnProperty( contextId )) {
            state.nodes[contextId] = context;
          }
        }
      },
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
        //cf GraphManager
      },
      
      ADD_NODE: ( state, node ) => {
        if (typeof node !== "undefined" && state.nodes.hasOwnProperty( node.id.get() )) {
          state.nodes[node.id.get()] = node;
        }
        
      },
      ADD_NODES: ( state, nodes ) => {
        for (let i = 0; i < nodes.length; i++) {
          const nodeId = nodes[i].id.get();
          
          if (typeof nodes[i] !== "undefined" && state.nodes.hasOwnProperty( nodeId )) {
            state.nodes[nodeId] = nodes[i];
          }
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
      REFRESH: ( state ) => {
        const s = refreshState();
        
        for (let key in s) {
          if (s.hasOwnProperty( key )) {
            state[key] = s[key];
          }
        }
        state.refreshed = false;
      },
      
      SET_GRAPH: ( state, graph ) => {
        state.graph = graph;
      },
      REFRESHED: ( state ) => {
        state.refreshed = true;
      },
      SET_NODE: ( state, node ) => {
        if (typeof node !== "undefined") {
          if (state.nodes.hasOwnProperty( node.id.get() )) {
            for (const key in node) {
              if (node.hasOwnProperty( key )) {
                state.nodes[node.id.get()][key] = node[key];
              }
            }
          }
          else {
            state.nodes[node.id.get()] = node;
          }
        }
        
      },
      REMOVE_NODE: ( state, id ) => {
        if (state.nodes.has( id )) {
          state.childrenIds.splice( state.childrenIds.indexOf( id ), 1 );
          delete state.nodes[id];
        }
      },
      
      SEARCH_TEXT: ( state, text ) => {
        while (state.searchId.length > 0) {
          state.searchId.splice( 0 );
        }
        
        for (const [key, node] of state.nodes) {
          if (node.hasOwnProperty( 'name' ) && node.name.get().toLowerCase().includes( text.toLowerCase() )) {
            state.searchId.push( key );
          }
        }
      },
      SET_CHILDREN: ( state, payload ) => {
        if (payload.hasOwnProperty( 'parentId' ) && payload.hasOwnProperty( 'children' ))
          state.childrenMapping.set( payload.parentId, payload.children )
      }
    },
    
    actions: {
      getNode( context, event ) {
        SpinalGraphService.findNode( event ).then(
          node => context.commit( 'ADD_NODE', node )
        ).catch( e => console.error( e ) );
      },
      onNodeSelected( context, event ) {
        const option = {};
        option[OPTION_SELECTED_NODE_INFO] = context.state.nodes[event.nodeId];
        option[OPTION_CONTEXT_INFO] = context.state.nodes[event.contextId];
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
      pullChildren( context, nodeId ) {
        SpinalGraphService.getChildren( nodeId, [] )
          .then( children => {
            context.commit( 'ADD_NODES', children );
            context.commit( 'SET_CHILDREN', { parentId: nodeId, children } )
          } );
        
      }
      
      
    },
    
    getters: {
      arrayNode: ( state ) => {
        return Array.from( state.nodes );
      },
      getNodeById: ( state ) => ( id ) => {
        return state.nodes[id];
      },
      getChildrenId: ( state ) => ( id ) => {
        return state.nodes[id].childrenIds;
      },
      hasChildInContext: ( state ) => ( id, contextsId ) => {
        return SpinalGraphService.hasChildInContext( id, contextsId );
      }
    }
    
  } )
;


export default store;