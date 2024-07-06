import React, {useRef, useEffect} from 'react';
import * as d3 from 'd3';
import {CountryProps} from "../types/types";

interface PieChartProps {
    countedCountries: CountryProps[],
    width: number,
    height: number,
}

const PieChart: React.FC<PieChartProps> = ({countedCountries, width, height}) => {
    const svgRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!countedCountries || countedCountries.length === 0) return;

        const radius = Math.min(width, height) / 2;

        const div = d3.select(svgRef.current);
        const svg = div.append('svg')
            .attr('width', width)
            .attr('height', height)
            .append('g')
            .attr('transform', `translate(${width / 2}, ${height / 2})`);

        const tooltip = div
            .append("div")
            .style("opacity", 0)
            .style("position", 'absolute')
            .attr("class", "tooltip")
            .style("background-color", "white")
            .style("border", "solid")
            .style("border-width", "2px")
            .style("border-radius", "5px")
            .style("padding", "5px");

        // Three function that change the tooltip when user hover / move / leave a cell
        const mouseover = function(event: any,d: any) {
            tooltip.style("opacity", 1)
                .style('display', 'block')
        }
        const mousemove = function(event: any,d: any) {
            tooltip
                .html(`<p>${d.data.name}</p>`)
                .style("left", event.x + "px")
                .style("top", event.y + "px")
        }
        const mouseleave = function(d: any) {
            tooltip.style("opacity", 0)
                .style("display",  "none")
        }

        const color = d3.scaleOrdinal(d3.schemeCategory10);

        const pie = d3.pie<{ name: string; value: number }>()
            .sort((a, b) => b.value - a.value)
            .value(d => d.value);

        const arc = d3.arc<d3.PieArcDatum<{ name: string; value: number }>>()
            .innerRadius(0)
            .outerRadius(radius);

        const arcTest = d3.arc<d3.PieArcDatum<{ name: string; value: number }>>()
            .innerRadius(0)
            .outerRadius(radius * 0.4);

        const outerArc = d3.arc<d3.PieArcDatum<{ name: string; value: number }>>()
            .innerRadius(radius * 1.1)
            .outerRadius(radius * 1.1);

        const outerArcFunc = (param: number) => {
            return d3.arc<d3.PieArcDatum<{ name: string; value: number }>>()
                .innerRadius(radius * param)
                .outerRadius(radius * param);
        }

        const arcs = svg.selectAll('arc')
            .data(pie(countedCountries))
            .enter()
            .append('g')
            .attr('class', 'arc');

        arcs.append('path')
            .attr('d', arc)
            .attr('fill', (d, i) => color(i.toString()))
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave);

        /*arcs.append('text')
            .attr('transform', d => {
                //const pos = outerArc.centroid(d);
                const midAngle = (d.startAngle + d.endAngle) / 2;
                const param = (Math.PI * 2 - midAngle) < 0.5 * Math.PI ? 0.3 + Math.pow((Math.PI * 0.5 - (Math.PI * 2 - midAngle)) / (Math.PI * 0.5), 8) : 0.8;
                const pos = outerArcFunc(param).centroid(d);
                pos[0] = radius * (midAngle < Math.PI ? 1 : -1);
                return `translate(${pos})`;
            })
            .attr('dy', '0.35em')
            .attr('text-anchor', d => (d.startAngle + d.endAngle) / 2 < Math.PI ? 'start' : 'end')
            .text(d => d.data.name);*/

        // Add lines between slices and labels
        /*arcs.append('polyline')
            // @ts-ignore
            .attr('points', d => {
                //const pos = outerArc.centroid(d);
                const midAngle = (d.startAngle + d.endAngle) / 2;
                if ((Math.PI * 2 - midAngle) < 0.5 * Math.PI) {}
                const param = (Math.PI * 2 - midAngle) < 0.5 * Math.PI ? 0.3 + Math.pow((Math.PI * 0.5 - (Math.PI * 2 - midAngle)) / (Math.PI * 0.5), 8) : 0.8;
                const pos = outerArcFunc(param).centroid(d);
                pos[0] = radius * 0.95 * (midAngle < Math.PI ? 1 : -1);
                return [arcTest.centroid(d), outerArcFunc(param).centroid(d), pos];
            })
            .style('fill', 'none')
            .style('stroke', 'black');*/

        return () => {
            // eslint-disable-next-line react-hooks/exhaustive-deps
            d3.select(svgRef.current).selectAll('*').remove();
        };
    }, [countedCountries, width, height]);

    return (
        <div style={{width: '100%'}} ref={svgRef}>
        </div>
    );
};

export default PieChart;
