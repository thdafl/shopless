import * as React from 'react'
import { RouteComponentProps } from 'react-router'
import { useReim, State } from 'react-reim';
import { Button } from 'reakit'

import apollo from '../services/apollo';
import {CREATE_BRAND, RETRIEVE_BRAND} from '../graphql/brand'
import { Query, Mutation } from 'react-apollo';

function Brand({match}: RouteComponentProps<{id?: string}>) {
  const [brandName, {onChange}] = useReim('', {actions: {onChange: e => e.target.value}})

  return (
    <div>
      {match.params.id && (
        <Query query={RETRIEVE_BRAND} variables={{id: match.params.id}}>
          {({ data: {brand}, loading, error }: {data: any; loading: boolean; error?: Error}) => {
            if (loading) return <div>Loading...</div>;
            if (error) return <p>ERROR</p>
            return (
              <div>{JSON.stringify(brand)}</div>
            )
          }}
        </Query>
      )}
      {!match.params.id && (
        <Mutation mutation={CREATE_BRAND} variables={{brand: {name: brandName}}}>
        {(createBrand: any) => (
          <div>
            <input value={brandName} onChange={onChange}/>
            <Button onClick={createBrand}>Create Brand</Button>
          </div>
        )}
        </Mutation>
      )}
    </div>
  )
}

export default Brand
