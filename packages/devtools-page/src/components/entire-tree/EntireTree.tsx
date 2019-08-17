import React from 'react';
import './EntireTree.css';
import { GraphRender, renderTree } from '@ng-devtools/lib';
import { EntireTreeStore } from '../../models/entire-tree';
import { observer } from 'mobx-react';
import { updatedTreesStore } from '../../models/updated-tree';

interface EntireTreeProps {
	store: EntireTreeStore;
}


@observer
export class EntireTree extends React.Component<EntireTreeProps> {
	treeGraph: GraphRender;

	constructor(props: EntireTreeProps) {
		super(props)
		this.treeGraph = new GraphRender('liveTree');
	}

	render() {
		// console.log('render triggered');
		const {entireTree, instructions} = this.props.store;
		setTimeout(() => {
			// console.log('triggered');
			this.treeGraph.setUpdates(entireTree, instructions);
		});
		const test = this.props.store.test;
		return (
			<div className="entireTree">
				<div className="chart-container">
					<div className="chart">
						<svg id="liveTree" width="100%" height="400px">
							<g/>
						</svg>
					</div>
				</div>
			</div>
		);
	}
}

// {/*<p>The entire component tree visualised. If a component is checked during a CD cycle, the component will light up. If this*/}
// {/*happens again within a 250ms timeframe, the color will light up in a different color based on the legend.*/}
// {/*<br/>*/}
// {/*The graph can be zoomed and panned.*/}
// {/*</p>*/}
// {/*<div className="legend">*/}
// {/*<div className="legend-item">*/}
// {/*<div className="legend-box first"></div>*/}
// {/*<span>Color level 1</span>*/}
// {/*</div>*/}
// {/*<div className="legend-item">*/}
// {/*<div className="legend-box second"></div>*/}
// {/*<span>Color level 2</span>*/}
// {/*</div>*/}
// {/*<div className="legend-item">*/}
// {/*<div className="legend-box third"></div>*/}
// {/*<span>Color level 3</span>*/}
// {/*</div>*/}
// {/*<div className="legend-item">*/}
// {/*<div className="legend-box fourth"></div>*/}
// {/*<span>Color level 4</span>*/}
// {/*</div>*/}
// {/*<div className="legend-item">*/}
// {/*<div className="legend-box fifth"></div>*/}
// {/*<span>Color level 5</span>*/}
// {/*</div>*/}
// {/*<div className="legend-item">*/}
// {/*<div className="legend-box sixth"></div>*/}
// {/*<span>Color level 6</span>*/}
// {/*</div>*/}
// {/*<div className="legend-item">*/}
// {/*<div className="legend-box seventh"></div>*/}
// {/*<span>Color level 7</span>*/}
// {/*</div>*/}
// {/*</div>*/}
