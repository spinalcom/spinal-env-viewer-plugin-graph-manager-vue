<template>
    <div class="plugin-graph-viewer">

        <top-bar
                :buttons="topBarButton"
                :option="graph"
        />
    <div class="graph-manager-body">
        <side-bar :buttons="sideBarButton" :option="selectedNode"/>
        <nodes-list @node-selected="onNodeSelected($event)" :nodes="nodes"/>
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
            'graph'
        ]),
        methods:
            {
                onNodeSelected: function (node) {
                    this.$store.dispatch("onNodeSelected", node);
                }
            }

    }

</script>

<style scoped>
    .plugin-graph-viewer{
        height: 100%;
    }
    .graph-manager-body {
        display: flex;
        height: 100%;
    }
</style>
