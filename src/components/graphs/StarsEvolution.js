import shouldPureComponentUpdate from 'react-pure-render/function'
import _ from 'lodash'
import moment from 'moment'
import d3 from 'd3'
import React, { Component } from 'react'

import battleColors from 'data/battle-colors'
import { getReposBoundaries } from 'helpers/repos'

class StarsEvolution extends Component {

  shouldComponentUpdate = shouldPureComponentUpdate

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

  }

  drawRepo (repo, i) {

    const color = battleColors[i] || 'black'

    // data to show
    const data = _.has(repo, 'stars.byDay') && repo.stars.byDay.length
      ? repo.stars.byDay.map(el => ({ y: el.stars, x: new Date(el.date) }))
      : [{ x: new Date(), y: 0 }]

    // add today to graph if needed
    const lastElem = _.last(data)
    if (!moment(lastElem.x).isSame(moment(), 'day')) {
      data.push({ x: new Date(), y: lastElem.y })
    }

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
