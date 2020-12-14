import React from 'react';
import RepoSearchBar from '../components/RepoSearchBar';
import RepoList from '../components/RepoList';
import Paginator from '../components/Paginator';
import * as commitAPI from '../api/CommitAPI';

class RepoListContainer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			repos: [],
			timeoutID: null,
			search: "",
			loading: true,
			searching: true,
			limit: 10,
			offset: 0,
			count: 0,
		}

	}

	searchBarChange = value => {
		const waitSeconds = 2;
		clearTimeout(this.state.timeoutID);
		let timeout = setTimeout(() => {
			commitAPI.getReposSearch(value).then((response) => {
				this.setState({
					repos: response.data.results,
					offset: 0,
					count: response.data.count,
					searching: false,
					loading: false});
			});
		}, waitSeconds * 1000);
		this.setState({search: value, timeoutID: timeout, loading: true, searching: true});
	}

	getPage = newOffset => {
		let oldOffset = this.state.offset;
		this.setState({offset: newOffset, loading: true});
		commitAPI.getRepos(this.state.limit, newOffset).then((response) => {
			this.setState({
				repos: response.data.results,
				offset: newOffset,
				loading: false});
		}).catch((error) => {
			console.log(error);
			this.setState({offset: oldOffset, loading: false});
		});
	}

	componentDidMount() {
		commitAPI.getRepos().then((response) => {
			this.setState({
				repos: response.data.results,
				count: response.data.count,
				loading: false,
				searching: false
			});
		});
	}

	render() {
		const {repos, search, loading, searching, offset, limit, count} = this.state;
		return (
			<div>
				<RepoSearchBar searchBarChange={this.searchBarChange} />
				<RepoList
					repos={repos}
					search={search}
					loading={loading}
					searching={searching}
					paginator={
						<Paginator
							getPage={this.getPage}
							offset={offset}
							limit={limit}
							count={count}
							loading={loading}
						/>
					}
				/>
			</div>
		);
	}
}
export default RepoListContainer;
