import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const CommitList = (props) => {
  const {commits, paginator} = props;
  return (
    <div>
			<div>
				<div className="card card-outline-secondary my-4">
					<div className="card-header">
						<div className="row">
							<div className="col">
								Commit List
							</div>
							<div className="col">
								{paginator}
							</div>
						</div>
					</div>
					<div className="card-body">
						{commits.length !== 0 ? (
							commits.map((commit, index) => (
								<div key={commit.sha}>
									<div className="avatar">
										<img alt={commit.author} className="img-author" src={commit.avatar} />
									</div>
									<div className="commit-details">
										<p>
											{commit.message}
										</p>
										<small className="text-muted">
											<Link to={`/author/${commit.author}`}>
												{commit.author}
											</Link>
											{' '}
											authored
											{' '}
											on
											{' '}
											<Link to={`/repo/${commit.repository}`}>
												{commit.repository}
											</Link>
											{' '}
											at
											{' '}
											{commit.date}
										</small>
										{index !== commits.length - 1 && <hr />}
									</div>
								</div>
							))
						) : (
							<div className="d-flex justify-content-center">
								<div className="fa-2x text-primary">
									<i className="fa fa-circle-o-notch fa-spin" aria-hidden="true"></i>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
    </div>
  );
};

CommitList.propTypes = {
  commits: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default CommitList;
