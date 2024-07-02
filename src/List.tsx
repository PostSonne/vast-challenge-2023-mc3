import React from 'react';
import {Node, Link} from "./types";

interface ListProps {
    nodes: Node[];
    links: Link[];
    onNodeClick: (item: Node) => void;
}

const List: React.FC<ListProps> = ({ nodes, links, onNodeClick }) => {
    return (
        <ul>
            {nodes.map(node => {
                return (
                    <li onClick={() => onNodeClick(node)}>
                        {node.id}
                    </li>
                )
                }
            )}
        </ul>
    );
};

export default List;
