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

function clusterObjects(objects) {
  const clusters = {}
  objects.forEach(obj => {
    const key = `${obj.stage}:${obj.status}`
    if (!clusters[key]) {
      clusters[key] = { x: obj.stage, y: obj.status, children: [] }
    }
    clusters[key].children.push(obj)
  })
  return clusters
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
    let clusteredObjects = clusterObjects(testData)
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

      // ----------------------------------------------------------
      // Grid above, data below
      // ----------------------------------------------------------

      // Assuming clusteredObjects is an array of objects with x and y properties
      Object.values(clusteredObjects).forEach(obj => {
        svg.append("circle") // Append a circle for each object
          .datum(obj)
          .attr("cx", x(obj.x)) // Set the x-coordinate based on the x scale
          .attr("cy", y(obj.y)) // Set the y-coordinate based on the y scale
          .attr("r", 5) // Radius of the circle
          .style("fill", "blue") // Fill color of the circle
      });

    }
  }, [windowSize, testData]);

  return (
    <div ref={d3Container} />
  );
}

export default App
