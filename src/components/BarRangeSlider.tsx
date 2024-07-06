import * as d3 from 'd3';
import React, { useState, useEffect, useRef } from 'react';
// @ts-ignore
import RangeSlider from '../slider/Slider.js';

interface RangeSliderComponentProps {
    data: any[];
    width: number;
}

const RangeSliderComponent: React.FC<RangeSliderComponentProps> = ({ data, width }) => {
    const [selectedRange, setSelectedRange] = useState<Date[]>([]);
    const [selectedData, setSelectedData] = useState<any[]>([]);
    const node = useRef<HTMLDivElement>(null);
    let chart: any;
    console.log(selectedRange);

    const createDiagram = () => {
        if (!data) return;

        if (!chart) {
            chart = new RangeSlider();
        }

        chart
            .container(node.current)
            .svgWidth(220)
            .svgHeight(125)
            .data(data)
            .accessor((d : any) => d.r)
                .aggregator((group : any) => group.values.length)
            .onBrush((d: { range: any[]; data: any[] }) => {
                setSelectedRange(d.range);
                setSelectedData(d.data);
            })
            .render();
    };

    useEffect(() => {
        createDiagram();
    }, [data]);

    return (
        <div style={{display: 'flex', justifyContent: 'center'}}>
            <div
                style={{
                    marginTop: "10px",
                    borderRadius: "2px",
                    paddingTop: "20px",
                    paddingLeft: "10px",
                    backgroundColor: "#30363E",
                    width: `${width}px`
                }}
                ref={node}
            />
        </div>
    );
};

export default RangeSliderComponent;
