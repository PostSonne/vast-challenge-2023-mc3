import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import {GraphData, Node, Link, NodeGraph, LinkGraph} from "../types/types";
import {Simulation} from "d3";

interface GraphProps {
    nodes: Node[];
    links: Link[];
}

const Graph: React.FC<GraphProps> = ({ nodes, links }) => {
    const svgRef = useRef<SVGSVGElement | null>(null);

    console.log(nodes);

    useEffect(() => {
        const svg = d3.select(svgRef.current);
        svg.selectAll('*').remove();
        const width = 800;
        const height = 600;

        let simulation: Simulation<Node, undefined>;
        simulation = d3.forceSimulation<Node>(nodes)
            .force('link', d3.forceLink<Node, Link>(links).id((d: any) => d.id))
            .force('charge', d3.forceManyBody().strength(-1000))
            .force('center', d3.forceCenter(width / 2, height / 2));

        const link = svg.append('g')
            .attr('stroke', '#999')
            .attr('stroke-opacity', 0.6)
            .selectAll('line')
            .data(links)
            .join("line")
            .attr("stroke-width", 2);

        const node = svg.append('g')
            .attr('stroke', '#f700fe')
            .attr('stroke-width', 10)
            .selectAll('circle')
            .data(nodes.filter(item => item.type !== 'Company'))
            .join("circle")
            .attr('r', 1)
            .attr('fill', 'blue')
            .call(d3.drag<any, Node>()
                .on('start', (event, d) => {
                    if (!event.active) simulation.alphaTarget(0.3).restart();
                    d.fx = d.x;
                    d.fy = d.y;
                })
                .on('drag', (event, d) => {
                    d.fx = event.x;
                    d.fy = event.y;
                })
                .on('end', (event, d) => {
                    if (!event.active) simulation.alphaTarget(0);
                    d.fx = null;
                    d.fy = null;
                }));

        const companies = svg.append('g')
            .attr('stroke', '#48fe00')
            .attr('stroke-width', 30)
            .selectAll('circle')
            .data(nodes.filter(item => item.type === 'Company'))
            .join("circle")
            .attr('r', 1)
            .attr('fill', 'blue')
            .call(d3.drag<any, Node>()
                .on('start', (event, d) => {
                    if (!event.active) simulation.alphaTarget(0.3).restart();
                    d.fx = d.x;
                    d.fy = d.y;
                })
                .on('drag', (event, d) => {
                    d.fx = event.x;
                    d.fy = event.y;
                })
                .on('end', (event, d) => {
                    if (!event.active) simulation.alphaTarget(0);
                    d.fx = null;
                    d.fy = null;
                }));

        const label = svg.append("g")
            .attr("class", "labels")
            .selectAll("text")
            .data(nodes)
            .enter().append("text")
            .text(node => (node.id))
            .attr("class", "label")

        label
            .style("text-anchor", "middle")
            .style("font-size", "10px");

        const linkLabelType = svg.append("g")
            .attr("class", "labels")
            .selectAll("text")
            .data(links)
            .enter().append("text")
            .text(link => (link.type))
            .attr("class", "linkLabel")

        linkLabelType
            .style("text-anchor", "middle")
            .style("font-size", "6px");


        simulation.on('tick', () => {
            link
                .attr('x1', d => (d.source as any).x)
                .attr('y1', d => (d.source as any).y)
                .attr('x2', d => (d.target as any).x)
                .attr('y2', d => (d.target as any).y);

            node
                .attr('cx', d => (d as any).x)
                .attr('cy', d => (d as any).y);
            companies
                .attr('cx', d => (d as any).x)
                .attr('cy', d => (d as any).y);

            label
                .attr("x", d => (d as any).x)
                .attr("y", d => (d as any).y);

            linkLabelType
                .attr('x', d => (d.source as any).x > (d.target as any).x ? (d.source as any).x - ((Math.abs((d.source as any).x - (d.target as any).x)) / 2) : (d.source as any).x + ((Math.abs((d.source as any).x - (d.target as any).x)) / 2))
                .attr('y', d => (d.source as any).y > (d.target as any).y ? (d.source as any).y - ((Math.abs((d.source as any).y - (d.target as any).y)) / 2) : (d.source as any).y + ((Math.abs((d.source as any).y - (d.target as any).y)) / 2))
        });

    }, [nodes, links]);

    return (
        <svg style={{width: '100%'}} ref={svgRef}/>
    );
};

export default Graph;





