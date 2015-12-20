import React, { Component } from 'react'
import _ from 'lodash'
import moment from 'moment'
import { LineChart } from 'react-d3'

if (process.env.BROWSER) { require('styles/Graph.scss') }

class Graph extends Component {

  render () {
    const { stars } = this.props.repo
    const reduced = _.reduce(
      _.mapValues(
        _.groupBy(stars, date => moment(date).format('YYYY-MM-DD')),
        el => el.length
      ),
      (res, val, key) => { return res.concat({ x: new Date(key), y: val }) },
      []
    )
      .sort((a, b) => {
        return moment(a.x).isBefore(moment(b.x)) ? -1 : 1
      })

    let acc = 0
    reduced.forEach(el => {
      el.y += acc
      acc = el.y
    })

    const data = [{
      name: 'stars',
      strokeWidth: 2,
      values: reduced
    }]

    return (
      <div className='Graph'>
        <LineChart
          data={data}
          width={640}
          height={600}
          viewBoxObject={{
            x: 0,
            y: 0,
            width: 640,
            height: 600
          }}
          yAxisLabel='Stars'
          xAxisLabel='Date'
          gridHorizontal
        />
      </div>
    )
  }

}

export default Graph
