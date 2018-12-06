<template>
    <div class="plugin-graph-viewer">

        <top-bar class="graph-manager-top-bar"
                 :buttons="topBarButton"
                 :option="graph"
        />

        <div class="graph-manager-body">

            <side-bar class="graph-manager-side-bar"
                      :buttons="sideBarButton"
                      :option="selectedNode"
            />

            <nodes-list class="graph-viewer"
                        @node-selected="onNodeSelected($event)"
                        @hide-bim-object="onHideBimObject($event)"
                        @pull-children="onPullNode($event)"
                        @active-node="onActiveNode($event)"

                        :nodes="nodes"
                        :context-ids="contextIds"
                        :childrenIds="childrenIds"
                        :active-node="activeNode"/>


        </div>
    </div>
</template>

<script>

  import {
    NodeList,
    SideBar,
    TopBar
  } from "spinal-env-viewer-vue-components-lib";
  import { mapState } from 'vuex'

  export default {
        name: 'graph-manager',
        components: {
            sideBar: SideBar,
            TopBar: TopBar,
            NodesList: NodeList
        },

        computed: mapState([
            'topBarButton',
            'sideBarButton',
            'nodes',
            'selectedNode',
            'contextIds',
            'childrenIds',
            'graph',
            'activeNode'
        ]),

        methods: {
            onHideBimObject: function (event) {
                console.log("hide bim obj event", event)
            },

            onNodeSelected: function (event) {
                this.$store.dispatch("onNodeSelected", event)
                    .then()
                    .catch(e => console.error(e));
            },

            onPullNode: function (event) {
                this.$store.commit("PULL_CHILDREN", event);
            },

            onActiveNode: function (event) {
                this.$store.commit('SET_ACTIVE_NODE', event)
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
          }
        },


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
        background-color: rgba(52, 52, 52, 0.85);
        border-bottom: 1px solid rgba(128, 128, 128, 0.64);
    }

    .graph-manager-side-bar {
        background-color: rgba(52, 52, 52, 0.85);
        border-bottom: 1px solid rgba(128, 128, 128, 0.64);
    }

    .graph-manager-body {
        display: flex;
        height: 100%;
        width: 100%;
    }
</style>
