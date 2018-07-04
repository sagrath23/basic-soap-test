import { fetch } from 'whatwg-fetch';

const endpoint = 'https://api.github.com/graphql';

export const getRepoInfo = async () => {
    const { status, body } = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({query: `viewer {
            repositories(first: 100) {
              edges {
                repository:node {
                  name
        
                  issues(first: 100) {
                    totalCount
                    edges {
                      node {
                        title
                        bodyHTML
                      }
                    }
                  }
                }
              }
            }
          }`})
    });
    console.log(body, 'body');
    return {status, body};
};
