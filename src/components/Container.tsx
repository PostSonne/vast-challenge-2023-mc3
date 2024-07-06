import React, {useState} from 'react';
import {CountryProps, IContainerProps, Link, Node} from "../types/types";
import Graph from "./Graph";
import HeatMap from "./HeatMap";
import PieChart from "./PieChart";
import MatrixDiagramComponent from "./MatrixDiagramComponent";

const Container: React.FC<IContainerProps> = ({data}) => {
    const links: Link[] = [];
    const classifiedCompanyNodes: any = {};
    for (let l of data.links) {
        if (l.source && l.source.length > 1) {
            for (let s of l.source) {
                links.push({
                    source: s,
                    target: l.target[0],
                    type: l.type[0]
                });

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

            if (l.type[0] === 'Beneficial Owner' || l.type[0] === 'Company Contacts') {
                classifiedCompanyNodes[l.source[0]] = 1;
            }
        }
    }

    //console.log(Object.keys(classifiedCompanyNodes));

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

    const [selectedNode, setSelectedNode] = useState<Node | null>(null);
    const [countShowing, setCountShowing] = useState<number>(10);

    const handleItemClick = (item: Node) => {
        setSelectedNode(item);
    };

    const groupedWords: any = {
        foodAndBeverages: [
            "beef",
            "beverages",
            "canned",
            "dairy",
            "dried",
            "dry",
            "food",
            "foods",
            "fresh",
            "frozen",
            "fruits",
            "gelatin",
            "gelatine",
            "meat",
            "meats",
            "oil",
            "oils",
            "pork",
            "poultry",
            "sauce",
            "vegetable",
            "vegetables"
        ],
        manufacturingAndIndustrial: [
            "adhesives",
            "aluminum",
            "automotive",
            "building",
            "casting",
            "chemical",
            "chemicals",
            "components",
            "construction",
            "consumer",
            "control",
            "development",
            "die",
            "distribution",
            "electric",
            "electrical",
            "electronic",
            "engineering",
            "equipment",
            "fabric",
            "fabrics",
            "film",
            "freight",
            "high",
            "industrial",
            "industries",
            "industry",
            "iron",
            "machine",
            "machinery",
            "machines",
            "manufacturing",
            "marine",
            "materials",
            "metal",
            "natural",
            "non",
            "paper",
            "parts",
            "plastic",
            "plastics",
            "power",
            "processing",
            "production",
            "products",
            "raw",
            "rubber",
            "steel",
            "supplies",
            "system",
            "systems",
            "textile",
            "tools",
            "transport",
            "transportation",
            "warehousing"
        ],
        apparelAndAccessories: [
            "accessories",
            "apparel",
            "bags",
            "clothing",
            "footwear",
            "leather",
            "men",
            "shoes"
        ],
        homeAndHousehold: [
            "appliances",
            "care",
            "furniture",
            "home",
            "household",
            "items",
            "office",
            "personal",
            "stationery"
        ],
        logisticsAndShipping: [
            "cargo",
            "customs",
            "freight",
            "forwarding",
            "international",
            "logistics",
            "shipping",
            "storage",
            "transport",
            "transportation",
            "warehousing"
        ],
        medicalAndPharmaceutical: [
            "medical",
            "pharmaceutical",
            "research"
        ],
        businessAndServices: [
            "business",
            "commercial",
            "consumer",
            "development",
            "freelance",
            "general",
            "management",
            "offers",
            "provides",
            "quality",
            "related",
            "services",
            "solutions",
            "special",
            "specialises",
            "specialty",
            "well"
        ],
        technologyAndElectronics: [
            "computer",
            "devices",
            "electronic",
            "technology"
        ],
        miscellaneous: [
            "air",
            "based",
            "by",
            "cooked",
            "custom",
            "customs",
            "design",
            "dried",
            "dry",
            "film",
            "fresh",
            "from",
            "hot",
            "in",
            "including",
            "its",
            "line",
            "natural",
            "of",
            "or",
            "on",
            "other",
            "personal",
            "prepared",
            "processed",
            "products",
            "quality",
            "raw",
            "related",
            "series",
            "service",
            "special",
            "supplies",
            "system",
            "systems",
            "that",
            "the",
            "to",
            "type",
            "used",
            "various",
            "wide"
        ],
        seafood: [
            "cod",
            "crab",
            "crabs",
            "fillet",
            "fillets",
            "fish",
            "lobster",
            "octopus",
            "pollock",
            "salmon",
            "seafood",
            "seafoods",
            "shellfish",
            "shrimp",
            "shrimps",
            "smoked",
            "sole",
            "squid",
            "tuna",
            "aquatic",
            "fishing",
            "marine",
            "ocean",
            "sea",
            "water"
        ]
    };

    const countedProductServices: any = {};

    for (let n of nodes) {
        if (countedProductServices[n.product_services]) {
            countedProductServices[n.product_services] = countedProductServices[n.product_services] + 1;
        } else {
            countedProductServices[n.product_services] = 1;
        }
    }
    //отсортированные продукт сервисы по частоте того как встречаются
    const productServicesKeysSorted = Object.keys(countedProductServices).sort(function (a, b) {
        return countedProductServices[b] - countedProductServices[a]
    });


    const productServices = nodes.map(item => item.product_services);
    const productServicesFiltered = productServices.filter((c, index, arr) => {
        return arr.indexOf(c) === index;
    });

    const nodesWithEmptyProductServices = nodes.filter(item => item.product_services !== "" && item.product_services !== "Unknown" && item.product_services !== undefined).map(i => i.product_services);

    //const nodesWithProductServices = nodes.length - nodesWithEmptyProductServices;
    const nodesWithUnknownProductServices = nodes.filter(item => item.product_services === "Unknown").length;

    const heatMapData = [];

    function findMostCommonProductService(strings: string[]): { [key: string]: number } {
        const wordCounts: { [key: string]: number } = {};
        for (const str of strings) {
            const words = str.split(/[\W_]+/);  // \W matches any non-word character, _ is added to handle underscores
            for (const word of words) {
                if (word) {  // Check to avoid counting empty strings
                    if (wordCounts[word.toLowerCase()]) {
                        wordCounts[word.toLowerCase()]++;
                    } else {
                        wordCounts[word.toLowerCase()] = 1;
                    }
                }
            }
        }
        const frequentWords: { [key: string]: number } = {};
        for (const word in wordCounts) {
            if (wordCounts[word] > 30) {
                frequentWords[word] = wordCounts[word];
            }
        }
        return frequentWords;
    }

    const productServicesWithName = productServicesFiltered.filter(item => item !== "Unknown" && item !== "" && item !== undefined);

    const mostCommonProductService = findMostCommonProductService(productServicesWithName);
    const mostCommonProductServiceSorted = Object.keys(mostCommonProductService).sort(function (a, b) { // @ts-ignore
        return mostCommonProductService[b] - mostCommonProductService[a]
    });


    const productServicesKeysFilter = (obj: any): { [key: string]: number } => {
        const result = {};
        for (const key in obj) {
            if (obj[key] > 1 && obj[key] < 1000) {
                // @ts-ignore
                result[key] = obj[key];
            }
        }
        return result;
    }
    const productServicesKeysFiltered = productServicesKeysFilter(countedProductServices);

    const nodesTypeCompany = nodes.filter(item => item.type === "Company").length;
    const nodesTypePerson = nodes.filter(item => item.type === "Person").length;
    const nodesTypeBeneficialOwner = nodes.filter(item => item.type === "Beneficial Owner").length;
    const nodesTypeCompanyContacts = nodes.filter(item => item.type === "Company Contacts").length;

    const linksTypePerson = links.filter(item => item.type === "Person").length;
    const linksTypeBeneficialOwner = links.filter(item => item.type === "Beneficial Owner").length;
    const linksTypeCompanyContacts = links.filter(item => item.type === "Company Contacts").length;

    const revOmu = nodes.filter(item => item.revenue_omu !== "Unknown" && item.revenue_omu !== "" && item.revenue_omu !== undefined).map(item => item.revenue_omu);

    const revOmuMax = Math.max(...filterOutliers(revOmu) as number[]);
    const revOmuMin = Math.min(...revOmu as number[]);
    const revOmuSteps = Math.ceil((revOmuMax - revOmuMin) / 10);
    const revOmuRangeSteps = [];

    let current = Math.floor(revOmuMin);
    while (current < revOmuMax) {
        revOmuRangeSteps.push(current);
        current = current + revOmuSteps
    }
    revOmuRangeSteps.push(Math.ceil(Math.max(...revOmu as number[])));

    const productServicesGroupsLabels = Object.keys(groupedWords);
    const revOmuRangesLabels = revOmuRangeSteps.reduce((acc: string[], curr, index, array) => {
        if (index < array.length - 1) {
            acc.push(`${(curr / 10000).toFixed(1)} - ${(array[index + 1] / 10000).toFixed(1)}`);
        }
        return acc;
    }, []);

    const containsProductName = (str: string, substrings: string[]): boolean => {
        for (let i = 0; i !== substrings.length; i++) {
            let substring = substrings[i];
            if (str.indexOf(substring) !== -1) {
                return true;
            }
        }
        return false;
    }

    for (let p of productServicesGroupsLabels) {
        for (let r of revOmuRangesLabels) {
            let count = 0;
            const index = revOmuRangesLabels.indexOf(r);
            for (let n of nodes) {
                if (n.product_services && containsProductName(n.product_services, groupedWords[p]) &&
                    (n.revenue_omu >= revOmuRangeSteps[index] && n.revenue_omu < revOmuRangeSteps[index + 1])) {
                    count++;
                }
            }
            heatMapData.push([r, p, count])
        }
    }

    const heatMapData2: any = [];


    //console.log(heatMapData);

    //анализировать на первоначальном датасете?
    /*console.log(
        `Nodes with type 'Company': ${nodesTypeCompany}\n` +
        `Nodes with type 'Person': ${nodesTypePerson}\n` +
        `Nodes with type 'Beneficial Owner': ${nodesTypeBeneficialOwner}\n` +
        `Nodes with type 'Company Contacts': ${nodesTypeCompanyContacts}\n` +
        `Nodes without 'Product_services': ${nodesWithEmptyProductServices}\n` +
        `Nodes with 'Product_services': ${nodesWithProductServices}\n` +
        //`Nodes with "Unknown" 'Product_services': ${nodesWithUnknownProductServices}\n` +
        //`Product_services: ${productServicesFiltered}\n` +
        `Product_services counter: ${productServicesFiltered.length}\n` +
        `Links with type 'Beneficial Owner': ${linksTypeBeneficialOwner}\n` +
        `Links with type 'Company Contacts': ${linksTypeCompanyContacts}\n` +
        `Links with type 'Person': ${linksTypePerson}\n` +

        `Nodes with empty 'revenue_omu': ${nodesWithEmptyRevOmu}\n` +
        `Nodes with non-empty 'revenue_omu': ${nodesWithRevOmu}\n` +
        //`Duplicated 'revenue_omu': ${withoutNullFiltered}\n` +
        `Duplicated 'revenue_omu' counter: ${withoutNullFiltered.length}\n` +
        `Nodes with duplicated 'revenue_omu': ${nodesWIthDuplicatedRevOmu}\n`
    );*/


    //какая нода чаще всего является таргетом?
    const countedTargets: any = {};
    for (let l of links) {
        if (countedTargets[l.target]) {
            countedTargets[l.target] = countedTargets[l.target] + 1;
        } else {
            countedTargets[l.target] = 1;
        }
    }

    //отсортированные айдишники нод по частоте того как они являются таргетом
    const targetKeysSorted = Object.keys(countedTargets).sort(function (a, b) {
        return countedTargets[b] - countedTargets[a]
    });

    const countryNames = nodes.map(item => item.country);
    const countryNamesUnique = countryNames.filter((c, index, arr) => {
        return arr.indexOf(c) === index;
    });

    const countryFrequency: any = {};
    for (let n of nodes.filter(item => item.type === 'Company')) {
        if (n.country) {
            if (countryFrequency[n.country]) {
                countryFrequency[n.country] = countryFrequency[n.country] + 1;
            } else {
                countryFrequency[n.country] = 1;
            }
        }
    }

    const countedCountries: CountryProps[] = Object.keys(countryFrequency).map(i => ({
        name: i,
        value: countryFrequency[i]
    }))

    const countryNamesSorted = Object.keys(countryFrequency).sort(function (a, b) {
        return countryFrequency[b] - countryFrequency[a]
    });

    for (let c of countryNamesSorted) {
        for (let r of revOmuRangesLabels) {
            let count = 0;
            const index = revOmuRangesLabels.indexOf(r);
            for (let n of nodes) {
                if (n.country && n.country === c &&
                    (n.revenue_omu >= revOmuRangeSteps[index] && n.revenue_omu < revOmuRangeSteps[index + 1])) {
                    count++;
                }
            }
            heatMapData2.push([r, c, count])
        }
    }

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

        if (node?.depth && node?.depth > 2) {
            return;
        }


        const exampleLinks = links.filter((i) => i.source === node?.id || i.target === node?.id);

        let isAllFinal = true;
        for (let l of exampleLinks) {
            let isIncluded = false;
            for (let fl of finalLinks) {
                if (fl.target === l.target && fl.source === l.source) {
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
                if (fn.id === n.id) {
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
    returnAllNodesAndLinksForSelectedNode(selectedNode, finalNodes, finalLinks, checkedNodes, checkedMap);

    const matrixNodes = finalNodes.slice();
    const matrixLinks = finalLinks.slice();

    const liList = nodes.filter(item => item.id === 'Christopher Anthony').slice(0, countShowing).map(item => <li
        onClick={() => handleItemClick(item)}>{item.id}</li>)

    return (
        <div className="Container">
            <div style={{display: 'flex', flexDirection: 'column'}}>
                <button onClick={() => setCountShowing(countShowing + 10)}>ADD MORE</button>
                <ul>
                    {liList}
                </ul>
            </div>
            {/*{selectedNode &&
                <>
                    {<Graph
                        nodes={finalNodes}
                        links={finalLinks}
                    />}
                    <MatrixDiagramComponent nodes={matrixNodes} links={matrixLinks}/>
                </>

            }*/}
            <PieChart countedCountries={countedCountries.filter(i => i.value > 50)} width={1200} height={600}/>
            {/*<HeatMap nodes={nodes} heatMapData={heatMapData2} width={500} height={300}/>*/}
        </div>
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

function filterOutliers(someArray: any) {

    // Copy the values, rather than operating on references to existing values
    const values = someArray.concat();

    // Then sort
    values.sort(function (a: any, b: any) {
        return a - b;
    });

    /* Then find a generous IQR. This is generous because if (values.length / 4)
     * is not an int, then really you should average the two elements on either
     * side to find q1.
     */
    const q1 = values[Math.floor((values.length / 4))];
    // Likewise for q3.
    const q3 = values[Math.ceil((values.length * (3 / 4)))];
    const iqr = q3 - q1;

    // Then find min and max values
    const maxValue = q3 + iqr * 3.5;
    const minValue = q1 - iqr * 3.5;

    // Then filter anything beyond or beneath these values.
    const filteredValues = values.filter(function (x: any) {
        return (x <= maxValue) && (x >= minValue);
    });

    // Then return
    return filteredValues;
}

export default Container;
