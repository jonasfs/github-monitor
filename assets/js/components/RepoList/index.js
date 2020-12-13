import React from 'react';

class RepoList extends React.Component {
	render() {
		const {repos, search, loading} = this.props;
		return (
			<div className="sidebar-repos">
				{loading? (
					<div className="list">
						<div className="list-header">
							<span> Loading results </span>
						</div>
					</div>
				) : (
					<div className="list">
						<div className="list-header">
							{search? 'Search results' : 'Listing all repositories'}
						</div>
						<ul className="list-group list-group-flush">
							{repos.map((repo, index) => (
								<li className="list-group-item list-group-item-action" key={index}>
									<span>
										<i className="fa fa-archive" aria-hidden="true"></i>
										<span> {repo.name} </span>
									</span>
								</li>
							))}
						</ul>
					</div>
				)}
			</div>
		);
	}
}
export default RepoList;
