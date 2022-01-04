import * as d3 from "d3";
export default class Chart {
    constructor(opt) {
        this._id = "body";
        this._width = 600;
        this._height = 400;
        this._margins = {top: 30, left: 30, right: 30, bottom: 30};
        this._data = [];
        this._scaleX = null;
        this._scaleY = null;
        this._colors = [
            "rgb(31, 119, 180)","rgb(93, 165, 218)",
            "rgb(255, 127, 14)","rgb(255, 187, 120)",
            "rgb(44, 160, 44)","rgb(152, 223, 138)",
            "rgb(214, 39, 40)","rgb(255, 152, 150)",
            "rgb(148, 103, 189)","rgb(197, 176, 213)",
            "rgb(140, 86, 75)","rgb(196, 156, 148)",
            "rgb(227, 119, 194)","rgb(247, 182, 210)",
            "rgb(127, 127, 127)","rgb(199, 199, 199)",
            "rgb(188, 189, 34)","rgb(219, 219, 141)",
            "rgb(23, 190, 207)","rgb(158, 218, 229)",  //tcga

            "rgb(46, 136, 203)","rgb(46, 189, 203)", "rgb(174, 199, 232)",
            "rgb(250, 100, 58)","rgb(240, 135, 6)","rgb(250, 164, 58)",
            "rgb(236, 24, 125)","rgb(241, 84, 132)","rgb(151, 85, 151)",
            "rgb(67, 161, 75)","rgb(96, 189, 104)",
            "rgb(178, 118, 178)","rgb(241, 88, 84)", //icgc
        ];
        this._svg = null;
        this._body = null;
        this._toolTip = null;
        this._opt = opt //外部引入的其它参数

    }
    colors(c){
        if (arguments.length === 0) return this._colors;
        this._colors = c;
        return this;
    }
    getScaleColor(){
        return d3.scaleOrdinal().domain(d3.range(0,this._colors.length-1,1)).range(this._colors)
    }
    id(id) {
        if (arguments.length === 0) return this._id;
        this._id = id;
        //如果初始化了选择器，则表明要用此选择容器的宽高
        const container = d3.select(id).node().getBoundingClientRect();
        if (this._opt && this._opt["width"]) {
            this._width = this._opt["width"] //设置个默认高度,最高为320
        }else{
            this._width = container.width;
            if (!this._width || this._width< 10) {
              this._width = 400  //设置个默认宽度,400
            }
        }
        if (this._opt && this._opt["height"]) {
            this._height = this._opt["height"] //设置个默认高度,最高为320
        } else {
            this._height = container.height;
            if (!this._height || this._height< 10) {
                this._height = 320  //设置个默认高度,最高为320
            }
        }
        return this;
    }

    width(w) {
        if (arguments.length === 0) return this._width;
        this._width = w;
        return this;
    }

    height(h) {
        if (arguments.length === 0) return this._height;
        this._height = h;
        return this;
    }

    margins(m) {
        if (arguments.length === 0) return this._margins;
        this._margins = m;
        return this;
    }

    data(d) {
        if (arguments.length === 0) return this._data;
        this._data = d;
        return this;
    }

    scaleX(x) {
        if (arguments.length === 0) return this._scaleX;
        this._scaleX = x;
        return this;
    }

    scaleY(y) {
        if (arguments.length === 0) return this._scaleY;
        this._scaleY = y;
        return this;
    }

    svg(s) {
        if (arguments.length === 0) return this._svg;
        this._svg = s;
        return this;
    }

    body(b) {
        if (arguments.length === 0) return this._body;
        this._body = b;
        return this;
    }

    getBodyWidth() {
        let width = this._width - this._margins.left - this._margins.right;
        return width > 0 ? width : 0;
    }

    getBodyHeight() {
        let height = this._height - this._margins.top - this._margins.bottom;
        return height > 0 ? height : 0;
    }

    defineBodyClip() {
        this._svg.append('defs')
            .append('clipPath')
            .attr('id', 'clip')
            .append('rect')
            .attr('width', this._width)
            .attr('height', this._height)
            .attr('x', 0)
            .attr('y', 0);
    }

    render() {
        return this;
    }

    bodyX() {
        return this._margins.left;
    }

    bodyY() {
        return this._margins.top;
    }

    moveToolTip(e) {
        this._toolTip.style("transform", `translate(${e.pageX}px,${e.pageY}px)`)
    }

    toggleToolTip(e, value) {
        if (!this._toolTip) return;
        if (!value) {
            return this._toolTip
                .style('visibility', "hidden")
                .style("opacity", 0)
        }
        this._toolTip.select(".wrapper>.tooltip-content").html(value)
        this._toolTip
            .style("transform", `translate(${e.pageX}px,${e.pageY}px)`)
            .style('visibility', "visible")
            .transition(100)
            .style("opacity", 0.95)

    }

    renderBody() {
        if (!this._body) {
            this._body = this._svg.append('g')
                .attr('class', 'body')
                .attr('transform', 'translate(' + this.bodyX() + ',' + this.bodyY() + ')')
        }

        this.render();
    }

    renderChart() {
        if (!this._svg) {
            this._svg = d3.select(this._id).append("svg")
                .classed('svg_container', true)
                .attr('viewBox', '0 0' + ' ' + this._width + ' ' + this._height)
                .attr('preserveAspectRatio', "xMidYMin meet")
                .attr("width", this._width)
                .attr("height", this._height)


            this._toolTip = d3.select("body>.chart_tooltip");
            if (!this._toolTip.node()) {
                this._toolTip = d3.select("body").append('div')
                    .attr('class', 'chart_tooltip')
                    .style('opacity', 0)
                    .style('visibility', "hidden")
                    .style('z-index', 9999)
                const wrapper = this._toolTip.append('div')
                    .classed("wrapper", true)
                    .style("transform", "translate(0px, -100%)")
                wrapper.append("div").classed("tooltip-content", true)
                wrapper.append("div")
                    .classed("tooltip-arrow", true)
                    .style("transform", "translateX(0px)")
                wrapper.append("div")
                    .classed("tooltip-content-c", true)
                    .style("transform", "translateX(0px)")
            }
        }
        this.defineBodyClip();
        this.renderBody();
        this.responsive();
    }

    responsive() {
        //@todo 根据viewbox缩放导致文字大小还有高度问题，后面优化绘图组件提供重绘函数进行重绘
        let container = d3.select(this._svg.node().parentNode),
            width = parseInt(this._svg.style("width")),
            height = parseInt(this._svg.style("height")),
            aspect = width / height;

        d3.select(window).on("resize." + container.attr("id"), () => {
            let targetWidth = parseInt(container.style("width")) - 24;
            this._svg.attr("width", targetWidth)
                .attr("height", Math.round(targetWidth / aspect));
        });
    }
}

