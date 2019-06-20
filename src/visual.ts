"use strict";

/*
export interface LinechartDataPoint {
    Axis: string;
    Value: number;
}


export interface LinechartViewModel {
    IsNotValid: boolean;
    DataPoints?: LinechartDataPoint;
    Format?: string;
    SortBySize?: boolean;
    FontSize?: number;
}
*/

import "./../style/visual.less";

import powerbi from "powerbi-visuals-api";
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;

import * as d3 from "d3";

export class Visual implements IVisual {

    private svgRoot: d3.Selection<SVGElement, {}, HTMLElement, any>;
    private xAxis: d3.Selection<SVGElement, {}, HTMLElement, any>;
    private yAxis: d3.Selection<SVGElement, {}, HTMLElement, any>;
    private line: d3.Selection<SVGElement, {}, HTMLElement, any>;
    private circle: d3.Selection<SVGElement, {}, HTMLElement, any>;
    private padding: number = 20;

    constructor(options: VisualConstructorOptions) {
        console.log('Visual constructor', options);

        this.svgRoot = d3.select(options.element)
            .append("svg");

        this.xAxis = this.svgRoot
            .append("g")
            .attr("class", "x axis")
            .style("stroke", "black")
            .style("stroke-width", "1");

        this.yAxis = this.svgRoot
            .append("g")
            .attr("class", "y axis")
            .style("stroke", "black")
            .style("stroke-width", "1");

        /*
        this.line = this.svgRoot
            .append("g")
            .style("stroke", "black");
        */

        this.RenderVisual(options.element.clientWidth, options.element.clientHeight);

    }

    public update(options: VisualUpdateOptions) {

        // console.log('Visual update', options);
        // let dataView: DataView = options.dataViews[0]

        this.RenderVisual(options.viewport.width, options.viewport.height);

    }

    private RenderVisual(clientWidth: number, clientHeight: number) {

        this.svgRoot
            .attr("width", clientWidth)
            .attr("height", clientHeight);
        // .append("g");

        var plot = {
            xOffset: this.padding,
            yOffset: this.padding,
            width: clientWidth - (this.padding * 2),
            height: clientHeight - (this.padding * 2),
        };

        var n = 21;

        var dataset = d3.range(n).map(function (d) { return { "y": d3.randomUniform(1e4)() } });

        var dataset2 = d3.range(n).map(function (d) { return { "y": d3.randomUniform(2e4)() } });

        var xScale = d3.scaleLinear()
            .domain([0, n - 1])
            .range([0, plot.width - 10]);

        var yScale = d3.scaleLinear()
            .domain([0, 2e4]) // input 
            .range([plot.height, 0]); // output

        var line = d3.line<any>()
            .x(function (d, i) { return xScale(i); }) // set the x values for the line generator
            .y(function (d) { return yScale(d.y); }) // set the y values for the line generator 
        // .curve(d3.curveMonotoneX) // apply smoothing to the line

        this.xAxis
            .attr("transform", "translate(32," + (plot.height + 10) + ")")
            .call(d3.axisBottom(xScale));

        this.yAxis
            .attr("transform", "translate(32, 10)")
            .call(d3.axisLeft(yScale)
                .ticks(10, "$s"));

        // 9. Append the path, bind the data, and call the line generator 
        this.svgRoot
            .append("path")
            .datum(dataset) // 10. Binds data to the line 
            .attr("class", "line") // Assign a class for styling 
            .style("stroke-dasharray", ("10, 5"))
            .attr("d", line) // 11. Calls the line generator
            .attr("transform", "translate(32,10)");

        this.svgRoot
            .append("path")
            .datum(dataset2) // 10. Binds data to the line 
            .attr("class", "line2") // Assign a class for styling 
            .style("stroke-dasharray", ("10, 5"))
            .attr("d", line) // 11. Calls the line generator
            .attr("transform", "translate(32,10)");

        // 12. Appends a circle for each datapoint 

        /*
        this.svgRoot.selectAll(".dot")
            .data(dataset)
            .enter()
            .append("circle") // Uses the enter().append() method
            .attr("class", "dot") // Assign a class for styling
            .attr("cx", function (d, i) { return xScale(i) })
            .attr("cy", function (d) { return yScale(d.y) })
            .attr("r", 5)
            .attr("transform", "translate(30,10)");
            .on("mouseover", function (a, b, c) {
                console.log(a)
                this.attr('class', 'focus')
            })
            .on("mouseout", function () { })
        //       .on("mousemove", mousemove);
        */
    }
}