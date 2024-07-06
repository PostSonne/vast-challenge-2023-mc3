import React, {useRef, useEffect, useState} from 'react';
import * as d3 from 'd3';
import {CountryProps, Node} from "../types/types";

interface PieChartProps {
    countedCountries: CountryProps[],
    width: number,
    height: number,
}

const PieChart: React.FC<PieChartProps> = ({countedCountries, width, height}) => {
    const svgRef = useRef<SVGSVGElement | null>(null);

    const [selectedCountries, setSelectedCountries] = useState<string[]>([]);

    function clicked (event: { defaultPrevented: any; }, d: any) {
        if (event.defaultPrevented) {return}
        const index = selectedCountries.indexOf(d.data.name);
        if (index > -1) {
            setSelectedCountries(selectedCountries.filter(item => item !== d.data.name));

        } else {
            setSelectedCountries([
                ...selectedCountries,
                d.data.name
            ]);
        }
    }

    function mouseover(event: any, d: any) {
        // @ts-ignore
        d3.select(this)
            .style("opacity", 0.8)
    }

    function mouseleave(event: any, d: any) {
        // @ts-ignore
        d3.select(this)
            .style("opacity", 1)
    }

    function mousemove(event: any, d: any) {}

    useEffect(() => {
        if (!countedCountries || countedCountries.length === 0) return;

        const radius = Math.min(width, height) / 3;
        const names = countedCountries.sort((a,b) => b.value - a.value).map(i => i.name);

        const svg = d3.select(svgRef.current)
            .attr('width', width)
            .attr('height', height)
            .append('g')
            .attr('transform', `translate(${width / 2}, ${height / 2})`);

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

        const arcTest = d3.arc<d3.PieArcDatum<{ name: string; value: number }>>()
            .innerRadius(0)
            .outerRadius(radius * 0.4);

        const outerArcFunc = (param: number) => {
            return d3.arc<d3.PieArcDatum<{ name: string; value: number }>>()
                .innerRadius(radius * param)
                .outerRadius(radius * param);
        }

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
                const midAngle = (d.startAngle + d.endAngle) / 2;
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
    }, [countedCountries, width, height, selectedCountries]);

    return <svg ref={svgRef}></svg>;
};

export default PieChart;
