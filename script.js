// Defining variables
const width = 800
const height = 600
const padding = 60

let url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json"
let req = new XMLHttpRequest()

let data; let dataset

let heightScale
let xScale
let xAxisScale
let yAxisScale

// Creating svg canvas
const svg = d3.select('svg')
                .attr('width', width)
                .attr('height', height)

// Create scales
let generateScales = () => {
    heightScale = d3.scaleLinear()
                .domain([0, d3.max(dataset, d => d[1])])
                .range([0, (height-2*padding)])

    xScale = d3.scaleLinear()
                .domain([0, dataset.length-1])
                .range([padding, width - padding])

    yAxisScale = d3.scaleLinear()
                    .domain([0, d3.max(dataset, d => d[1])])    
                    .range([height - padding, padding])        

    let dateArray = dataset.map(d => new Date(d[0]))
    xAxisScale = d3.scaleTime()
                    .domain([d3.min(dateArray), d3.max(dateArray)])
                    .range([padding, width-padding])
}

let drawBars = () => {
    function quarter (month) {
        if (month <= 3) {return 'Q1'}
        else if (month <=6) {return 'Q2'}
        else if (month <=9) {return 'Q3'}
        else {return 'Q4'}
    }

    let tooltip = d3.select('body')
                        .append('div')
                        .style('visibility', 'hidden')
                        .attr('id', 'tooltip')
                        .style('width', 'auto')
                        .style('height', 'auto')

    svg.selectAll('rect')
        .data(dataset)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('width', (width - (2*padding))/dataset.length)
        .attr('data-date', d => d[0])
        .attr('data-gdp', d => d[1])
        .attr('height', d => heightScale(d[1]))
        .attr('x', (d,i) => xScale(i))
        .attr('y', d => height-padding-heightScale(d[1]))
        .on('mouseover', d => {
            d = d.srcElement.__data__
            tooltip.transition()
                    .style('visibility', 'visible')
            
            tooltip.text(d[0].slice(0,4) + " " + quarter(d[0].slice(5,7))+"\t\t\t$" +d[1].toLocaleString()+" Billion")

            document.querySelector('#tooltip').setAttribute('data-date', d[0])
        })
        .on('mouseout', d => {
            tooltip.transition()
                    .style('visibility', 'hidden')
        })
        

}

let generateAxes = () => {
    let xAxis = d3.axisBottom(xAxisScale)
    svg.append('g')
        .call(xAxis)
        .attr('id', 'x-axis')
        .attr('transform', 'translate(0, '+(height - padding)+')')

    let yAxis = d3.axisLeft(yAxisScale)
    svg.append('g')
        .call(yAxis)
        .attr('id', 'y-axis')
        .attr('transform', 'translate('+padding+', 0)')
}

// Pulling API data and plotting
req.open('GET', url, true)
req.send()
req.onload = () => {
    data = JSON.parse(req.responseText)
    dataset = data.data

    generateScales()

    drawBars()
    
    generateAxes()
}

