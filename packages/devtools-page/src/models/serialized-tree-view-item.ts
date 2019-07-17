import { Instance, types } from 'mobx-state-tree';

// @ts-ignore
export const SerializedTreeViewItemModel = types
	.model({
		uuid: types.string,
		children: types.array(types.late(() => SerializedTreeViewItemModel)),
		onPush: types.boolean,
		tagName: types.string,
	});

export interface SerializedTreeViewItem extends Instance<typeof SerializedTreeViewItemModel> {
}
