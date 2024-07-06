import testData from './TestData.json' assert { type: 'json' };

function clusterObjects(objects){
    const clusters = {}
    objects.forEach(obj => {
        const key = `${obj.stage}:${obj.status}`
        if (!clusters[key]) {
            clusters[key] = {x: obj.stage, y: obj.status, children: []}
        }
        clusters[key].children.push(obj)
    })
    return clusters
}

const clusteredObjects = clusterObjects(testData)
console.log(clusteredObjects)