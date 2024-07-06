import React, {useMemo, useState} from 'react';
import {CountryProps, IContainerProps, Link, Node, NodesTableRow} from "../types/types";
import Graph from "./Graph";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

import RangeSliderComponent from "./BarRangeSlider";
import PieChart from "./PieChart";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Button,
    Card,
    List,
    ListItemButton,
    ListItemText, MenuItem, TextField,
    Typography
} from "@mui/material";
import TableComponent from "./TableComponent";
import HeatMap from "./HeatMap";
import MatrixDiagramComponent from "./MatrixDiagramComponent";

const depthList = [
    {
        value: 1,
        label: 1,
    },
    {
        value: 2,
        label: 2,
    },
    {
        value: 3,
        label: 3,
    },
    {
        value: 4,
        label: 4,
    },
];

// @ts-ignore
const Container: React.FC<IContainerProps> = ({nodes, links, linkedNodes, linkMap, subGraphs}) => {

    const [selectedNode, setSelectedNode] = useState<Node | null>(null);
    const [selectedRow, setSelectedRow] = useState<number | null>(null);
    const [countShowing, setCountShowing] = useState<number>(10);
    const [showHeatMapCountries, setShowHeatMapCountries] = useState<boolean>(false);
    const [showHeatMapServices, setShowHeatMapServices] = useState<boolean>(false);
    const [showGraph, setShowGraph] = useState<boolean>(false);
    const [showMatrix, setShowMatrix] = useState<boolean>(false);

    const [selectedIndex, setSelectedIndex] = React.useState(1);

    const handleItemClick = (item: Node, index?: number) => {
        setSelectedNode(item);
        //setSelectedIndex(index);
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
    const productServicesKeysSorted = Object.keys(countedProductServices).sort(function (a, b) {
        return countedProductServices[b] - countedProductServices[a]
    });


    const productServices = nodes.map(item => item.product_services);
    const productServicesFiltered = productServices.filter((c, index, arr) => {
        return arr.indexOf(c) === index;
    });

    const nodesWithEmptyProductServices = nodes.filter(item => item.product_services !== "" && item.product_services !== "Unknown" && item.product_services !== undefined).map(i => i.product_services);

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
    const revOmuStepsSlider = Math.ceil((revOmuMax - revOmuMin) / 100);
    const revOmuRangeSteps = [];
    const revOmuRangeStepsSlider = [];

    let current = Math.floor(revOmuMin);
    while (current < revOmuMax) {
        revOmuRangeSteps.push(current);
        current = current + revOmuSteps
    }
    revOmuRangeSteps.push(Math.ceil(Math.max(...revOmu as number[])));

    current = Math.floor(revOmuMin);
    while (current < revOmuMax) {
        revOmuRangeStepsSlider.push(current);
        current = current + revOmuStepsSlider
    }
    revOmuRangeStepsSlider.push(Math.ceil(Math.max(...revOmu as number[])));

    const productServicesGroupsLabels = Object.keys(groupedWords);
    const revOmuRangesLabels = revOmuRangeSteps.reduce((acc: string[], curr, index, array) => {
        if (index < array.length - 1) {
            acc.push(`${(curr / 10000).toFixed(1)} - ${(array[index + 1] / 10000).toFixed(1)}`);
        }
        return acc;
    }, []);

    const revOmuRangesLabelsSlider = revOmuRangeStepsSlider.reduce((acc: string[], curr, index, array) => {
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

    const filterData: any = [];

    for (let r of revOmuRangesLabelsSlider) {
        const index = revOmuRangesLabelsSlider.indexOf(r);
        for (let n of nodes) {
            if ((index === revOmuRangesLabelsSlider.length - 1) && n.revenue_omu >= revOmuRangeStepsSlider[revOmuRangesLabelsSlider.length - 2]) {
                filterData.push({
                    r: Number(((revOmuRangeStepsSlider[revOmuRangesLabelsSlider.length - 2]) / 1000).toFixed(1)),
                    node: n
                })
            } else if (n.revenue_omu >= revOmuRangeStepsSlider[index] && n.revenue_omu < revOmuRangeStepsSlider[index + 1]) {
                filterData.push({
                    r: Number(((revOmuRangeStepsSlider[index + 1] + revOmuRangeStepsSlider[index]) / (2 * 1000)).toFixed(1)),
                    node: n
                })
            }
        }
    }

    const heatMapData2: any = [];

    const countedTargets: any = {};
    for (let l of links) {
        if (countedTargets[l.target]) {
            countedTargets[l.target] = countedTargets[l.target] + 1;
        } else {
            countedTargets[l.target] = 1;
        }
    }

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

    for (let c of countryNamesSorted.splice(0, 10)) {
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
    let finalLinksMap: any = {};
    let checkedNodes: Node[] = [];
    let checkedMap: any = {};
    if (selectedNode) {
        checkedMap[selectedNode.id] = 1;
    }

    /*const returnAllNodesAndLinksForSelectedNode = (
        node: Node | null,
        finalNodes: Node[],
        finalLinks: Link[],
        checkedMap: Record<string, boolean>,
        isFull: boolean,
        finalLinksMap: Record<string, boolean>
    ): { finalNodes: Node[]; finalLinks: Link[] } => {
        if (node) {
            checkedMap[node.id] = true;
        }

        if (!isFull && node?.depth && node.depth > 1) {
            return { finalNodes, finalLinks };
        }

        const exampleLinks = links.filter((i) => i.source === node?.id || i.target === node?.id);
        let isAllFinal = true;

        for (const l of exampleLinks) {
            const linkKey = `${l.source}-${l.target}`;
            if (!finalLinksMap[linkKey]) {
                isAllFinal = false;
                finalLinks.push(l);
                finalLinksMap[linkKey] = true;
            }
        }

        if (isAllFinal) {
            return { finalNodes, finalLinks };
        }

        const linkMap: Record<string, boolean> = {};
        for (const l of exampleLinks) {
            linkMap[l.source] = true;
            linkMap[l.target] = true;
        }

        const exampleNodes = nodes.filter((item) => linkMap[item.id]);

        for (const n of exampleNodes) {
            if (!finalNodes.some((fn) => fn.id === n.id)) {
                finalNodes.push({ ...n, depth: (node?.depth ?? 0) + 1 });
            }
        }

        for (const n of finalNodes) {
            if (!checkedMap[n.id]) {
                returnAllNodesAndLinksForSelectedNode(n, finalNodes, finalLinks, checkedMap, isFull, finalLinksMap);
            }
        }

        return { finalNodes, finalLinks };
    };*/

    const rows = useMemo(() => {
        const tempRows: NodesTableRow[] = [];
        let idCount = 1;
        for (let subGraph of subGraphs) {
            tempRows.push({
                id: idCount,
                numberFishCompanies: 10,
                averageRevenue: 47,
                numberNodes: subGraph.nodes.length,
                numberLinks: subGraph.links.length,
                nodes: subGraph.nodes,
                links: subGraph.links
            });
            idCount++;
        }

        return [...tempRows.sort((a, b) => b.numberNodes - a.numberNodes)];
    }, [subGraphs]);
    /*const rows = useMemo(() => {
        const completedNodeIds: any = {};
        let completedNodes: Node[] = [];
        const rows: NodesTableRow[] = [];
        let idCount = 1;
        const time = new Date();
        for (let n of linkedNodes) {
            const clusterNodes: any = [];
            const clusterLinks: any = [];
            const completedLinksMap: any = {};
            if (!completedNodeIds[n.id]) {
                returnAllNodesAndLinksForSelectedNode(n, clusterNodes, clusterLinks, completedNodeIds, true, completedLinksMap);
                rows.push({
                    id: idCount,
                    numberFishCompanies: 10,
                    averageRevenue: 47,
                    numberNodes: clusterNodes.length,
                    numberLinks: clusterLinks.length,
                    nodes: clusterNodes,
                    links: clusterLinks
                });
                idCount++;
                console.log(rows);
            }
        }
        console.log(new Date().getTime() - time.getTime());

        return rows;
    }, [linkedNodes, returnAllNodesAndLinksForSelectedNode]);*/

    //returnAllNodesAndLinksForSelectedNode(selectedNode, finalNodes, finalLinks, checkedNodes, checkedMap, false);

    /*const rows: NodesTableRow[] = [{
        id: 1,
        numberFishCompanies: 10,
        averageRevenue: 47,
        numberNodes: 100,
        numberLinks: 200
    }];*/

    return (
        <div className="Container" style={{background: '#f2f6fc'}}>
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <div style={{width: '30%'}}>
                    <div style={{display: 'flex', flexDirection: 'column'}}>
                        <Accordion>
                            <AccordionSummary
                                expandIcon={<ArrowDropDownIcon/>}
                                aria-controls="panel2-content"
                                id="panel2-header"
                            >
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    width: '100%'
                                }}>
                                    <Typography>Applied Filters</Typography>
                                    <Button style={{marginRight: '20px'}} variant="outlined"
                                            onClick={() => setCountShowing(countShowing + 10)}>Filter</Button>
                                </div>
                            </AccordionSummary>
                            <AccordionDetails>
                                <div style={{display: 'flex', flexDirection: 'column'}}>
                                    <div style={{display: 'flex', flexDirection: 'column'}}>
                                        <Typography>Num. Nodes/Revenue in Mil.</Typography>
                                        <RangeSliderComponent
                                            data={filterData} width={300}
                                        />
                                    </div>
                                    <div style={{display: 'flex', flexDirection: 'column'}}>
                                        <Typography>Countries</Typography>
                                        <div style={{
                                            marginTop: '10px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            <PieChart countedCountries={countedCountries.filter(i => i.value > 50)}
                                                      width={300} height={300}/>
                                        </div>
                                    </div>
                                </div>
                            </AccordionDetails>
                        </Accordion>
                        <div>
                            {/*<TableContainer component={Paper}>
                                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Id</TableCell>
                                            <TableCell align="right"># fish Companies</TableCell>
                                            <TableCell align="right">Avg. Revenue</TableCell>
                                            <TableCell align="right"># Nodes</TableCell>
                                            <TableCell align="right"># Links</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {rows.map((row) => (
                                            <TableRow
                                                key={row.id}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell component="th" scope="row">
                                                    {row.id}
                                                </TableCell>
                                                <TableCell align="right">{row.numberFishCompanies}</TableCell>
                                                <TableCell align="right">{row.averageRevenue}</TableCell>
                                                <TableCell align="right">{row.numberNodes}</TableCell>
                                                <TableCell align="right">{row.numberLinks}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>*/}
                            <TableComponent rows={rows} handleClick={(id) => {
                                setSelectedRow(id);
                                setShowHeatMapServices(false);
                                setShowHeatMapCountries(false);
                            }} selectedRow={selectedRow}/>
                        </div>
                    </div>
                </div>
                <div style={{width: '69%'}}>
                    <div style={{display: 'flex', flexDirection: 'column'}}>
                        {selectedRow ?
                            <Box sx={{minWidth: 275}}>
                                <Card variant="outlined">
                                    <div style={{margin: '12px 0', display: 'flex', alignItems: 'flex-start'}}>
                                        <Button style={{marginRight: '20px', marginLeft: '20px'}} variant="outlined"
                                                onClick={() => {
                                                    setShowMatrix(!showMatrix);
                                                    setShowGraph(false);
                                                }}>SHOW MATRIX</Button>
                                        <Button variant="outlined" onClick={() => {
                                            setShowGraph(!showGraph);
                                            setShowMatrix(false);
                                        }}>SHOW GRAPH</Button>
                                        <div style={{marginLeft: '20px', display: 'flex'}}>
                                            <Typography style={{display: 'flex', alignItems: 'center', paddingRight: '12px'}}>Select depth:</Typography>
                                            <TextField
                                                id="outlined-select-currency"
                                                select
                                                defaultValue="1"
                                                variant="standard"
                                            >
                                                {depthList.map((option) => (
                                                    <MenuItem key={option.value} value={option.value}>
                                                        {option.label}
                                                    </MenuItem>
                                                ))}
                                            </TextField>
                                        </div>
                                    </div>
                                </Card>
                                <div style={{display: 'flex'}}>
                                    <div style={{width: '20%'}}>
                                        <Card>
                                            <div style={{margin: '12px 0', display: 'flex', flexDirection: 'column'}}>
                                                <List component="nav" aria-label="main mailbox folders">
                                                    {subGraphs[selectedRow - 1].nodes.map(item =>
                                                        <ListItemButton style={{textAlign: 'center'}} selected={item.id === selectedNode?.id}
                                                                        onClick={() => handleItemClick(item)}>
                                                            <ListItemText>{item.id}</ListItemText>
                                                        </ListItemButton>
                                                    )}
                                                </List>
                                            </div>
                                        </Card>
                                    </div>
                                    {(showMatrix || showGraph) ? <Card>
                                        <div style={{margin: '12px 0', display: 'flex', flexDirection: 'column'}}>
                                            {showMatrix ?
                                                <MatrixDiagramComponent nodes={subGraphs[selectedRow - 1].nodes} links={subGraphs[selectedRow - 1].links} /> : ''}
                                            {showGraph ?
                                                <Graph nodes={subGraphs[selectedRow - 1].nodes} links={subGraphs[selectedRow - 1].links} /> : ''}
                                        </div>
                                    </Card> : ''}
                                </div>
                            </Box> :
                            <Box sx={{minWidth: 275}}>
                                <Card variant="outlined">
                                    <div style={{margin: '12px 0', display: 'flex', alignItems: 'flex-start'}}>
                                        <Button style={{marginRight: '20px', marginLeft: '20px'}} variant="outlined"
                                                onClick={() => {
                                                    setShowHeatMapCountries(!showHeatMapCountries);
                                                    setShowHeatMapServices(false);
                                                }}>SHOW HEATMAP REVENUE/SERVICES</Button>
                                        <Button variant="outlined" onClick={() => {
                                            setShowHeatMapServices(!showHeatMapServices);
                                            setShowHeatMapCountries(false);
                                        }}>SHOW HEATMAP REVENUE/COUNTRIES</Button>
                                    </div>
                                </Card>
                                {(showHeatMapCountries || showHeatMapServices) ? <Card>
                                    <div style={{margin: '12px 0', display: 'flex', flexDirection: 'column'}}>
                                        {showHeatMapCountries ?
                                            <HeatMap nodes={nodes} heatMapData={heatMapData} width={500}
                                                     height={300}/> : ''}
                                        {showHeatMapServices ?
                                            <HeatMap nodes={nodes} heatMapData={heatMapData2} width={500}
                                                     height={300}/> : ''}
                                    </div>
                                </Card> : ''}
                            </Box>}
                    </div>
                </div>
            </div>
            <div className="table-graph-container">
                <div style={{display: 'flex', flexDirection: 'column', width: '30%'}}>
                    <Box sx={{width: '100%', maxWidth: "100%", bgcolor: 'background.paper'}}>
                        <List component="nav" aria-label="main mailbox folders">
                            {nodes.slice(0, countShowing).map(item =>
                                <ListItemButton style={{textAlign: 'center'}} selected={item.id === selectedNode?.id}
                                                onClick={() => handleItemClick(item)}>
                                    <ListItemText>{item.id}</ListItemText>
                                </ListItemButton>
                            )}
                        </List>
                        <Button variant="outlined" onClick={() => setCountShowing(countShowing + 10)}>ADD MORE</Button>

                    </Box>
                </div>
                {selectedNode &&
                    <Graph
                        nodes={finalNodes}
                        links={finalLinks}
                    />
                }
            </div>

            {/*<PieChart countedCountries={countedCountries.filter(i => i.value > 50)} width={1200} height={600}/>
            <HeatMap nodes={nodes} heatMapData={heatMapData2} width={500} height={300}/>
            <RangeSliderComponent
                data={cars}
                width={250}
            />*/}
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
