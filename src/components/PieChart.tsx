import React, {useRef, useEffect, useState} from 'react';
import * as d3 from 'd3';
import {CountryProps} from "../types/types";

interface PieChartProps {
    countedCountries: CountryProps[],
    width: number,
    height: number,
    selectedCountries: string[],
    onSetCountry: (countries: string[]) => void;
}

const PieChart: React.FC<PieChartProps> = ({countedCountries, width, height, selectedCountries, onSetCountry}) => {
    const svgRef = useRef<HTMLDivElement | null>(null);

    function clicked (event: { defaultPrevented: any; }, d: any) {
        if (event.defaultPrevented) {return}
        const index = selectedCountries.indexOf(d.data.name);
        if (index > -1) {
            onSetCountry(selectedCountries.filter(item => item !== d.data.name));

        } else {
            onSetCountry([
                ...selectedCountries,
                d.data.name
            ]);
        }
    }

    useEffect(() => {
        if (!countedCountries || countedCountries.length === 0) return;

        const radius = Math.min(width, height) / 2.5;
        const names = countedCountries.sort((a,b) => b.value - a.value).map(i => i.name);

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
            // @ts-ignore
            d3.select(this)
                .style("opacity", 0.8)
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
            // @ts-ignore
            d3.select(this)
                .style("opacity", 1)
            tooltip.style("opacity", 0)
                .style("display",  "none")
        }

        const pie = d3.pie<{ name: string; value: number }>()
            .sort((a, b) => b.value - a.value)
            .padAngle(0.04)
            .value(d => d.value);

        const arc = d3.arc<d3.PieArcDatum<{ name: string; value: number }>>()
            .innerRadius(0)
            //@ts-ignore
            .outerRadius((_, d: Datum) =>  {
                return (selectedCountries.includes(names[d])) ? radius * 1.1 : radius;
            });


        let colors;
        if (colors === undefined) colors = d3.schemeSpectral[names.length];
        if (colors === undefined) colors = d3.quantize(t => d3.interpolateSpectral(0.9 * (1 - t) + 0.1), names.length);

        const color = d3.scaleOrdinal(names, colors);

        const arcs = svg.selectAll('arc')
            .data(pie(countedCountries))
            .enter()
            .append('g')
            .attr('class', 'arc');

        arcs.append('path')
            .attr('d', arc)
            .attr('fill', (d, i) => color(names[names.indexOf(d.data.name)]))
            .attr('opacity', '1')
            .attr('stroke', (d: any) => selectedCountries.includes(d.data.name) ? '#000' : '')
            .attr('stroke-width', (d: any) => selectedCountries.includes(d.data.name) ? '3' : '')
            .on("click", clicked)
            .on("mouseover", mouseover)
            .on("mouseleave", mouseleave)
            .on("mousemove", mousemove)
        ;

        return () => {
            // eslint-disable-next-line react-hooks/exhaustive-deps
            d3.select(svgRef.current).selectAll('*').remove();
        };
    }, [countedCountries, width, height, selectedCountries]);

    return (
        <div style={{width: '100%'}} ref={svgRef}>
        </div>
    );
};

export default PieChart;
