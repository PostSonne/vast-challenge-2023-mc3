import React from 'react';
import {Node, Link} from "../types/types";

interface ListProps {
    nodes: Node[];
    onNodeClick: (item: Node) => void;
}

const List: React.FC<ListProps> = ({ nodes, onNodeClick }) => {
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
