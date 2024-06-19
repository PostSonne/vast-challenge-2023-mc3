import React, { useEffect } from 'react';
import * as d3 from 'd3';

const App: React.FC = () => {
  useEffect(() => {
    const svg = d3.select('#d3-container')
        .append('svg')
        .attr('width', 600)
        .attr('height', 400);

    svg.append('circle')
        .attr('cx', 300)
        .attr('cy', 200)
        .attr('r', 100)
        .attr('fill', 'blue');
  }, []);

  const chart = ForceGraph(miserables, {
      nodeId: d => d.id,
      nodeGroup: d => d.group,
      nodeTitle: d => `${d.id}\n${d.group}`,
      linkStrokeWidth: l => Math.sqrt(l.value),
      width,
      height: 600,
      invalidation // a promise to stop the simulation when the cell is re-run
  })

  return (
      <div>
        <div id="d3-container"></div>
      </div>
  );
};

export default App;
