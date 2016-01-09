import React from 'react'
import RepoLink from 'components/RepoLink'

export default ({ repo }) => (
  <div className='repo' style={repo.shot ? { backgroundImage: `url('data:image/png;base64,${repo.shot}')` } : {}}>
    <header>
      <RepoLink repo={repo}>
        {repo.name}
      </RepoLink>
    </header>
  </div>
)
