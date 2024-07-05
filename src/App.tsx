import React from 'react';
import Container from "./components/Container";
import data from "./data/dataUpdated.json";
import {GraphData} from "./types/types";


const App: React.FC = () => {
    const graphData = (data as GraphData);
    return (
        <div className="App">
            <Container data={graphData}/>
        </div>
    );
};

export default App;


