<template>
    <div class="plugin-graph-viewer" :style="{height: height()}">

        <div class="graph-manager-top-bar">

            <top-bar :buttons="topBarButton"
                     :option="graph"
                     class="graph-manager-top-tools-bar"
            />


            <input v-if="isSearchActive"
                   v-model="searchText"
                   placeholder="search name "
            />
            <spinal-icon-button
                    v-else
                    class="plugin-graph-viewer-refresh"
                    icon="search"
                    tool-tip="refresh graph"
                    v-on:click="isSearchActive = true"
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

                        :refresh="refreshed"
                        :nodes="nodes"
                        :show-hide-bim-object="false"
                        :contexts-id="displayNodes"

                        :get-children-id="getChildrenId"
                        :getNode="getNode"

                        :active-nodes-id="activeNodesId"
                        :pull-children="pullChildren"

                        @click="onNodeSelected($event)"
                        @right-click=""
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
    data: function () {
      return {
        isSearchActive: false,
        searchText: '',
        displayNodes: []
      }
    },
    computed: mapState( [
      'topBarButton',
      'sideBarButton',
      'contextsId',
      'nodes',
      'activeNodesId',
      'selectedNode',
      'refreshed',
      'searchId'
    ] ),
    methods: {
      onNodeSelected: function ( event ) {
        this.$store.dispatch( "onNodeSelected", event )
          .then()
          .catch( e => console.error( e ) );
      },
      getNode: function ( nodeId ) {
        const node = this.nodes.get( nodeId );
        if (typeof nodeId !== "undefined" && typeof node === "undefined") {
          this.$store.dispatch( 'getNode', nodeId )
        }
        return node;
      },

      getChildrenId: function ( nodeId ) {
        return SpinalGraphService.getChildrenIds( nodeId );

      },

      height: function () {

        return "100%";
      },

      onHideBimObject: function ( event ) {
        console.log( "hide bim obj event", event )
      },


      refresh: function () {
        this.$store.commit( 'REFRESH' )
      },
      pullChildren: function ( nodeId ) {
        this.$store.dispatch( 'pullChildren', nodeId );
      },


    },
    watch: {
      'searchText': {
        handler: function ( value ) {
          this.$store.commit('SEARCH_TEXT', value);
          if (value.length === 0){
            this.displayNodes = this.contextsId;
            this.isSearchActive = false;
          }else{
            this.displayNodes = this.searchId;
          }
        }
      },
      immediate: true
    },
    mounted() {
      this.displayNodes = this.contextsId
    }
  }

</script>

<style>


    .plugin-graph-viewer {
        overflow: hidden;
    }

    .plugin-graph-viewer * {
        box-sizing: border-box;
        margin: 0px;
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
