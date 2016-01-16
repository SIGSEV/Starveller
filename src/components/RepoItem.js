import React, { Component } from 'react'
import { connect } from 'react-redux'

import RepoLink from 'components/RepoLink'

import { deleteRepo } from 'actions/repos'

if (process.env.BROWSER) { require('styles/RepoItem.scss') }

@connect()
class RepoItem extends Component {

  deleteRepo (e) {
    e.preventDefault()
    const { dispatch, repo } = this.props
    dispatch(deleteRepo(repo))
  }

  renderBlank () {
    return (
      <div className='RepoItem blank' {...this.props}>
        <header>
          <div className='img' />
        </header>
      </div>
    )
  }

  render () {
    const { repo, blank } = this.props

    // placeholder for RepoItem, while loading
    if (blank) { return this.renderBlank() }

    const [author, name] = repo.name.split('/')

    return (
      <div
        className='RepoItem'>

        <header>
          <div className='img' />
        </header>

        <section>
          <div className='RepoItem--title'>
            <RepoLink repo={repo} className='RepoItem--name'>
              {author}
              <span className='RepoItem--slash'>{'/'}</span>
              <strong>
                {name}
              </strong>
            </RepoLink>

            {process.env.NODE_ENV !== 'production' && (
              <span>
                {' - '}
                <a href='' onClick={::this.deleteRepo}>{'delete'}</a>
              </span>
            )}
          </div>

          <div className='RepoItem--desc'>
            {repo.summary.description}
          </div>
          <div className='RepoItem--tags'>
            {`Javascript • ${repo.summary.starsCount} stars`}
          </div>
        </section>

      </div>
    )

  }

}

export default RepoItem
