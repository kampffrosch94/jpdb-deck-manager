<script lang="ts">
    //tsignore
    import Plotly, { type Data } from "plotly.js-dist";

    import { onMount, tick } from "svelte";

    export let data: { x: number[]; y: number[] };
    onMount(async () => {
        await tick();
        const layout = {
            xaxis: { title: "extra words learned" },
            yaxis: { title: "coverage" },
        };

        const plot_data = {
            ...data,
            type: "scatter",
            hovertemplate: "%{x}, %{y:.2f}<extra></extra>",
        };
        console.log(data);
        // @ts-ignore
        Plotly.newPlot("graph", [plot_data], layout);
    });
</script>

<div id="graph"></div>
