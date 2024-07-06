import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import {Node, Link} from "../types/types";
import {Simulation, style} from "d3";

interface GraphProps {
    nodes: Node[];
    links: Link[];
}

const Graph: React.FC<GraphProps> = ({ nodes, links }) => {
    const svgRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const svg = d3.select(svgRef.current);
        svg.selectAll('*').remove();
        const width = 800;
        const height = 600;

        const tooltip = svg
            .append("div")
            .style("opacity", 0)
            .style("position", 'absolute')
            .attr("class", "tooltip")
            .style("background-color", "white")
            .style("border", "solid")
            .style("border-width", "2px")
            .style("border-radius", "5px")
            .style("padding", "5px");

        const mouseover = function(event: any,d: any) {
            tooltip.style("opacity", 1)
                .style('display', 'block')
        }
        const mousemove = function(event: any,d: any) {
            tooltip
                .html(d.id ? `<p>Name: ${d.id}</p><p>Type: ${d.type === 'Company' ? 'Company' : 'Person'}</p>${d.revenue_omu ? (`<p>Revenue: ${d.revenue_omu}</p>`) : ''}${d.country ? (`<p>Country: ${d.country}</p>`) : ''}` : `<p>Link Type: ${d.type}</p>`)
                .style("left", event.x + "px")
                .style("top", event.y + "px")
        }
        const mouseleave = function(d: any) {
            tooltip.style("opacity", 0)
                .style("display",  "none")
        }

        const childSvg = svg.append("svg")
            .attr("width", width)
            .attr("height", height)

        let simulation: Simulation<Node, undefined>;
        simulation = d3.forceSimulation<Node>(nodes)
            .force('link', d3.forceLink<Node, Link>(links).id((d: any) => d.id))
            .force('charge', d3.forceManyBody().strength(-300))
            .force('center', d3.forceCenter(width / 2, height / 2));

        const linkBeneficiary = childSvg.append('g')
            .attr('stroke', '#057D9F')
            .attr('stroke-opacity', 0.9)
            .selectAll('line')
            .data(links.filter(item => item.type === 'Beneficial Owner'))
            .join("line")
            .attr("stroke-width", 5)
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave);

        const linkContacts = childSvg.append('g')
            .attr('stroke', '#00BD39')
            .attr('stroke-opacity', 0.6)
            .selectAll('line')
            .data(links.filter(item => item.type === 'Company Contacts'))
            .join("line")
            .attr("stroke-width", 3)
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave);

        const node = childSvg.append('g')
            .attr('stroke', '#fff')
            .attr('stroke-width', 1.5)
            .selectAll('circle')
            .data(nodes.filter(item => item.type !== 'Company'))
            .join("circle")
            .attr('r', 10)
            .attr('fill', '#FF2300')
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave)
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

        const companies = childSvg.append('g')
            .attr('stroke', '#fff')
            .attr('stroke-width', 1.5)
            .selectAll('circle')
            .data(nodes.filter(item => item.type === 'Company'))
            .join("circle")
            .attr('r', 20)
            .attr('fill', '#FF8100')
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave)
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

        /*const label = svg.append("g")
            .attr("class", "labels")
            .selectAll("text")
            .data(nodes)
            .enter().append("text")
            .text(node => (node.id))
            .attr("class", "label")

        label
            .style("text-anchor", "middle")
            .style("font-size", "14px");

        const linkLabelType = svg.append("g")
            .attr("class", "labels")
            .selectAll("text")
            .data(links)
            .enter().append("text")
            .text(link => (link.type))
            .attr("class", "linkLabel")

        linkLabelType
            .style("text-anchor", "middle")
            .style("font-size", "10px");*/


        simulation.on('tick', () => {
            linkBeneficiary
                .attr('x1', d => (d.source as any).x)
                .attr('y1', d => (d.source as any).y)
                .attr('x2', d => (d.target as any).x)
                .attr('y2', d => (d.target as any).y);

            linkContacts
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

            /*label
                .attr("x", d => (d as any).x)
                .attr("y", d => (d as any).y);

            linkLabelType
                .attr('x', d => (d.source as any).x > (d.target as any).x ? (d.source as any).x - ((Math.abs((d.source as any).x - (d.target as any).x)) / 2) : (d.source as any).x + ((Math.abs((d.source as any).x - (d.target as any).x)) / 2))
                .attr('y', d => (d.source as any).y > (d.target as any).y ? (d.source as any).y - ((Math.abs((d.source as any).y - (d.target as any).y)) / 2) : (d.source as any).y + ((Math.abs((d.source as any).y - (d.target as any).y)) / 2))*/
        });

    }, [nodes, links]);

    return (
        <div ref={svgRef}>
            {/*<svg style={{width: "800px", height: "500px"}} ref={svgRef}/>*/}
        </div>

    );
};

export default Graph;





