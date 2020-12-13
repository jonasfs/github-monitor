import React from 'react';
import RepoSearchBar from '../components/RepoSearchBar';
import RepoList from '../components/RepoList';
import * as commitAPI from '../api/CommitAPI';

class RepoListContainer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			repos: [],
			timeoutID: null,
			search: "",
			loading: false,
		}

	}

	searchBarChange = value => {
		const waitSeconds = 2;
		clearTimeout(this.state.timeoutID);
		let timeout = setTimeout(() => {
			commitAPI.getReposSearch(value).then((response) => {
				this.setState({repos: response.data.results, loading: false});
			});
		}, waitSeconds * 1000);
		this.setState({search: value, timeoutID: timeout, loading: true});
	}

	componentDidMount() {
		commitAPI.getRepos().then((response) => {
			this.setState({repos: response.data.results});
		});
	}

	render() {
		const {repos, search, loading} = this.state;
		return (
			<div>
				<RepoSearchBar searchBarChange={this.searchBarChange}/>
				<RepoList repos={repos} search={search} loading={loading} />
			</div>
		);
	}
}
export default RepoListContainer;
