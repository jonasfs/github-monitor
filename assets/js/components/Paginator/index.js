import React from 'react';

class Paginator extends React.Component {
	prevPage = () => {
		let newOffset = this.props.offset - this.props.limit;
		this.props.getPage(newOffset);
	}

	nextPage = () => {
		let newOffset = this.props.offset + this.props.limit;
		this.props.getPage(newOffset);
	}

	render() {
		let {limit, offset, count, loading} = this.props;
		let prevClass = "page-item";
		if ((offset==0) || loading) {
			prevClass += " disabled";
		}

		let nextClass = "page-item";
		if ((offset+limit>=count) || loading) {
			nextClass += " disabled";
		}
		let rightHand = (offset+limit)>count? count : offset+limit;

		return (
			<div className="paginator-wrapper row">
				<div className="col counter">
					<span>{offset}</span>
					<span>-{rightHand} </span>
					<span> ({count}) </span>
				</div>
				<ul className="pagination col">
					<li className={prevClass}>
						<a
							className="page-link"
							href="#"
							aria-label="Previous"
							onClick={this.prevPage}
						>
							<i className="fa fa-chevron-left"></i>
						</a>
					</li>
					<li className={nextClass}>
						<a
							className="page-link"
							href="#"
							aria-label="Next"
							onClick={this.nextPage}
						>
							<i className="fa fa-chevron-right"></i>
						</a>
					</li>
				</ul>
			</div>
		);
	}
}
export default Paginator;
