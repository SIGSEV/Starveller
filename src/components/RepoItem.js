import React from 'react'
import RepoLink from 'components/RepoLink'

if (process.env.BROWSER) { require('styles/RepoItem.scss') }

export default (props) => {
  const { repo } = props
  const [author, name] = repo.name.split('/')
  const onSelect = props.onSelect || (() => {})
  return (
    <div
      onClick={() => { onSelect(repo) }}
      className='RepoItem'
      {...props}>

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
