if (process.env.BROWSER) { require('styles/Repo.scss') }

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { prefetch } from 'react-fetcher'

import StarsEvolution from 'components/graphs/StarsEvolution'

import { askRepo, setCurrent } from 'actions/repos'

@prefetch(({ dispatch, params }) => {
  const { owner, reponame } = params
  return dispatch(askRepo({ name: `${owner}/${reponame}` }))
    .then(repo => dispatch(setCurrent(repo)))
})
@connect(
  state => ({
    repo: state.repos.all[state.repos.current]
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
            <a target='_blank' href={`https://github.com/${repo.name}`} style={{ marginRight: '0.5em' }}>
              <i className='octicon octicon-mark-github' />
            </a>
            {repo.name}
          </div>

        </header>

        <section className='graphs-container'>

          <section className='graph'>
            <StarsEvolution repo={repo} loading={!repo.complete} />
          </section>

        </section>

      </div>
    )
  }

}

export default Repo
