import React from 'react';
import {
    Link, BrowserRouter as Router, Route, Switch,
} from 'react-router-dom';
import RepoListContainer from './containers/RepoListContainer';
import CommitListContainer from './containers/CommitListContainer';
import RepoCreateContainer from './containers/RepoCreateContainer';

export default (
	<Router>
		<div id="wrapper" className="toggled">

			<div id="sidebar-wrapper">
				<div className="sidebar-nav">
					<div className="sidebar-brand">
						<Link to="/">
								Github Monitor
						</Link>
					</div>
					<RepoListContainer />
				</div>
			</div>

			<div id="page-content-wrapper">
				<div className="container-fluid">
					<RepoCreateContainer />
						<Switch>
							<Route path="/" exact component={CommitListContainer} />
							<Route path="/author/:author" exact component={CommitListContainer} />
							<Route path="/repo/:repo" exact component={CommitListContainer} />
						</Switch>
				</div>
			</div>

		</div>
	</Router>
);
