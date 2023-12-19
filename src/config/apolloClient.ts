import { ApolloClient, InMemoryCache, NormalizedCacheObject } from '@apollo/client';

const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
    uri: 'https://teebay.vercel.app/graphql',
    cache: new InMemoryCache(),
    connectToDevTools: true

});

export default client;
