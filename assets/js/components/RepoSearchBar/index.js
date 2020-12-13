import React from 'react';

class RepoSearchBar extends React.Component {
	searchChange = (e) => {
		this.props.searchBarChange(e.target.value);
	}

	render() {
		return (
			<div className="sidebar-search">
				<div className="input-group">
					<input
						className="form-control search-bar"
						type="text"
						placeholder="Search..."
						onChange={this.searchChange}
					/>
					<div className="input-group-append">
						<span className="input-group-text">
							<i className="fa fa-search" aria-hidden="true"></i>
						</span>
					</div>
				</div>
			</div>
		);
	}
}
export default RepoSearchBar;
