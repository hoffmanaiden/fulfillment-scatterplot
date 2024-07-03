const fs = require('fs');

const parts = ["ctx-11", "ctx-22", "rbi-11", "rbi-33", "fbi-99", "orm-302", "lmnop-55", "fop-11", "ntx-101", "orm-55", "rrf-22", "stn-31"]
const orders = [
  {
    orderNum: 600100, stage: 2, status: 0, lines: [
      { lineNum: 1, partNum: "ctx-11", qty: 10 },
      { lineNum: 2, partNum: "ctx-22", qty: 5 },
      { lineNum: 3, partNum: "rbi-11", qty: 40 },
      { lineNum: 4, partNum: "rbi-33", qty: 80 },
    ]
  },
  {
    orderNum: 600101, stage: 3, status: 0, lines: [
      { lineNum: 1, partNum: "fbi-99", qty: 4 },
      { lineNum: 2, partNum: "orm-302", qty: 25 },
      { lineNum: 3, partNum: "lmnop-55", qty: 24 },
      { lineNum: 4, partNum: "fop-11", qty: 4 },
    ]
  },
  {
    orderNum: 600102, stage: 4, status: 0, lines: [
      { lineNum: 1, partNum: "ntx-101", qty: 4 },
      { lineNum: 2, partNum: "orm-55", qty: 25 },
      { lineNum: 3, partNum: "rrf-22", qty: 24 },
      { lineNum: 4, partNum: "stn-31", qty: 4 },
    ]
  },
]

const generateNewOrders = () => {
  const newOrders = [];
  const lastOrderNum = orders[orders.length - 1].orderNum; // Fixed variable name to 'orders'
  for (let i = 0; i < 2000; i++) {
    const orderNum = lastOrderNum + i + 1;
    const stage = Math.floor(Math.random() * 5) + 1;
    let status;
    if (Math.random() <= 0.8) {
      status = 0;
    } else {
      do {
        status = Math.floor(Math.random() * 9) - 4;
      } while (status === 0);
    }
    const linesCount = Math.floor(Math.random() * 30) + 1; // Random number of lines between 1 and 30
    const lines = [];
    for (let j = 0; j < linesCount; j++) {
      const lineNum = j + 1;
      const partNum = parts[Math.floor(Math.random() * parts.length)]; // Random part from parts array
      const qty = Math.floor(Math.random() * 1000) + 1; // Random qty between 1 and 1000
      lines.push({ lineNum, partNum, qty });
    }
    newOrders.push({ orderNum, stage, status, lines });
  }
  return orders.concat(newOrders); // Fixed variable name to 'orders'
};

// Assuming `orders` is the existing array from TestData.js
const updatedOrders = generateNewOrders();


// Assuming `updatedOrders` contains the data you want to save
const dataToSave = JSON.stringify(updatedOrders, null, 2); // null and 2 are for formatting
console.log(dataToSave);

fs.writeFileSync('TestData.json', dataToSave, 'utf8', (err) => {
  if (err) {
    console.error('An error occurred:', err);
    return;
  }
  console.log('TestData.json has been saved.');
});