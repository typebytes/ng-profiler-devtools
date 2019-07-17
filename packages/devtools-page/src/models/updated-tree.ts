import { Instance, types } from 'mobx-state-tree';
import { SerializedTreeViewItemModel } from './serialized-tree-view-item';
import { SerializedTreeViewItem } from '@ng-devtools/lib';

export const updatedTreesStore = types
	.model({
		updatedTrees: types.array(SerializedTreeViewItemModel),
	})
	.actions(self => ({
		addUpdatedTree(updatedTree: SerializedTreeViewItem) {
			self.updatedTrees.push(updatedTree);
		},
		clearData() {
			// FIXME: why is the as any needed?
			self.updatedTrees = [] as any;
		}
	}));

export interface UpdatedTreesStore extends Instance<typeof updatedTreesStore> {
}
