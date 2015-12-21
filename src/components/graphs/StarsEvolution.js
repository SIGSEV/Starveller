import _ from 'lodash'
import d3 from 'd3'
import React, { Component } from 'react'

class StarsEvolution extends Component {

  constructor (props) {
    super(props)

    this._isMounted = false
    this.drawDebounced = _.debounce(::this.drawIfMounted, 250)
  }

  componentDidMount () {
    this._isMounted = true
    this.draw()
    window.addEventListener('resize', this.drawDebounced)
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.drawDebounced)
  }

  drawIfMounted () {
    if (!this._isMounted) { return }
    this.draw()
  }

  draw () {

    const { repo } = this.props

    const { container } = this.refs
    const containerRect = container.getBoundingClientRect()

    // data to show
    const data = repo.byDay.map(
      el => ({ ...el, x: new Date(el.x) })
    )

    // graph dimensions
    const m = [80, 80, 80, 80]
    const w = containerRect.width - m[1] - m[3]
    const h = 600 - m[0] - m[2]

    // graph elements

    const x = d3.time.scale().range([0, w])
    const y = d3.scale.linear().range([h, 0])

    const xAxis = d3.svg.axis()
      .scale(x)
      .tickFormat(d3.time.format('%d/%m'))

    const yAxis = d3.svg.axis()
      .scale(y)
      .ticks(5)
      .orient('right')

    const area = d3.svg.area()
      .interpolate('linear')
      .x(d => x(d.x))
      .y0(h)
      .y1(d => y(d.y))

    const line = d3.svg.line()
      .interpolate('linear')
      .x(d => x(d.x))
      .y(d => y(d.y))

    x.domain([
      data[0].x,
      data[data.length - 1].x
    ])

    y.domain([
      0,
      d3.max(data, d => { return d.y })
    ])

    d3.select(container).selectAll('*').remove()

    const svg = d3.select(container)
      .append('svg:svg')
      .attr('width', w + m[1] + m[3])
      .attr('height', h + m[0] + m[2])
      .append('svg:g')
      .attr('transform', `translate(${m[3]}, ${m[0]})`)

    svg.append('svg:path')
      .attr('class', 'area')
      .attr('d', area(data))

    svg.append('svg:g')
      .attr('class', 'x axis')
      .attr('transform', `translate(1, ${h})`)
      .call(xAxis)

    svg.append('svg:g')
      .attr('class', 'y axis')
      .attr('transform', `translate(${w}, 0)`)
      .call(yAxis)

    svg.selectAll('line.y')
      .data(y.ticks(5))
      .enter()
      .append('line')
      .attr('x1', 0)
      .attr('x2', w)
      .attr('y1', y)
      .attr('y2', y)
      .style('stroke', '#000000')
      .style('stroke-opacity', 0.1)

    svg.append('svg:path')
      .attr('class', 'line')
      .attr('d', line(data))

    svg.append('svg:text')
      .attr('x', 80)
      .attr('y', -10)
      .attr('text-anchor', 'end')
      .text('Stars in time')
      .style('stroke', '#555')
      .style('fill', '#555')
      .style('stroke-width', 0.2)
      .style('font-size', '18px')
      .style('font-weight', 'bold')

    if (data.length < 100) {
      svg.selectAll('circle')
        .data(data)
        .enter()
        .append('circle')
        .attr('fill', '#008cdd')
        .attr('r', 3)
        .attr('cx', d => x(d.x))
        .attr('cy', d => y(d.y))
    }

    // mouse move

    const focus = svg.append('g')
      .style('display', 'none')

    const bisectDate = d3.bisector(d => d.x).left

    focus.append('circle')
      .attr('class', 'y')
      .style('fill', 'none')
      .style('stroke', '#008cdd')
      .attr('r', 6)
      .attr('z-index', 2)

    focus.append('line')
      .attr('class', 'x')
      .style('stroke', 'black')
      .style('stroke-dasharray', '3,3')
      .style('opacity', 0.3)
      .attr('y1', 0)
      .attr('y2', h)

    focus.append('line')
      .attr('class', 'y')
      .style('stroke', 'black')
      .style('stroke-dasharray', '3,3')
      .style('opacity', 0.3)
      .attr('x1', w)
      .attr('x2', w)

    svg.append('rect')
      .attr('width', w)
      .attr('height', h)
      .style('fill', 'none')
      .style('pointer-events', 'all')
      .on('mouseover', () => { focus.style('display', null) })
      .on('mouseout', () => { focus.style('display', 'none') })
      .on('mousemove', function () {
        /* eslint-disable */
        const x0 = x.invert(d3.mouse(this)[0])
        /* eslint-enable */
        const i = bisectDate(data, x0, 1)
        const d0 = data[i - 1]
        const d1 = data[i]
        const d = x0 - d0.x > d1.x - x0 ? d1 : d0

        focus.select('circle.y')
          .attr('transform', `translate(${x(d.x)}, ${y(d.y)})`)

        focus.select('line.y')
          .attr('transform', `translate(${w * -1}, ${y(d.y)})`)
          .attr('x2', w + w)

        focus.select('line.x')
          .attr('transform', `translate(${x(d.x)}, ${y(d.y)})`)
          .attr('y2', h - y(d.y))

      })

  }

  render () {
    return (
      <div className='graph-stars-evolution'>
        <div ref='container' />
      </div>
    )
  }

}

export default StarsEvolution
