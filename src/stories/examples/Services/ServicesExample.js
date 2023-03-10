import './service.css'
import React from 'react'
import { PaginatedContainer, PagenationService, Grid } from '../Lib'
import MockApiService from '../../../mock/MockApiService'

const ItemCard = ({ item }) => {
  return (
    <div className='card'>
      <p>{item.name}</p>
      <p>{item.description}</p>
      <p>{item.wholeSalePrice}</p>
      <p>{item.morabaaId}</p>
      <p>{item.test}</p>
    </div>
  )
}

const ServicesExample = () => {
  const service = React.useMemo(() => {
    const test = new MockApiService({ baseURL: 'baseURL_test' })
    const _service = new PagenationService({
      callback: test.get,
      endpoint: 'endpoint_test',
      useCash: true,
      storage: sessionStorage
      // storageKey: 'test-pagenation'
    })

    _service.search()
    return _service
  }, [])

  return (
    <PaginatedContainer service={service} itemBuilder={ItemCard} useRefresh>
      <input
        type='text'
        className='input'
        onChange={({ target }) => {
          service.updateQueryParams({ id: 'name', value: target.value })
        }}
      />
      <Grid service={service} ItemBuilder={ItemCard} />
    </PaginatedContainer>
  )
}

export default ServicesExample
