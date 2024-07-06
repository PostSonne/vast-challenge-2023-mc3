import React, {useMemo, useState} from 'react';
import {CountryProps, IContainerProps, Link, Node, NodesTableRow} from "../types/types";
import Graph from "./Graph";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

import RangeSliderComponent from "./BarRangeSlider";
import PieChart from "./PieChart";
import {
    Accordion, AccordionDetails,
    AccordionSummary,
    Box,
    Button, Card,
    List,
    ListItemButton,
    ListItemText,
    Typography
} from "@mui/material";
import TableComponent from "./TableComponent";
import HeatMap from "./HeatMap";
import {groupedWords} from "../utils/utils";

// @ts-ignore
const Container: React.FC<IContainerProps> = ({nodes, links, linkedNodes, linkMap, subGraphs}) => {

    const [selectedNode, setSelectedNode] = useState<Node | null>(null);
    const [countShowing, setCountShowing] = useState<number>(10);
    const [showHeatMapCountries, setShowHeatMapCountries] = useState<boolean>(false);
    const [showHeatMapServices, setShowHeatMapServices] = useState<boolean>(false);

    const [selectedIndex, setSelectedIndex] = React.useState(1);

    const handleItemClick = (item: Node, index?: number) => {
        setSelectedNode(item);
    };

    const countedProductServices: any = {};

    for (let n of nodes) {
        if (countedProductServices[n.product_services]) {
            countedProductServices[n.product_services] = countedProductServices[n.product_services] + 1;
        } else {
            countedProductServices[n.product_services] = 1;
        }
    }

    const heatMapData = [];

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
                filterData.push({r: Number(((revOmuRangeStepsSlider[revOmuRangesLabelsSlider.length - 2]) / 1000).toFixed(1)), node: n})
            } else if (n.revenue_omu >= revOmuRangeStepsSlider[index] && n.revenue_omu < revOmuRangeStepsSlider[index + 1]) {
                filterData.push({r: Number(((revOmuRangeStepsSlider[index + 1] + revOmuRangeStepsSlider[index]) / (2 * 1000)).toFixed(1)), node: n})
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
    let checkedMap: any = {};
    if (selectedNode) {
        checkedMap[selectedNode.id] = 1;
    }

    const getAverage = (array: any[]) =>
        array.reduce((sum: any, currentValue: any) => sum + currentValue, 0) / array.length;

    const rows = useMemo(() => {
        const tempRows: NodesTableRow[] = [];
        let idCount = 1;
        for (let subGraph of subGraphs) {
            tempRows.push({
                id: idCount,
                numberFishCompanies: subGraph.nodes.map(i => i.product_services).filter(i => i && i.length > 0).filter(i => containsProductName(i, groupedWords.seafoodAndFish)).length,
                averageRevenue: Number(getAverage(subGraph.nodes.map(i => i.revenue_omu).filter(i => i !== "Unknown" && i !== undefined && i !== "").filter(i => i > 0)).toFixed(1)),
                numberNodes: subGraph.nodes.length,
                numberLinks: subGraph.links.length,
                nodes: subGraph.nodes,
                links: subGraph.links
            });
            idCount++;
        }

        return [...tempRows.sort((a, b) => b.numberNodes - a.numberNodes)];
    }, [subGraphs]);

    return (
        <div className="Container" style={{ background: '#f2f6fc' }}>
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <div style={{width: '30%'}}>
                    <div style={{display: 'flex', flexDirection: 'column'}}>
                        <Accordion>
                            <AccordionSummary
                                expandIcon={<ArrowDropDownIcon />}
                                aria-controls="panel2-content"
                                id="panel2-header"
                            >
                                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%'}}>
                                    <Typography>Applied Filters</Typography>
                                    <Button style={{marginRight: '20px'}} variant="outlined" onClick={() => setCountShowing(countShowing + 10)}>Filter</Button>
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
                                        <div style={{marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                            <PieChart countedCountries={countedCountries.filter(i => i.value > 50)} width={300} height={300}/>
                                        </div>
                                    </div>
                                </div>
                            </AccordionDetails>
                        </Accordion>
                        <div>
                            <TableComponent rows={rows}/>
                        </div>
                    </div>
                </div>
                <div style={{width: '69%'}}>
                    <div style={{display: 'flex', flexDirection: 'column'}} >
                        <Box sx={{ minWidth: 275 }}>
                            <Card variant="outlined">
                                <div style={{margin: '12px 0', display: 'flex', alignItems: 'flex-start'}}>
                                    <Button style={{marginRight: '20px', marginLeft: '20px'}} variant="outlined" onClick={() => {
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
                                    {showHeatMapCountries ? <HeatMap nodes={nodes} heatMapData={heatMapData} width={500} height={300}/> : ''}
                                    {showHeatMapServices ? <HeatMap nodes={nodes} heatMapData={heatMapData2} width={500} height={300}/> : ''}
                                </div>
                            </Card> : ''}
                        </Box>
                    </div>
                </div>
            </div>
        </div>
    );
};

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
