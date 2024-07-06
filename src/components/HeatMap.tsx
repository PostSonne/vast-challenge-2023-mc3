import React, {useEffect, useRef} from "react";
import * as d3 from 'd3';
import {Node} from "../types/types";

type HeatmapProps = {
    heatMapData: (string | number)[][];
    width: number;
    height: number;
    nodes: Node[]
};

const HeatMap: React.FC<HeatmapProps> = ({nodes, width, height, heatMapData}) => {
    const divRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (divRef.current) {
            const div = d3.select(divRef.current);

            // Clear previous content
            div.selectAll('*').remove();

            const margin = {top: 0, right: 20, bottom: 40, left: 140},
                width = 800 - margin.left - margin.right,
                height = 600 - margin.top - margin.bottom;

// append the svg object to the body of the page
            const root = div
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", `translate(${margin.left},${margin.top})`);

            const x = d3.scaleBand()
                .range([ 0, width ])
                .domain(heatMapData.map(item => item[0]) as string[])
                .padding(0.01);
            root.append("g")
                .attr("transform", `translate(0, ${height})`)
                .call(d3.axisBottom(x))

// Build X scales and axis:
            const y = d3.scaleBand()
                .range([ height, 0 ])
                .domain(heatMapData.map(item => item[1]) as string[])
                .padding(0.01);
            root.append("g")
                .call(d3.axisLeft(y));

// Build color scale
            const myColor = d3.scaleLinear()
                // @ts-ignore
                .range(["white", "#69b3a2"])
                .domain([Math.min(...heatMapData.map(item => item[2]) as number[]), Math.max(...heatMapData.map(item => item[2]) as number[])])


                // create a tooltip
                const tooltip = div
                    .append("div")
                    .style("opacity", 0)
                    .attr("class", "tooltip")
                    .style("background-color", "white")
                    .style("border", "solid")
                    .style("border-width", "2px")
                    .style("border-radius", "5px")
                    .style("padding", "5px")

                // Three function that change the tooltip when user hover / move / leave a cell
                const mouseover = function(event: any,d: any) {
                    tooltip.style("opacity", 1)
                }
                const mousemove = function(event: any,d: any) {
                    tooltip
                        .html("The exact value of<br>this cell is: " + d[2])
                        .style("left", (event.x)/2 + "px")
                        .style("top", (event.y)/2 + "px")
                }
                const mouseleave = function(d: any) {
                    tooltip.style("opacity", 0)
                }

                // add the squares
            root.selectAll()
                    .data(heatMapData, function(d:any) {return d && d[0] + ':' + d[1];})
                    .enter()
                    .append("rect")
                    .attr("x", function(d:any) { return d && x(d[0]) })
                    .attr("y", function(d:any) { return d && y(d[1]) })
                    .attr("width", x.bandwidth() )
                    .attr("height", y.bandwidth() )
                    .style("fill", function(d) { return myColor(d[2] as number)} )
                    .on("mouseover", mouseover)
                    .on("mousemove", mousemove)
                    .on("mouseleave", mouseleave)
            }
    }, [heatMapData, width, height, nodes]);

    return (
        <div ref={divRef}/>
    );
};

export default HeatMap;
