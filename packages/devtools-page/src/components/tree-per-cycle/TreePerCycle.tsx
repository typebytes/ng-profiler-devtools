import React from 'react';
import './TreePerCycle.css';
import { renderTree } from '@ng-devtools/lib';
import { UpdatedTreesStore } from '../../models/updated-tree';
import { observer } from 'mobx-react';
import List from '@material-ui/core/List/List';
import ListItem from '@material-ui/core/ListItem/ListItem';
import ListItemText from '@material-ui/core/ListItemText/ListItemText';

export interface TreePerCycleProps {
	store: UpdatedTreesStore;
}

export interface TreePerCycleState {
	selectedCycle: number;
}


@observer
export class TreePerCycle extends React.Component<TreePerCycleProps, TreePerCycleState> {
	constructor(props: TreePerCycleProps) {
		super(props);
		this.state = {selectedCycle: 0};
	}

	// treeSelected = (index: number) => (e: any) => {
	// 	console.log('e', e, index);
	// 	this.setState({selectedCycle: index});
	// };

	render() {
		return <div>Coming soon...</div>;
		// const {updatedTrees} = this.props.store;
		// // on first render the svg is not yet added to the page
		// setTimeout(() => {
		// 	if (updatedTrees && updatedTrees.length > 0) {
		// 		renderTree('updatedTree', updatedTrees[this.state.selectedCycle]);
		// 	}
		// });
		//
		// const listItems = updatedTrees.map((tree, index) => {
		// 	return <ListItem button key={index} onClick={this.treeSelected(index)}>
		// 		<ListItemText primary={'Cycle number' + index}/>
		// 	</ListItem>;
		// });
		// return (
		// 	<div className="container">
		// 		<List component="nav" aria-label="secondary mailbox folders">
		// 			{listItems}
		// 		</List>
		// 		<svg id="updatedTree" width="100%" height="400px">
		// 			<g/>
		// 		</svg>
		// 	</div>
		// );
	}
}
