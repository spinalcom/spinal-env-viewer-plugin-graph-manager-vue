<template>
    <div class="plugin-graph-viewer">

        <top-bar class="graph-manager-top-bar"
                :buttons="topBarButton"
                 :option="graph"
        />

        <div class="graph-manager-body">
            <side-bar
                    :buttons="sideBarButton"
                    :option="selectedNode"
            />
            <nodes-list class="graph-viewer"
                    @node-selected="onNodeSelected($event)"
                    @hide-bim-object="onHideBimObject($event)"
                    @pull-children="onPullNode($event)"
                    :nodes="nodes"
                    :context-ids="contextIds"/>
        </div>
    </div>
</template>

<script>

    import Components from "spinal-env-viewer-vue-components-lib";
    import {mapState} from 'vuex'

    export default {
        name: 'graph-manager',
        components: {
            sideBar: Components.ToolsBar.SideBar,
            TopBar: Components.ToolsBar.TopBar,
            NodesList: Components.Nodes.NodeList
        },

        computed: mapState([
            'topBarButton',
            'sideBarButton',
            'nodes',
            'selectedNode',
            'contextIds',
            'graph'
        ]),

        methods: {
            onHideBimObject: function (event){
                console.log("hide bim obj event", event)
            },
            onNodeSelected: function (event) {
                this.$store.dispatch("onNodeSelected", event)
                    .then()
                    .catch(e => console.error(e))
                ;
            },
            onPullNode: function (event) {
                this.$store.commit("PULL_CHILDREN", event);
            }
        }
    }

</script>

<style >

    .plugin-graph-viewer * {
        box-sizing: border-box
    }

    .graph-viewer {
        border-left: 1px solid rgba(128, 128, 128, 0.64);
    }

    .graph-manager-top-bar{

        border-bottom: 1px solid rgba(128, 128, 128, 0.64);
    }

    .graph-manager-body {
        display: flex;
        height: 100%;
        width: 100%;
        overflow-y: auto;
        overflow-x: hidden;
    }
</style>
