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

      // ----------------------------------------------------------
      // Grid above, data below
      // ----------------------------------------------------------

      // Create a simulation for the data points
      // const simulation = d3.forceSimulation(testData)
      //   .force("x", d3.forceX(d => x(d.stage)).strength(0.5))
      //   .force("y", d3.forceY(d => y(d.status)).strength(0.5))
      //   .force("collide", d3.forceCollide(5)) // Use a collision force with a radius to prevent overlap
      //   .stop();

      // Run the simulation a fixed number of times
      // for (let i = 0; i < 120; ++i) simulation.tick();

      // Now, use the updated positions from the simulation to plot the circles
      // svg.selectAll("circle")
      //   .data(testData)
      //   .join("circle")
      //   .attr("cx", d => d.x)
      //   .attr("cy", d => d.y)
      //   .attr("r", 3)
      //   .style("fill", "orange");

      // Define drag behavior
      const drag = d3.drag()
        .on("start", dragStarted)
        .on("drag", dragged)
        .on("end", dragEnded);

      function dragStarted(event, d) {
        d3.select(this).raise().classed("active", true);
      }

      function dragged(event, d) {
        d3.select(this)
          .attr("cx", event.x)
          .attr("cy", event.y);
      }

      function dragEnded(event, d) {
        // Snap back to original position
        d3.select(this)
          .classed("active", false)
          .transition()
          .duration(900)
          .attr("cx", d.x)
          .attr("cy", d.y);
      }

      const uniqueCoordinates = new Map();
      // Aggregate unique coordinates
      testData.forEach(d => {
        const xCoord = x(d.stage); // Assuming 'stage' is mapped to the x-axis
        const yCoord = y(d.status); // Assuming 'status' is mapped to the y-axis
        const key = `${xCoord},${yCoord}`;

        if (!uniqueCoordinates.has(key)) {
          uniqueCoordinates.set(key, { x: xCoord, y: yCoord });
        }
      });

      // Plot red points at unique coordinates
      svg.selectAll("uniqueCircle")
        .data(Array.from(uniqueCoordinates.values()))
        .join("circle")
        .attr("cx", d => d.x)
        .attr("cy", d => d.y)
        .attr("r", 6) // Radius of the circle
        .style("fill", "red")
        .call(drag);
    }
  }, [windowSize, testData]);

  return (
    <div ref={d3Container} />
  );
}

export default App
