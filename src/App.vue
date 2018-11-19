<template>
    <div class="plugin-graph-viewer">

        <top-bar :buttons="topBarButton"
                 :option="graph"
        />

        <div class="graph-manager-body">
            <side-bar
                    :buttons="sideBarButton"
                    :option="selectedNode"
            />
            <nodes-list
                    @node-selected="onNodeSelected($event)"
                    @hide-bim-object="onHideBimObject($event)"
                    @pull-node="onPullNode($event)"
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
                this.$store.commit("PULL_NODE", event);
            }
        }
    }

</script>

<style >

    .plugin-graph-viewer * {
        box-sizing: border-box
    }

    .plugin-graph-viewer {
        height: 100%;
    }

    .plugin-graph-viewer:hover{
        height: 100% ;
    }

    .docking-panel:hover * {
        background: #0d69ca;
    }

    .docking-panel * {
        background: #ff191c;
    }
    .graph-manager-body {
        display: flex;
        height: 100%;
        width: 100%;
    }
</style>
