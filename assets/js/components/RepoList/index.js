import React from 'react';

class RepoList extends React.Component {
	render() {
		const {repos, search, loading, searching, paginator} = this.props;
		return (
			<div className="sidebar-repos">
				<div className="list">
					<div className="list-header">
						{loading || searching? 'Loading results' : 
							search? 'Search results' : 'Listing all repositories'
						}
					</div>
					{ searching? '' : paginator }
					{ loading? (
						<div className="d-flex justify-content-center">
							<div className="fa-2x text-light">
								<i className="fa fa-circle-o-notch fa-spin" aria-hidden="true"></i>
							</div>
						</div>
					)
					: (
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
					)}
				</div>
			</div>
		);
	}
}
export default RepoList;
