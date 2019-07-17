import React from 'react';
import { FaRecycle, FaTree } from 'react-icons/fa';

import './Sidebar.css';

interface SidebarProps {
	onMenuItemSelected: (menuItem: string) => any;
}

export class Sidebar extends React.Component<SidebarProps> {
	constructor(props: SidebarProps) {
		super(props);
		this.onMenuItemClick = this.onMenuItemClick.bind(this);
	}

	onMenuItemClick = (menuItem: string) => (e: any) => {
		this.props.onMenuItemSelected(menuItem);
	};

	render() {
		return (
			<div className="sidebar">
				<ol>
					<li className="header">
						<span>Profiling</span>
						<ol>
							<li onClick={this.onMenuItemClick('entireTree')}>
								<FaTree className="logo"></FaTree>
								<span>Entire Tree</span>
							</li>
							<li onClick={this.onMenuItemClick('treePerCycle')}>
								<FaRecycle className="logo"></FaRecycle>
								<span>Tree per cycle</span>
							</li>
						</ol>
					</li>
				</ol>
			</div>
		);
	}
}
