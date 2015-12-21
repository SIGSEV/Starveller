if (process.env.BROWSER) { require('styles/Repo.scss') }

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import { resetRepo } from 'actions/repos'

import StarsEvolution from 'components/graphs/StarsEvolution'

@connect(
  state => ({
    repo: state.repos.current
  })
)
class Repo extends Component {

  componentWillUnmount () {
    this.props.dispatch(resetRepo())
  }

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

        <section className='graphs-container'>

          <section className='graph'>
            <StarsEvolution repo={repo} />
          </section>

        </section>

      </div>
    )
  }

}

export default Repo
