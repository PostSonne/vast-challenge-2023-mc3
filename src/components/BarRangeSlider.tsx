import React, { useState, useEffect, useRef } from 'react';
// @ts-ignore
import RangeSlider from '../slider/Slider.js';
import {Node} from "../types/types";

interface RangeSliderComponentProps {
    data: any[];
    width: number;
    onSetRange: (range: number[]) => void;
}

const RangeSliderComponent: React.FC<RangeSliderComponentProps> = ({ data, width, onSetRange }) => {
    //const [selectedRange, setSelectedRange] = useState<number[]>([]);
    const [selectedData, setSelectedData] = useState<any[]>([]);
    const node = useRef<HTMLDivElement>(null);
    let chart: any;
    const createDiagram = () => {
        if (!data) return;

        if (!chart) {
            chart = new RangeSlider();
        }

        chart
            .container(node.current)
            .svgWidth(320)
            .svgHeight(125)
            .data(data)
            .accessor((d : any) => d.r)
                .aggregator((group : any) => group.values.length)
            .onBrush((d: { range: any[]; data: any[] }) => {
                onSetRange(d.range);
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
                    backgroundColor: "#fff",
                    width: `${width}px`
                }}
                ref={node}
            />
        </div>
    );
};

export default RangeSliderComponent;
