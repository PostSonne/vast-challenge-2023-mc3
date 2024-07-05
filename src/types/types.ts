
export interface Node {
    country: string;
    id: string;
    product_services: string;
    revenue_omu: number | string;
    type: string;
    x?: number;
    y?: number;
    fx?: number | null;
    fy?: number | null;
    depth?: number;
}

export interface NodeGraph {
    country: string[];
    id: string[];
    product_services: string[];
    revenue_omu: number[] | string[];
    type: string[];
    x?: number;
    y?: number;
    fx?: number | null;
    fy?: number | null;
}

export interface Link {
    source: string;
    target: string;
    type: string;
}

export interface LinkGraph {
    source: string[];
    target: string[];
    type: string[];
    key: number;
}

export interface GraphData {
    directed: boolean;
    graph: object;
    multigraph: boolean;
    links: LinkGraph[];
    nodes: NodeGraph[];
}

export interface CountryProps {
    name: string;
    value: number
}

export interface IContainerProps {
    data: GraphData;
}

