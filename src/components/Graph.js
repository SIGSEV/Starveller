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
        _.groupBy(stars, star => moment(star.date).format('YYYY-MM-DD')),
        el => el.length
      ),
      (res, val, key) => { return res.concat({ x: new Date(key), y: val }) },
      []
    )

    const data = [{
      name: 'stars',
      strokeWidth: 3,
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
