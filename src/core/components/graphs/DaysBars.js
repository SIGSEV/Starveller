import d3 from 'd3'
import _ from 'lodash'
import React, { Component } from 'react'

if (process.env.BROWSER) { require('client/styles/Graph.scss') }

class DaysBars extends Component {

  static defaultProps = {
    stars: []
  };

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

    const { container } = this.refs
    const { stars } = this.props

    const containerRect = container.getBoundingClientRect()
    const maxHeight = containerRect.height - 20
    const max = _.max(stars)

    // clear current graph
    d3.select(container).selectAll('*').remove()

    d3.select(container)
      .selectAll('div')
      .data(stars)
      .enter()
      .append('div')
      .attr('class', 'bar')
      .style('height', d => {
        const percentage = d / max
        const height = Math.round(maxHeight * percentage)
        return `${height}px`
      })

  }

  render () {
    return (
      <div className='graph-days-bars graph-container' ref='container' />
    )
  }

}

export default DaysBars
