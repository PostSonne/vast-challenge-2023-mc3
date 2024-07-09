import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import {CountryProps} from "../types/types";

interface BarChartProps {
    data: CountryProps[];
    width: number;
    height: number;
    barColor: string;
}

const BarChart: React.FC<BarChartProps> = ({ data, width, height, barColor }) => {
    const ref = useRef<SVGSVGElement | null>(null);

    const countryValues = data.map(i => i.value);
    const countryNames = data.map(i => i.name);
    const dataSorted = countryValues.sort((a,b) => b - a);

    useEffect(() => {
        if (!ref.current) return;

        const scaleLength = d3.scaleLinear().domain([0, 2600]).range([0, width]);
        const scaleY = d3.scaleBand<number>().domain(d3.range(dataSorted.length)).range([0, height]).paddingInner(0.09);

        const svg = d3.select(ref.current);

        const gs = svg
            .selectAll('g')
            .data(countryValues)
            .join('g')
            .attr('transform', (d, i) => `translate(${10},${scaleY(i)})`)
            .attr('font-family', 'Roboto, Arial, Helvetica, sans-serif')
            .attr('font-size','14px');

        gs.selectAll('rect')
            .data((d) => [d])
            .join('rect')
            .attr('height', scaleY.bandwidth())
            .attr('width', scaleLength)
            .attr('fill', barColor)
            .attr('opacity', '0.4');

        gs.selectAll('text')
            .data((d) => [d])
            .join('text')
            .attr('dx', 350)
            .attr('y', scaleY.bandwidth())
            .attr('dy', -5)
            .text((d) => d);

        const names = svg
            .selectAll('g')
            .data(countryNames)
            .join('g');

        names.selectAll('textName')
            .data((d) => [d])
            .join('text')
            .attr('dx', 5)
            .attr('y', scaleY.bandwidth())
            .attr('dy', -5)
            .text((d) => d);

    }, [data, width, height, barColor]);

    return <svg ref={ref} width={width + 20} height={height}></svg>;
};

export default BarChart;