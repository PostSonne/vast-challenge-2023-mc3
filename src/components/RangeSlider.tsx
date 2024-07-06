import React, { useState, useEffect, useRef } from 'react';
// @ts-ignore
import RangeSlider from "data-driven-range-slider";

interface RangeSliderComponentProps {
    data: any[];
}

const RangeSliderComponent: React.FC<RangeSliderComponentProps> = ({ data }) => {
    const [selectedRange, setSelectedRange] = useState<Date[]>([]);
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
            .svgWidth(window.innerWidth - 50)
            .svgHeight(100)
            .data(data)
            .accessor((d: any) => new Date(d))
            .onBrush((d: { range: Date[]; data: any[] }) => {
                setSelectedRange(d.range);
                setSelectedData(d.data);
            })
            .render();
    };

    useEffect(() => {
        createDiagram();
    }, [data]);

    return (
        <div>
            <div>
                selected range: {selectedRange.length && selectedRange[0].toLocaleDateString("en")},
                {selectedRange.length && selectedRange[1].toLocaleDateString("en")}
            </div>
            <div>selected data length: {selectedData.length}</div>
            <div
                style={{
                    marginTop: "50px",
                    borderRadius: "5px",
                    paddingTop: "30px",
                    paddingLeft: "20px",
                    backgroundColor: "#30363E"
                }}
                ref={node}
            />
        </div>
    );
};

export default RangeSliderComponent;
