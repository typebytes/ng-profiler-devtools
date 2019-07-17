import React from 'react';
import { TreePerCycle } from '../tree-per-cycle/TreePerCycle';
import './AppContent.css';
import { UpdatedTreesStore } from '../../models/updated-tree';
import { EntireTreeStore } from '../../models/entire-tree';
import { EntireTree } from '../entire-tree/EntireTree';
import { observer } from 'mobx-react';

interface AppContentProps {
	menuItem: string;
	stores: { updatedTreesStore: UpdatedTreesStore, entireTreeStore: EntireTreeStore };
}


export const AppContent: React.FC<AppContentProps> = observer((props) => {
	// very first render, ask them to trigger a cd cycle
	if (!props.stores.entireTreeStore.entireTree) {
		return <div>Please trigger a CD cycle :)</div>;
	}
	let appContent;
	if (props.menuItem === 'entireTree') {
		appContent = <EntireTree store={props.stores.entireTreeStore}/>;
	}
	if (props.menuItem === 'treePerCycle') {
		appContent = <TreePerCycle store={props.stores.updatedTreesStore}/>;
	}
	return (
		<div className="appContent">
			{appContent}
		</div>
	);
});
