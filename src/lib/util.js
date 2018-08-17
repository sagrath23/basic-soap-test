import { GraphQLClient } from 'graphql-request';
import config from '../config.json';

/**	Creates a callback that proxies node callback style arguments to an Express Response object.
 *	@param {express.Response} res	Express HTTP Response
 *	@param {number} [status=200]	Status code to send on success
 *
 *	@example
 *		list(req, res) {
 *			collection.find({}, toRes(res));
 *		}
 */
export function toRes(res, status = 200) {
  return (err, thing) => {
    if (err) return res.status(500).send(err);

    if (thing && typeof thing.toObject === 'function') {
      thing = thing.toObject();
    }
    res.status(status).json(thing);
  };
}

const endpoint = `https://api.github.com/graphql`;

export const getBasicInfoFromGithub = async () => {
  const client = new GraphQLClient(endpoint, {
    headers: {
      Authorization: `bearer ${config.githubToken}`
    }
  });

  const query = `
		{
			query: 
			organization(login: "${config.organizationName}") {
				repositories (first: 100) {
					totalCount
					nodes {
						nameWithOwner
						refs (refPrefix:"refs/heads/"){
							totalCount
						}
						pullRequests (first: 100) {
							totalCount
						}
						languages(first: 3, orderBy: {field: SIZE direction: DESC}) {
							edges {
							  size
							  node {
								name
							  }
							}
						}
						openIssues: issues (first: 100, states: [OPEN]) {
							totalCount
							nodes{
								title
								publishedAt
							} 
						}
						closedIssues: issues (first: 100, states: [CLOSED]) {
							totalCount
							nodes{
								title
								publishedAt
							}
						}
					}
				}
			}
			rateLimit{
				cost
				limit
				nodeCount
				remaining
			}
	  }`;

  return await client.request(query);
};

export const searchComponentsBasicInfoFromGithub = async () => {
  const client = new GraphQLClient(endpoint, {
    headers: {
      Authorization: `bearer ${config.githubToken}`
    }
  });

  const query = `
	query GetRepositoryBasicInfo($login: String!, $repositoriesName: String!, $lastMonthInitialDate: DateTime!) {
    repositoryOwner(login: $login) {
      repository (name: $repositoriesName) {
      	#repository name
				nameWithOwner
      	# defaultBranch name & last update date
				defaultBranchRef {
					name
					target {
						... on Commit {
							history (first:1) {
								edges{
									node{
										... on Commit {
											committedDate
										}
									}
								}
							}
						}
					}
				}
      	#active branches
				#validate how to filter branches per state (master & support)
				refs (refPrefix:"refs/heads/"){
					totalCount
				}
      	#open pull requests
				openPullRequests: pullRequests (states: [OPEN]) {
					totalCount
				}
				#last month's pull requests
				#TODO: improve selection here
				pullRequestInTheLastMonth: pullRequests(last: 30, states: [MERGED]) {
					edges {
						node {
							title
							number
							createdAt
							timeline(last: 10, since: $lastMonthInitialDate) {
								edges {
									node {
										__typename
										... on MergedEvent{
											createdAt
										}
									}
								}
							}
						}
					}
      	}
				#languages info
      	languages(first: 3, orderBy: {field: SIZE direction: DESC}) {
					edges {
						size
						node {
							name
						}
					}
				}
				#open issues
      	openIssues: issues (first: 100, states: [OPEN]) {
					totalCount
					nodes{
						title
						publishedAt
					} 
				}
      	#closed issues
				closedIssues: issues (first: 100, states: [CLOSED]) {
					totalCount
					nodes{
						title
						publishedAt
					}
				}
			}
    }
    rateLimit{
      cost
      limit
      nodeCount
      remaining
    }
  }`;
	
	const variables ={
		login: config.organizationName,
		repositoriesName: config.repositoryName,
		lastMonthInitialDate: '2018-07-16T00:00:01Z'
	} 

  return await client.request(query, variables);
};