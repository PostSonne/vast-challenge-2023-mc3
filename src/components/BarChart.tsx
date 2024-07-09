import React, {useRef, useEffect, useState} from 'react';
import * as d3 from 'd3';
import {CountryProps} from "../types/types";

interface BarChartProps {
    data: CountryProps[];
    width: number;
    height: number;
    barColor: string;
    selectedCountries: string[],
    onSetCountry: (countries: string[]) => void;
}

const BarChart: React.FC<BarChartProps> = ({ data, width, height, barColor, selectedCountries, onSetCountry }) => {
    const ref = useRef<SVGSVGElement | null>(null);

    const countryNames = data.map(i => i.name);
    const dataSorted = data.sort((a,b) => b.value - a.value);

    function clicked (event: { defaultPrevented: any; }, d: any) {
        if (event.defaultPrevented) {return}
        const index = selectedCountries.indexOf(d.name);
        if (index > -1) {
            onSetCountry(selectedCountries.filter(item => item !== d.name));
        } else {
            onSetCountry([
                ...selectedCountries,
                d.name
            ]);
        }
    }

    useEffect(() => {
        if (!ref.current) return;
        const scaleLength = d3.scaleLinear().domain([0, 2600]).range([0, width]);
        const scaleY = d3.scaleBand<number>().domain(d3.range(dataSorted.length)).range([0, height]).paddingInner(0.1);

        const svg = d3.select(ref.current);

        const gs = svg
            .selectAll('g')
            .data(data)
            .join('g')
            .attr('transform', (d, i) => `translate(${10},${scaleY(i)})`)
            .attr('font-family', 'Roboto, Arial, Helvetica, sans-serif')
            .attr('font-size','14px');

        gs.selectAll('rect')
            .data((d) => [d])
            .join('rect')
            .attr('height', scaleY.bandwidth())
            .attr('width', (d) => scaleLength(d.value))
            .attr('fill', barColor)
            .attr('opacity', '1')
            .attr('stroke', (d: any) => selectedCountries.includes(d.name) ? '#000' : '')
            .attr('stroke-width', (d: any) => selectedCountries.includes(d.name) ? '3' : '')
            .on("click", clicked);

        gs.selectAll('text')
            .data((d) => [d])
            .join('text')
            .attr('dx', 350)
            .attr('y', scaleY.bandwidth())
            .attr('dy', -7)
            .text((d) => d.value);

        const names = svg
            .selectAll('g')
            .data(countryNames)
            .join('g');

        names.selectAll('textName')
            .data((d) => [d])
            .join('text')
            .attr('dx', width / 2)
            .attr('y', scaleY.bandwidth())
            .attr('dy', -7)
            .text((d) => d);

        return () => {
            // eslint-disable-next-line react-hooks/exhaustive-deps
            d3.select(ref.current).selectAll('*').remove();
        };

    }, [data, width, height, barColor, selectedCountries]);

    return <svg ref={ref} width={width + 20} height={height}></svg>;
};

export default BarChart;
