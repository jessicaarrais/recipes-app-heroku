import React from 'react';

interface Props {
  icon:
    | 'menu'
    | 'create'
    | 'add'
    | 'delete'
    | 'clear'
    | 'delete_forever'
    | 'filter_list'
    | 'sort'
    | 'search'
    | 'favorite_border'
    | 'keyboard_arrow_up';
}

function Icon(props: Props) {
  return <span className="material-icons">{props.icon}</span>;
}

export default Icon;
