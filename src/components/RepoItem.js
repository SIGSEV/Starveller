import React, { Component } from 'react'
import RepoLink from 'components/RepoLink'

if (process.env.BROWSER) { require('styles/RepoItem.scss') }

class RepoItem extends Component {

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
    const onSelect = this.props.onSelect || (() => {})
    return (
      <div
        onClick={() => { onSelect(repo) }}
        className='RepoItem'
        {...this.props}>

        <header>
          <div className='img' />
        </header>

        <section>
          <div className='RepoItem--name'>
            {author}
            <span className='RepoItem--slash'>{'/'}</span>
            <strong>
              {name}
            </strong>
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
