import React, {useEffect, useState} from 'react';
import List from './List';
import data from "./data/dataUpdated.json";
import {GraphData, Link, Node} from "./types";
import Graph from "./Graph";

// @ts-ignore
const Container: React.FC = () => {
    const nodes = (data as GraphData).nodes.map(node => ({
        ...node,
        id: node.id[0],
        country: node.country ? node.country[0] : "",
        product_services: node.product_services ? node.product_services[0] : "",
        revenue_omu: node.revenue_omu ? node.revenue_omu[0] : 0,
        type: node.type ? node.type[0]: ""
    }));

    const links = (data as GraphData).links.map(link => ({
        source: link.source[0],
        target: link.target[0],
        type: link.type[0]
    }));

    const countries: any = {};

    for (let n of nodes) {
        countries[n.country] = 1;
    }

    const [selectedNode, setSelectedNode] = useState<Node | null>(null);

    const handleItemClick = (item: Node) => {
        setSelectedNode(item);
    };

    const nodesTypeCompany = nodes.filter(item => item.type === "Company").length;
    const nodesTypePerson = nodes.filter(item => item.type === "Person").length;
    const nodesTypeBeneficialOwner= nodes.filter(item => item.type === "Beneficial Owner").length;
    const nodesTypeCompanyContacts  = nodes.filter(item => item.type === "Company Contacts").length;

    const countryNames = nodes.map(item => item.country);
    const countryNamesFiltered = countryNames.filter((c, index, arr) => {
        return arr.indexOf(c) === index;
    });

    const productServices = nodes.map(item => item.product_services);
    const productServicesFiltered = productServices.filter((c, index, arr) => {
        return arr.indexOf(c) === index;
    });

    const nodesWithEmptyProductServices = nodes.filter(item => item.product_services === "").length;
    const nodesWithNonEmptyProductServices = nodes.length - nodesWithEmptyProductServices;
    const nodesWithUnknownProductServices = nodes.filter(item => item.product_services === "Unknown").length;

    const linksTypePerson = links.filter(item => item.type === "Person").length;
    const linksTypeBeneficialOwner= links.filter(item => item.type === "Beneficial Owner").length;
    const linksTypeCompanyContacts  = links.filter(item => item.type === "Company Contacts").length;

    const nodesWithEmptyRevOmu = nodes.filter(item => item.revenue_omu === undefined || item.revenue_omu === "Unknown" || item.revenue_omu === 0).length;
    const nodesWithRevOmu = nodes.length - nodesWithEmptyRevOmu;

    const revOmu = nodes.map(item => item.revenue_omu);

    const revOmuFiltered = revOmu.filter((number, index) => {
        return revOmu.indexOf(number) !== index;
    });

    const withoutNull = revOmuFiltered.filter(item => item !== "Unknown" && item !== 0);

    const withoutNullFiltered = withoutNull.filter((c, index, arr) => {
        return arr.indexOf(c) === index;
    });
    const nodesWIthDuplicatedRevOmu = nodes.filter(item => withoutNullFiltered.includes(item.revenue_omu)).length;

    //анализировать на первоначальном датасете?
    console.log(
        `Nodes with type 'Company': ${nodesTypeCompany}\n` +
        `Nodes with type 'Person': ${nodesTypePerson}\n` +
        `Nodes with type 'Beneficial Owner': ${nodesTypeBeneficialOwner}\n` +
        `Nodes with type 'Company Contacts': ${nodesTypeCompanyContacts}\n` +
        `Nodes with empty 'Product_services': ${nodesWithEmptyProductServices}\n` +
        `Nodes with non-empty 'Product_services': ${nodesWithNonEmptyProductServices}\n` +
        `Nodes with "Unknown" 'Product_services': ${nodesWithUnknownProductServices}\n` +
        //`Product_services: ${productServicesFiltered}\n` +
        `Product_services counter: ${productServicesFiltered.length}\n` +
        `Country names: ${countryNamesFiltered}\n` +
        `Country counter: ${countryNamesFiltered.length}\n` +
        `Links with type 'Beneficial Owner': ${linksTypeBeneficialOwner}\n` +
        `Links with type 'Company Contacts': ${linksTypeCompanyContacts}\n` +
        `Links with type 'Person': ${linksTypePerson}\n` +
        `Nodes with empty 'revenue_omu': ${nodesWithEmptyRevOmu}\n` +
        `Nodes with non-empty 'revenue_omu': ${nodesWithRevOmu}\n` +
        `Duplicated 'revenue_omu': ${withoutNullFiltered}\n` +
        `Duplicated 'revenue_omu' counter: ${withoutNullFiltered.length}\n` +
        `Nodes with duplicated 'revenue_omu': ${nodesWIthDuplicatedRevOmu}\n`
    );

    let finalNodes: Node[] = [];
    let finalLinks: Link[] = [];
    let checkedNodes: Node[] = [];
    let checkedMap: any = {};
    if (selectedNode) {
        checkedMap[selectedNode.id] = 1;
    }

    const returnAllNodesAndLinksForSelectedNode = (node: Node | null, finalNodes: Node[], finalLinks: Link[], checkedNodes: Node[], checkedMap: any) => {
        if (node) {
            //checkedNodes.push(node);
            checkedMap[node.id] = 1;
        }

        if (node?.depth && node?.depth > 3) {
            return;
        }


        const exampleLinks = links.filter((i) => i.source === node?.id || i.target === node?.id);

        let isAllFinal = true;
        for (let l of exampleLinks) {
            let isIncluded = false;
            for (let fl of finalLinks) {
                if (fl.target === l.target && fl.source === l.source){
                    isIncluded = true;
                }
            }
            if (!isIncluded) {
                isAllFinal = false;
                finalLinks.push(l);
            }
        }

        if (isAllFinal) {
            return {finalNodes, finalLinks}
        }

        const exampleSources = exampleLinks.map(item => item.source);
        const exampleTargets = exampleLinks.map(item => item.target);

        const exampleNodes = nodes.filter(item => exampleSources.includes(item.id) || exampleTargets.includes(item.id));

        for (let n of exampleNodes) {
            let isIncluded = false;
            for (let fn of finalNodes) {
                if (fn.id === n.id){
                    isIncluded = true;
                }
            }
            if (!isIncluded) {
                finalNodes.push({...n, depth: node?.depth ? node.depth + 1 : 1});
            }
        }

        if (checkedNodes.length !== finalNodes.length) {
            for (let n of finalNodes) {
                if (checkedMap[n.id] !== 1) {
                    returnAllNodesAndLinksForSelectedNode(n, finalNodes, finalLinks, checkedNodes, checkedMap);
                }
            }
        }

        return {finalNodes, finalLinks};
    }
    //ts-ignore
    //console.log(returnAllNodesAndLinksForSelectedNode(selectedNode, finalNodes, finalLinks, checkedNodes, checkedMap));

    /*const finalLinksTarget = links.map(item => item.target);

    const uniqueFinalLinks = finalLinksTarget.filter((c, index) => {
        return finalLinksTarget.indexOf(c) !== index;
    });

    const resultNodes = finalNodes.filter(item => item.country === 'Marebak' || uniqueFinalLinks.includes(item.id));
    const resultNodesId = resultNodes.map(item => item.id);
    const resultLinks = finalLinks.filter(item => resultNodesId.includes(item.source) && resultNodesId.includes(item.target));

    const resultLinksTarget = resultLinks.map(item => item.target);
    const resultLinksSource = resultLinks.map(item => item.source);*/

    //const interestingNode = 'Tyler Vega';

    return (/*<div className="Container">
            <List nodes={nodes} links={links} onNodeClick={handleItemClick}/>
            {selectedNode &&
                <Graph
                    nodes={resultNodes.filter(item => resultLinksTarget.includes(item.id) || resultLinksSource.includes(item.id))}
                    links={resultLinks}
                />
            }

        </div>*/
        <div className="Container">
            <List nodes={nodes} links={links} onNodeClick={handleItemClick}/>
            {selectedNode &&
                <Graph
                    nodes={finalNodes}
                    links={finalLinks}
                />
            }

        </div>
        /*<div className="Container">
            <List nodes={nodes} links={links} onNodeClick={handleItemClick} />
            {selectedNode &&
                <Graph
                    nodes={nodesAndLinksForSelectedNode.exampleNodes}
                    links={nodesAndLinksForSelectedNode.exampleLinks}
                />
            }

        </div>*/
    );
};

const isDeepEqual = (a: Object, b: Object) => {
    let keys1 = Object.keys(a);
    let keys2 = Object.keys(b);

    if (keys1.length !== keys2.length) {
        return false;
    }

    for (let key of keys1) {
        if (!keys2.includes(key)) {
            return false;
        }
    }

    for (let key of keys1) {
        //@ts-ignore
        if (a[key] !== b[key]) {
            return false;
        }
    }

    return true;
}

export default Container;
