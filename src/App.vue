<template>
    <div :style="{height: height()}" class="plugin-graph-viewer">

        <div class="graph-manager-top-bar">

            <top-bar :buttons="topBarButton"
                     :option="graph"
                     class="graph-manager-top-tools-bar"
            />

            <spinal-icon-button
                    class="plugin-graph-viewer-refresh"
                    icon="refresh"
                    tool-tip="refresh graph"
                    v-on:click="refresh"
            />

        </div>

        <div class="graph-manager-body">

            <side-bar class="graph-manager-side-bar"
                      :buttons="sideBarButton"
                      :option="selectedNode"
            />

            <nodes-list class="graph-viewer"

                        :active-nodes-id="activeNodesId"
                        :contexts-id="contextsId"
                        :get-children-id="getChildrenId"
                        :getNode="getNode"
                        :show-hide-bim-object="true"

                        @hide-bim-object="onHideBimObject"


            />


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
  import { SpinalGraphService } from "spinal-env-viewer-graph-service";

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
      'graph',
      'sideBarButton',
      'selectedNode',

      'contextsId',
      'activeNodesId',

      'nodes',
      'modified',
    ] )
    ,

    methods: {

      getNode: function ( nodeId ) {
        return this.nodes[nodeId];
      },

      getChildrenId: function ( nodeId, contextId ) {
        //TODO FIX babel and spread operator tu use getters
        return SpinalGraphService.getChildrenInContext( nodeId, contextId )
      },

      height: function () {
        if (LMV_VIEWER_VERSION.includes( "6" ))
          return "calc(100% - 59px)";
        return "calc(100% - 16px)";
      },

      onHideBimObject: function ( event ) {
        console.log( "hide bim obj event", event )
      },


      refresh: function () {
        this.$store.commit( 'REFRESH' )
      }

    },
  }

</script>

<style>


    .plugin-graph-viewer {

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
