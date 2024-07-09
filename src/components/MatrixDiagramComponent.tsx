//@ts-nocheck
import React, {useEffect, useRef} from 'react';
import * as d3 from 'd3';
import {Link, Node} from "../types/types";

interface GraphProps {
    nodes: Node[];
    links: Link[];
}

const MatrixDiagramComponent: React.FC<GraphProps> = ({nodes, links}) => {
    const svgRef = useRef<SVGSVGElement | null>(null);

    const idToNode = {};

    const resultNodes = [];

    for (let n of nodes) {
        const node = {...n, degree: 0}
        resultNodes.push(node);
        idToNode[n.id] = node;
    }

    useEffect(() => {
        const svg = d3.select(svgRef.current);
        svg.selectAll('*').remove();

        const margin = {
            top: 175,
            right: 0,
            bottom: 0,
            left: 175
        };
        const width = 825 - margin.left - margin.right;
        const height = 825 - margin.top - margin.bottom;
        const opacity = d3.scaleLinear()
            .domain([0, 4])
            .range([0.25, 1])
            .clamp(true);
        const x = d3.scaleBand()
            .rangeRound([0, width])
            .paddingInner(0.2)
            .align(0);
        const svgDOM = svg
            .attr('class', 'matrixdiagram')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom);

        const svgG = svgDOM.append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

        const resultLinks = links.map(item => ({...item}));

        resultLinks.forEach(function (e) {
            e.source = idToNode[e.source];
            e.target = idToNode[e.target];
            e.source.degree++;
            e.target.degree++;
        });
        resultNodes.sort(function (a, b) {
            return b.group - a.group;
        });

        x.domain(d3.range(resultNodes.length));
        opacity.domain([0, d3.max(resultNodes, function (d) { return d.degree; })]);

        const matrix = resultNodes.map(function (outer, i) {
            outer.index = i;
            return resultNodes.map(function (inner, j) {
                return {i: i, j: j, val: i === j ? inner.degree : 0};
            });
        });

        resultLinks.forEach(function (l) {
            matrix[l.source.index][l.target.index].val = l.type;
            matrix[l.target.index][l.target.index].val = l.type;
            matrix[l.source.index][l.source.index].val = l.type;
            matrix[l.target.index][l.source.index].val = l.type;
        });
        const row = svgG.selectAll('g.row')
            .data(matrix)
            .enter().append('g')
            .attr('class', 'row')
            .attr('transform', function (d, i) { return 'translate(0,' + x(i) + ')'; })
            .each(makeRow);
        row.append('text')
            .attr('class', 'label')
            .attr('font-size','12px')
            .attr('x', -175)
            .attr('y', x.bandwidth() / 2)
            .attr('dy', '0.5em')
            .text(function (d, i) { return resultNodes[i].id && resultNodes[i].id.length > 20 ? (resultNodes[i].id.slice(0, 20) + '…') : resultNodes[i].id; });

        const column = svg.selectAll('g.column')
            .data(matrix)
            .enter().append('g')
            .attr('class', 'column')
            .attr('transform', function(d, i) { return 'translate(' + x(i) + ', 0)rotate(-90)'; })
            .append('text')
            .attr('class', 'label')
            .attr('font-size','12px')
            .attr('x', -170)
            .attr('y', 179)
            .attr('dy', '0.32em')
            .text(function (d, i) { return resultNodes[i].id && resultNodes[i].id.length > 20 ? (resultNodes[i].id.slice(0, 20) + '…') : resultNodes[i].id; });

        function makeRow(rowData) {
            const cell = d3.select(this).selectAll('rect')
                .data(rowData)
                .enter().append('rect')
                .attr('x', function (d, i) { return x(i); })
                .attr('width', x.bandwidth())
                .attr('height', x.bandwidth())
                .style('fill-opacity', function (d) { return opacity(d.val); })
                .style('fill', function (d) {
                    if (d.i === d.j) {
                        return '#dcdcdc';
                    }

                    if (d.val === 'Beneficial Owner') {
                        return '#FF8100';
                    }

                    if (d.val === 'Company Contacts') {
                        return '#057D9F';
                    }

                    return '#FFFFFF';

                })
                .on('mouseover', function (_, d) {
                    row.filter(function (_, i) { return d.i === i; })
                        .selectAll('text')
                        .style('fill', '#A65400')
                        .style('font-weight', 'bold');
                    column.filter(function (_, j) { return d.j === j; })
                        .style('fill', '#A65400')
                        .style('font-weight', 'bold');
                })
                .on('mouseout', function () {
                    row.selectAll('text')
                        .style('fill', null)
                        .style('font-weight', null);
                    column
                        .style('fill', null)
                        .style('font-weight', null);
                });
            cell.append('title')
                .text(function (d) {
                    return resultNodes[d.i].id;
                });
        }
    }, [nodes, links]);

    return (
        <svg style={{width: '100%'}} ref={svgRef}/>
    );
};

export default MatrixDiagramComponent;





