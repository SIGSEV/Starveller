import React, { Component } from 'react'
import { connect } from 'react-redux'

import Graph from 'components/Graph'

@connect(
  state => ({
    repo: state.repo
  })
)
class Repo extends Component {

  render () {
    const { repo } = this.props

    return (
      <div>

        {repo.name}

        <Graph
          repo={repo} />

      </div>
    )
  }

}

export default Repo
