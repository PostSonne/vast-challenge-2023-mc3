import React, {useMemo} from 'react';
import Container from "./components/Container";
import graphData from "./data/dataUpdated.json";
import {GraphData, Link, Node} from "./types/types";


const App: React.FC = () => {
    const data = (graphData as GraphData);

    let links: Link[] = [];
    const linkMap: any = {};

    const classifiedCompanyNodes: any = {};
    for (let l of data.links) {
        if (l.source && l.source.length > 1) {
            for (let s of l.source) {
                links.push({
                    source: s,
                    target: l.target[0],
                    type: l.type[0]
                });

                linkMap[s] = 1;
                linkMap[l.target[0]] = 1;

                if (l.type[0] === 'Beneficial Owner' || l.type[0] === 'Company Contacts') {
                    classifiedCompanyNodes[s] = 1;
                }
            }
        } else {
            links.push({
                source: l.source[0],
                target: l.target[0],
                type: l.type[0]
            });

            linkMap[l.source[0]] = 1;
            linkMap[l.target[0]] = 1;

            if (l.type[0] === 'Beneficial Owner' || l.type[0] === 'Company Contacts') {
                classifiedCompanyNodes[l.source[0]] = 1;
            }
        }
    }

    links = removeDuplicates(links);

    const nodes: Node[] = data.nodes.filter(item => item.id && item.id.length === 1).map(node => ({
        ...node,
        id: node.id[0],
        country: node.country ? node.country[0] : "",
        product_services: node.product_services ? node.product_services[0] : "",
        revenue_omu: node.revenue_omu ? node.revenue_omu[0] : "",
        type: (node.type && node.type[0].length > 0) ? node.type[0] : (classifiedCompanyNodes[node.id[0]] ? "Company" : "")
    }));

    const nodeIds: any = {};
    for (let n of nodes) {
        nodeIds[n.id] = 1;
    }

    const strangeNodes = data.nodes.filter(item => item.id && item.id.length > 1);
    for (let n of strangeNodes) {
        for (let id of n.id) {
            if (!nodeIds[id]) {
                nodes.push({
                    id: id, country: n.country ? n.country[0] : "",
                    product_services: n.product_services ? n.product_services[0] : "",
                    revenue_omu: n.revenue_omu ? n.revenue_omu[0] : "",
                    type: (n.type && n.type[0].length > 0) ? n.type[0] : (classifiedCompanyNodes[id] ? "Company" : "")
                })
            }
        }
    }

    const linkedNodes: Node[] = nodes.filter(item => linkMap[item.id]);

    /*const result = useMemo(() => {
        return constructAllSubgraphs(linkedNodes, links);
    }, [linkedNodes, links]);*/

    return (
        <div className="App">
            <Container nodes={nodes} links={links}/>
        </div>
    );
};

export function constructSubgraph(nodeId: string, nodes: Node[], links: Link[], depth?: number) {
    let subgraphNodeIds = new Set([nodeId]);
    let subgraphLinks = [];
    let nodesToVisit = [{ id: nodeId, depth: 0 }];
    let visitedNodes = new Set();

    while (nodesToVisit.length > 0) {
        let current = nodesToVisit.pop();
        let currentNode = current?.id;
        let currentDepth = current?.depth;

        if (!visitedNodes.has(currentNode) && (((depth === 0 || depth) && currentDepth) ? (currentDepth <= depth) : true)) {
            visitedNodes.add(currentNode);

            for (let link of links) {
                if (link.source === currentNode && !visitedNodes.has(link.target)) {
                    subgraphNodeIds.add(link.target);
                    subgraphLinks.push(link);
                    nodesToVisit.push({ id: link.target, depth: ((currentDepth || 0) + 1) });
                } else if (link.target === currentNode && !visitedNodes.has(link.source)) {
                    subgraphNodeIds.add(link.source);
                    subgraphLinks.push(link);
                    nodesToVisit.push({ id: link.source, depth: ((currentDepth || 0) + 1) });
                }
            }
        }
    }

    // Convert the set of node ids back to the node objects
    let subgraphNodes = nodes.filter(node => subgraphNodeIds.has(node.id));

    return {
        nodes: subgraphNodes,
        links: subgraphLinks
    };
}

export function constructAllSubgraphs(nodes: Node[], links: Link[]) {
    let allSubgraphs = [];
    let visitedNodes = new Set();

    for (let node of nodes) {
        if (!visitedNodes.has(node.id)) {
            let subgraph = constructSubgraph(node.id, nodes, links);
            allSubgraphs.push(subgraph);
            subgraph.nodes.forEach(n => visitedNodes.add(n.id));
        }
    }

    return allSubgraphs;
}

function removeDuplicates(arr: Link[]) {
    // Create a set to store unique pairs as strings
    const seen = new Set();

    // Use filter to keep only unique pairs
    return arr.filter(item => {
        // Create a string representation of the pair
        const pair = `${item.source}-${item.target}`;

        // Check if the pair is already in the set
        if (seen.has(pair)) {
            // If it's a duplicate, filter it out
            return false;
        } else {
            // If it's not a duplicate, add it to the set and keep it
            seen.add(pair);
            return true;
        }
    });
}

export default App;


