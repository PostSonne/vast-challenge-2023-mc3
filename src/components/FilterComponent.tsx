import React, {useState} from "react";
import {Accordion, AccordionDetails, AccordionSummary, Button, Typography} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import RangeSliderComponent from "./BarRangeSlider";
import PieChart from "./PieChart";
import BarChart from "./BarChart";
import {CountryProps, Node} from "../types/types";

interface IFilterComponent {
    nodes: Node[];
    filterData: any[];
    countedCountries: CountryProps[];
    applyFilter: (nodes: Node[]) => void;
}

const FilterComponent: React.FC<IFilterComponent> = ({nodes, filterData, countedCountries, applyFilter}) => {
    const [selectedRange, setSelectedRange] = useState<number[]>([]);
    const [selectedCountries, setSelectedCountries] = useState<string[]>([]);

    return (<>
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
                            onClick={() => {
                                let lowerRevenue = selectedRange ? (selectedRange[0] * 1000) : 0;
                                let upperRevenue = selectedRange ? (selectedRange[1] * 1000) : Number.POSITIVE_INFINITY;
                                if (lowerRevenue === 4600) {
                                    lowerRevenue = 0;
                                }
                                if (upperRevenue === 182000) {
                                    upperRevenue = Number.POSITIVE_INFINITY;
                                }
                                applyFilter(nodes.filter(item =>
                                    (selectedCountries.length === 0 || selectedCountries.includes(item.country))
                                    && (selectedRange.length === 0 || (item.revenue_omu && item.revenue_omu >= lowerRevenue && item.revenue_omu <= upperRevenue))
                                ));
                            }}>Filter</Button>
                </div>
            </AccordionSummary>
            <AccordionDetails>
                <div style={{display: 'flex', flexDirection: 'column'}}>
                    <div style={{display: 'flex', flexDirection: 'column'}}>
                        <Typography>Num. Nodes/Revenue in Mil.</Typography>
                        <RangeSliderComponent
                            data={filterData} width={300} onSetRange={setSelectedRange}
                        />
                    </div>
                    <div style={{display: 'flex', flexDirection: 'column'}}>
                        <Typography>Countries</Typography>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <PieChart
                                countedCountries={countedCountries.filter(i => i.value > 50)}
                                width={300}
                                height={300}
                                onSetCountry={setSelectedCountries}
                                selectedCountries={selectedCountries}
                            />
                        </div>
                    </div>
                    <div style={{display: 'flex', flexDirection: 'column'}}>
                        <Typography>Countries</Typography>
                        <div style={{
                            marginTop: '10px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <BarChart
                                data = {countedCountries.filter(i => i.value > 50)}
                                width = {400}
                                height = {500}
                                barColor = '#6AA9C3'
                                onSetCountry={setSelectedCountries}
                                selectedCountries={selectedCountries}
                            />
                        </div>
                    </div>
                </div>
            </AccordionDetails>
        </Accordion>
    </>);
}

export default FilterComponent;
