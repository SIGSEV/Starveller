import React from 'react'
import RepoLink from 'components/RepoLink'

export default ({ repo }) => (
  <div className='repo'>
    <header>
      <RepoLink repo={repo}>
        {repo.name}
      </RepoLink>
    </header>
  </div>
)
