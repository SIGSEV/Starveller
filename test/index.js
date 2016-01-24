import { expect } from 'chai'

import reduceBars from 'helpers/reduce-bars'

describe('Reduce Bars', () => {

  it('should do something', () => {

    const stars = [
      ['2016-01-01', 5],
      ['2016-01-02', 7],
      ['2016-01-03', 8],
      ['2016-02-01', 10],
      ['2016-02-02', 11]
    ]

    expect(reduceBars(stars)).to.equal(5)
  })

})
