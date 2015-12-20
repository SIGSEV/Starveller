import React, { Component } from 'react'
import { LineChart } from 'react-d3'

if (process.env.BROWSER) { require('styles/Graph.scss') }

class Graph extends Component {

  render () {
    const { stars } = this.props.repo

    const data = [{
      name: 'stars',
      strokeWidth: 2,
      values: stars.map(coords => ({ ...coords, x: new Date(coords.x) }))
    }]

    return (
      <div className='Graph'>

        {!!stars.length && (
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
        )}

        {!stars.length && (
          <div>{'No data :)'}</div>
        )}

      </div>
    )
  }

}

export default Graph
