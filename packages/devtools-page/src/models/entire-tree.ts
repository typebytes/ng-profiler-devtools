import { Instance, types } from 'mobx-state-tree';
import { SerializedTreeViewItem, SerializedTreeViewItemModel } from './serialized-tree-view-item';

export const entireTreeStore = types
	.model({
		entireTree: types.maybe(SerializedTreeViewItemModel),
		instructions: types.map(SerializedTreeViewItemModel),
		test: ''
	})
	.actions(self => ({
		// TODO fix type
		setTreeUpdate(entireTree: SerializedTreeViewItem, instructions: any, test: string) {
			self.instructions = instructions;
			self.entireTree = entireTree;
			self.test = test;
		},
		clearData() {
			// FIXME: why is the as any needed?
			self.instructions = new Map() as any;
			self.entireTree = undefined;
			self.test = '';
		}
	}));

export interface EntireTreeStore extends Instance<typeof entireTreeStore> {
}
