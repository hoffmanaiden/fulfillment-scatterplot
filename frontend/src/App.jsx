import React, { useEffect, useState, useRef } from 'react';
import * as d3 from 'd3';
import testData from './TestData.json'

function App() {
  return (
    <div>
      <XYAxisGrid />
    </div>
  )
}

function XYAxisGrid() {
  const d3Container = useRef(null);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const updateSize = () => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight })
  }

  useEffect(() => {
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  useEffect(() => {
    if (d3Container.current) {
      // Set the dimensions and margins of the graph
      const width = windowSize.width - 6;
      const height = windowSize.height - 6;
      const margin = { top: 20, right: 30, bottom: 40, left: 50 };

      // Remove any existing SVG to prevent duplicates
      d3.select(d3Container.current).select("svg").remove();

      // Append the SVG object to the body of the page
      const svg = d3.select(d3Container.current)
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      // X scale and Axis
      const x = d3.scaleLinear()
        .domain([0, 6])
        .range([0, width - margin.left - margin.right]);

      // Y scale and Axis
      const y = d3.scaleLinear()
        .domain([-5, 5])
        .range([height - margin.top - margin.bottom, 0]);
      svg.append("g")
        .call(d3.axisLeft(y));
      // Move the X axis to align with the -5 Y marker
      svg.append("g")
        .attr("transform", `translate(0,${y(-5)})`)
        .call(d3.axisBottom(x)
          .ticks(6)
        );


      // Add a grey dotted line at Y=0
      svg.append("line")
        .style("stroke", "grey")
        .style("stroke-width", 2)
        .style("stroke-dasharray", "4")
        .attr("x1", 0)
        .attr("y1", y(0))
        .attr("x2", width - margin.left - margin.right)
        .attr("y2", y(0));

      // Create a simulation for the data points
      const simulation = d3.forceSimulation(testData)
        .force("x", d3.forceX(d => x(d.stage)).strength(0.5))
        .force("y", d3.forceY(d => y(d.status)).strength(0.5))
        .force("collide", d3.forceCollide(5)) // Use a collision force with a radius to prevent overlap
        .stop();

      // Run the simulation a fixed number of times
      for (let i = 0; i < 120; ++i) simulation.tick();

      // Group data points by clusterId
      const clusters = d3.group(testData, d => d.clusterId);

      clusters.forEach((points, clusterId) => {
        let sumX = 0, sumY = 0;
        points.forEach(d => {
          sumX += d.x;
          sumY += d.y;
        });
        const centroidX = sumX / points.length;
        const centroidY = sumY / points.length;

        // Draw a red dot at the centroid of each cluster
        svg.append("circle")
          .attr("cx", centroidX)
          .attr("cy", centroidY)
          .attr("r", 5) // Radius of the dot
          .style("fill", "red");
      });

      // Now, use the updated positions from the simulation to plot the circles
      svg.selectAll("circle")
        .data(testData)
        .join("circle")
        .attr("cx", d => d.x)
        .attr("cy", d => d.y)
        .attr("r", 3)
        .style("fill", "orange");

    }
  }, [windowSize, testData]);

  return (
    <div ref={d3Container} />
  );
}

export default App
