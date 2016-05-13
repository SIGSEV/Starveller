import shouldPureComponentUpdate from 'react-pure-render/function'
import _ from 'lodash'
import moment from 'moment'
import d3 from 'd3'
import React, { Component } from 'react'

import battleColors from 'data/battle-colors'
import { getReposBoundaries } from 'core/helpers/repos'

const bisectDate = d3.bisector(d => d.x).left

class StarsEvolution extends Component {

  static defaultProps = {
    repos: []
  };

  constructor (props) {
    super(props)

    this._isMounted = false
    this.drawDebounced = _.debounce(::this.drawIfMounted, 250)
    this.drawRepo = ::this.drawRepo
  }

  componentDidMount () {
    this._isMounted = true
    this.draw()
    window.addEventListener('resize', this.drawDebounced)
  }

  shouldComponentUpdate = shouldPureComponentUpdate;

  componentDidUpdate () {
    this.draw()
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.drawDebounced)
  }

  drawIfMounted () {
    if (!this._isMounted) { return }
    this.draw()
  }

  dataOf (repo) {
    const data = _.has(repo, 'stars.byDay') && repo.stars.byDay.length
      ? repo.stars.byDay.map(el => ({ x: new Date(el.date), y: el.stars }))
      : [{ x: new Date(), y: 0 }]

    // add today to data if needed
    const lastElem = _.last(data)
    if (!moment(lastElem.x).isSame(moment(), 'day')) {
      data.push({ x: new Date(), y: lastElem.y })
    }

    return data
  }

  draw () {

    const { repo, repos } = this.props

    const reposToDraw = repo ? [repo] : repos

    const { container } = this.refs
    const containerRect = container.getBoundingClientRect()

    // clear current graph
    d3.select(container).selectAll('*').remove()

    if (!reposToDraw.length) { return }

    const boundaries = getReposBoundaries(reposToDraw)

    // graph dimensions
    // ================

    const m = [80, 80, 80, 80]
    const w = containerRect.width - m[1] - m[3]
    const h = 600 - m[0] - m[2]

    // graph elements
    // ==============

    // axis

    const x = d3.time.scale().range([0, w])
    const y = d3.scale.linear().range([h, 0])

    const xAxis = d3.svg.axis()
      .scale(x)
      .ticks(5)
      .tickFormat(d3.time.format('%d/%m/%Y'))

    const yAxis = d3.svg.axis()
      .scale(y)
      .ticks(5)
      .orient('right')

    // graph boundaries

    x.domain([
      boundaries.minDate,
      boundaries.maxDate
    ])

    y.domain([
      boundaries.minStars,
      boundaries.maxStars
    ])

    // area

    this._area = d3.svg.area()
      .interpolate('linear')
      .x(d => x(d.x))
      .y0(h)
      .y1(d => y(d.y))

    // line
    this._line = d3.svg.line()
      .interpolate('linear')
      .x(d => x(d.x))
      .y(d => y(d.y))

    // drawing
    // =======

    this._svg = d3.select(container)
      .append('svg:svg')
      .attr('width', w + m[1] + m[3])
      .attr('height', h + m[0] + m[2])
      .append('svg:g')
      .attr('transform', `translate(${m[3]}, ${m[0]})`)

    this._svg.append('svg:g')
      .attr('class', 'x axis')
      .attr('transform', `translate(1, ${h})`)
      .call(xAxis)

    this._svg.append('svg:g')
      .attr('class', 'y axis')
      .attr('transform', `translate(${w}, 0)`)
      .call(yAxis)

    this._svg.selectAll('line.y')
      .data(y.ticks(5))
      .enter()
      .append('line')
      .attr('x1', 0)
      .attr('x2', w)
      .attr('y1', y)
      .attr('y2', y)
      .style('stroke', '#000000')
      .style('stroke-opacity', 0.1)

    reposToDraw.forEach(this.drawRepo)

    const hovering = this._svg.append('g')
      .attr('class', 'hovering')
      .style('display', 'none')

    hovering.append('path')
      .attr('class', 'hoverline')
      .style('stroke', 'black')
      .style('opacity', 0.3)

    d3.select(container)
      .on('mouseout', () => hovering.style('display', 'none'))
      .on('mouseover', () => hovering.style('display', null))
      .on('mousemove', () => {

        const line = d3.select('.hoverline')
        const xPoint = d3.mouse(line[0][0])[0]
        const yRange = y.range()
        const xRange = x.range()
        const x0 = x.invert(xPoint)
        const outOfBonds = (xRange[0] > xPoint || xRange[1] < xPoint)

        line.attr('d', () => {
          const outOfBonds = (xRange[0] > xPoint || xRange[1] < xPoint)
          hovering.style('display', outOfBonds ? 'none' : null)
          return `M${xPoint},${yRange[0]}L${xPoint},${yRange[1]}`
        })

        if (outOfBonds) { return }

        hovering.selectAll('circle').remove()
        hovering.selectAll('text').remove()

        reposToDraw.forEach((repo, key) => {
          const color = battleColors[key] || 'black'
          const data = this.dataOf(repo)
          const i = bisectDate(data, x0, 1)
          const d0 = data[i - 1]
          const d1 = data[i]
          const d = x0 - d0.x > d1.x - x0 ? d1 : d0

          const circle = hovering.append('circle')
            .attr('r', 4)
            .attr('fill', color)
            .attr('transform', `translate(${x(d.x)}, ${y(d.y)})`)

          const label = hovering.append('text')
            .attr('dy', '.35em')
            .attr('x', -40)
            .attr('y', -20)
            .attr('transform', `translate(${x(d.x)}, ${y(d.y)})`)
            .text(d.y)

        })

    })

  }

  drawRepo (repo, i) {

    const color = battleColors[i] || 'black'

    // data to show
    const data = this.dataOf(repo)

    /* disable fill for the moment
    this._svg.append('svg:path')
      .attr('class', 'area')
      .style('fill', color)
      .attr('d', this._area(data))*/

    this._svg.append('svg:path')
      .attr('class', 'line')
      .style('stroke', color)
      .attr('d', this._line(data))

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
