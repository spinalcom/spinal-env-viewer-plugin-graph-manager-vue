<template>
    <div class="plugin-graph-viewer">

        <div class="graph-manager-top-bar">

            <top-bar :buttons="topBarButton"
                     :option="graph"
                     class="graph-manager-top-tools-bar"
            />

            <spinal-icon-button
                    class="plugin-graph-viewer-refresh"
                    icon="refresh"
                    tool-tip="refresh graph"
                    v-on:click="refresh()"
            />

        </div>
        <div class="graph-manager-body">

            <side-bar class="graph-manager-side-bar"
                      :buttons="sideBarButton"
                      :option="selectedNode"
            />

            <nodes-list class="graph-viewer"
                        :active-node="activeNode"
                        :childrenIds="childrenIds"
                        :context-ids="contextIds"
                        :nodes="nodes"

                        @active-node="onActiveNode($event)"
                        @hide-bim-object="onHideBimObject($event)"
                        @node-selected="onNodeSelected($event)"
                        @pull-children="onPullNode($event)"/>


        </div>
    </div>
</template>

<script>

  import {
    NodeList,
    SideBar,
    SpinalIconButton,
    TopBar
  } from "spinal-env-viewer-vue-components-lib";
  import { mapState } from 'vuex'

  export default {
    name: 'graph-manager',
    components: {
      SpinalIconButton,
      sideBar: SideBar,
      TopBar: TopBar,
      NodesList: NodeList
    },

    computed: mapState( [
      'topBarButton',
      'sideBarButton',
      'nodes',
      'selectedNode',
      'contextIds',
      'childrenIds',
      'graph',
      'activeNode',
      'reset'
    ] ),

    methods: {
      onHideBimObject: function ( event ) {
        console.log( "hide bim obj event", event )
      },

      onNodeSelected: function ( event ) {
        this.$store.dispatch( "onNodeSelected", event )
          .then()
          .catch( e => console.error( e ) );
      },

      onPullNode: function ( event ) {
        this.$store.commit( "PULL_CHILDREN", event );
      },

      onActiveNode: function ( event ) {
        this.$store.commit( 'SET_ACTIVE_NODE', event )
      },

      isInContext: function ( childrenId, contextId ) {
        let res = false;

        for (let i = 0; i < childrenId.length && !res; i++) {
          const childId = childrenId[i];
          if (this.nodes.hasOwnProperty( childId )) {
            const node = this.nodes[childId];
            const contextIds = node.contextIds;
            for (let j = 0; j < contextIds.length && !res; j++) {
              if (contextId === contextIds[j])
                res = true;
            }
          }
        }

        return res;
      },

      refresh: function () {
        this.$store.commit( 'RESET' )
      }
    },
    watch: {
      'reset': {
        handler: function ( reset ) {
          if (reset) {
            this.$forceUpdate();
            this.$store.commit( 'SET_RESET', !reset );
          }
        }
      }
    }


  }

</script>

<style>


    .plugin-graph-viewer {
        height: 100%;
    }

    .plugin-graph-viewer * {
        box-sizing: border-box;
    }

    .graph-viewer {
        border-left: 1px solid rgba(128, 128, 128, 0.64);
        width: 100%;
        overflow-y: auto;
        overflow-x: hidden;
    }

    .graph-manager-top-bar {
        display: flex;
        background-color: rgba(52, 52, 52, 0.85);
        border-bottom: 1px solid rgba(128, 128, 128, 0.64);
    }

    .graph-manager-side-bar {
        background-color: rgba(52, 52, 52, 0.85);
        border-bottom: 1px solid rgba(128, 128, 128, 0.64);
    }

    .plugin-graph-viewer-refresh {
        float: right;
        font-size: 2%;
    }

    .graph-manager-top-tools-bar {
        float: left;
        width: 98%;
    }
    .graph-manager-body {
        display: flex;
        height: 100%;
        width: 100%;
    }
</style>
