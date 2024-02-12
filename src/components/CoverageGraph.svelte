<script lang="ts">
    import Plotly, { type Data } from "plotly.js-dist";

    import { onMount, tick } from "svelte";

    export let data: { x: number[]; y: number[]; occs: number[] };
    export let title = "";

    function filterByOcc(
        arr: number[],
        occs: number[],
        predicate: (num: number) => boolean,
    ) {
        let r = [];
        for (let index = 0; index < arr.length; index++) {
            if (predicate(occs[index])) {
                r.push(arr[index]);
            }
        }
        return r;
    }

    onMount(async () => {
        await tick();
        const layout = {
            xaxis: { title: "extra words learned" },
            yaxis: { title: "coverage" },
            title: title,
        };
        const plot_data_5ormore = {
            x: filterByOcc(data.x, data.occs, (it) => it >= 5),
            y: filterByOcc(data.y, data.occs, (it) => it >= 5),
            mode: "lines",
            hovertemplate: "%{x}, %{y:.2f}<extra></extra>",
            name: "5 or more occurences",
        };
        const plot_data_4 = {
            x: filterByOcc(data.x, data.occs, (it) => it == 4),
            y: filterByOcc(data.y, data.occs, (it) => it == 4),
            mode: "lines",
            hovertemplate: "%{x}, %{y:.2f}<extra></extra>",
            name: "4 occurences",
        };
        const plot_data_3 = {
            x: filterByOcc(data.x, data.occs, (it) => it == 3),
            y: filterByOcc(data.y, data.occs, (it) => it == 3),
            mode: "lines",
            hovertemplate: "%{x}, %{y:.2f}<extra></extra>",
            name: "3 occurences",
        };
        const plot_data_2 = {
            x: filterByOcc(data.x, data.occs, (it) => it == 2),
            y: filterByOcc(data.y, data.occs, (it) => it == 2),
            mode: "lines",
            hovertemplate: "%{x}, %{y:.2f}<extra></extra>",
            name: "2 occurences",
            //line: { color: "orange" },
        };
        const plot_data_1 = {
            x: filterByOcc(data.x, data.occs, (it) => it == 1),
            y: filterByOcc(data.y, data.occs, (it) => it == 1),
            mode: "lines",
            hovertemplate: "%{x}, %{y:.2f}<extra></extra>",
            name: "1 occurence",
            //line: { color: "coral" },
        };
        Plotly.newPlot(
            "graph",
            [
                plot_data_5ormore,
                plot_data_4,
                plot_data_3,
                plot_data_2,
                plot_data_1,
            ],
            layout,
        );
    });
</script>

<div id="graph"></div>
