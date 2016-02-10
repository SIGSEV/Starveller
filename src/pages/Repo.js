if (process.env.BROWSER) { require('styles/Repo.scss') }

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { prefetch } from 'react-fetcher'
import { Link } from 'react-router'

import StarsEvolution from 'components/graphs/StarsEvolution'

import { askRepo, setCurrent } from 'actions/repos'

@prefetch(({ dispatch, params }) => {
  const { owner, reponame } = params
  return dispatch(askRepo({ name: `${owner}/${reponame}` }))
    .then(repo => dispatch(setCurrent(repo)))
})
@connect(
  state => ({
    repo: state.repos.all[state.repos.current],
    progress: state.loader.progress[state.repos.current] || 0
  })
)
class Repo extends Component {

  renderPlaceholder () {
    return (
      <div></div>
    )
  }

  renderLimitError () {
    return (
      <div className='mt3' style={{ color: 'orangered', textAlign: 'center' }}>
        <p className='mb'>{'Due to Github API limitations, we cannot fetch repo with more than 40.000 stars for the moment.'}</p>
        <p>
          <a href='' target='_blank'>Sign the petition here</a>
          <span className='bullet' />
          <Link to='/'>{'Bring me back'}</Link>
        </p>
      </div>
    )
  }

  render () {
    const { repo, progress } = this.props

    if (!repo) { return this.renderPlaceholder() }
    if (repo.summary.starsCount > 40000) { return this.renderLimitError() }

    return (
      <div className='container mt2'>

        <header className='repo-header'>

          <div className='repo-name'>
            <a target='_blank' href={`https://github.com/${repo.name}`} style={{ marginRight: '0.5em' }}>
              <i className='octicon octicon-mark-github' />
            </a>
            {repo.name}
          </div>

        </header>

        <section className='graphs-container'>

          <section className='graph'>
            {!repo.complete
              ? (
                <div>
                  <div className='graph-loader'>
                    <span className='mega-octicon octicon-sync' />
                    <p>{progress}{' %'}</p>
                  </div>
                </div>
              )
              : <StarsEvolution repo={repo} />}
          </section>

        </section>

      </div>
    )
  }

}

export default Repo
