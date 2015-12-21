if (process.env.BROWSER) { require('styles/Repo.scss') }

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import Graph from 'components/Graph'

@connect(
  state => ({
    repo: state.repos.current
  })
)
class Repo extends Component {

  render () {
    const { repo } = this.props

    return (
      <div>

        <header className='repo-header'>

          <Link to='/' className='back'>
            <i className='octicon octicon-chevron-left' />
            {' Back'}
          </Link>

          <div className='repo-name'>
            {repo.name}
          </div>

        </header>

        <section className='repo-graph'>
          <Graph
            repo={repo} />
        </section>

      </div>
    )
  }

}

export default Repo
