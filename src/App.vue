<template>
    <div id="graph-manager">

        <top-bar :buttons="topBarButton"/>
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
            'selectedNode'
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
    #graph-manager-body {
        display: flex;
    }
</style>
