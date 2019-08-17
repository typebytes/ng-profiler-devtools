import React from 'react';
import './App.css';
// import { NG_DEVTOOLS_INIT } from '@ng-devtools/plugin/src/constants';
import { SerializedTreeViewItem } from '@ng-devtools/lib';
import { entireTree } from './mock-data';
import { Sidebar } from './components/sidebar/Sidebar';
import { AppContent } from './components/app-content/AppContent';
import { UpdatedTreesStore } from './models/updated-tree';
import { EntireTreeStore } from './models/entire-tree';
// import { NG_DEVTOOLS_INIT } from '@ng-devtools/plugin';

// FIXME should come from the plugin package
const NG_DEVTOOLS_INIT = 'NG_DEVTOOLS_INIT';
declare const chrome: any;

export interface AppProps {
	updatedTreeStore: UpdatedTreesStore;
	entireTreeStore: EntireTreeStore;
}

export interface AppState {
	menuItem: string;
	lastEntireTree?: SerializedTreeViewItem;
	instructions?: Object;
}

class App extends React.Component<AppProps, AppState> {
	// magic variable needed until https://stackoverflow.com/questions/57231566/mobx-state-tree-doesnt-rerender-on-a-new-map-reference
	count = 0;

	constructor(props: AppProps) {
		super(props);
		this.state = {menuItem: 'entireTree'};
		this.menuItemSelected = this.menuItemSelected.bind(this);
	}

	componentWillMount(): void {
		this.setupConnection();
	}

	menuItemSelected(menuItem: string) {
		this.setState({menuItem: menuItem});
	}

	setupConnection() {
		const backgroundPageConnection = chrome.runtime.connect();
		backgroundPageConnection.onMessage.addListener(((message: { type: string, payload: any }) => {
			// console.log('received a message from background', message);
			switch (message.type) {
				case 'ENTIRE_TREE': {
					// console.log('received entire tree');
					this.count++;
					this.props.entireTreeStore.setTreeUpdate(message.payload.entireTree, message.payload.instructions, '' + this.count);
					break;
				}
				case 'UPDATED_TREE': {
					this.props.updatedTreeStore.addUpdatedTree(message.payload.updatedTree);
					break;
				}
				case 'RESET_DATA': {
					this.props.updatedTreeStore.clearData();
					this.props.entireTreeStore.clearData();
				}
			}
		}));

		// console.log('Sending to INIT to the background');
		backgroundPageConnection.postMessage({
			type: NG_DEVTOOLS_INIT,
			tabId: chrome.devtools.inspectedWindow.tabId
		});

	}

	render() {
		const stores = {updatedTreesStore: this.props.updatedTreeStore, entireTreeStore: this.props.entireTreeStore};

		return <div className="App">
			<Sidebar onMenuItemSelected={this.menuItemSelected}></Sidebar>
			<AppContent menuItem={this.state.menuItem} stores={stores}></AppContent>
		</div>;
	}
}


export default App;


// // this.setState({lastEntireTree: entireTree, instructions});
// this.props.entireTreeStore.setTreeUpdate(entireTree, instructions, 'first');
// this.props.updatedTreeStore.addUpdatedTree(updatedTree);
// setTimeout(() => {
// 	// console.log('changed');
// 	this.props.updatedTreeStore.addUpdatedTree(updatedTree2);
// 	this.props.entireTreeStore.setTreeUpdate(entireTree2, instructions2, 'second');
// }, 4000);
// // renderTree('updatedTree', updatedTree);


