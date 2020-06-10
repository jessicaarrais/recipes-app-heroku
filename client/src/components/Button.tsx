import React, { ButtonHTMLAttributes, CSSProperties } from 'react';

const base: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '160px',
  height: '32px',
  margin: '16px',
  textTransform: 'uppercase',
  fontWeight: 'bold',
  borderRadius: '2px',
  background: 'none',
  cursor: 'pointer',
};
const styles = {
  default: {
    ...base,
    color: 'gray',
    border: 'solid 1px gray',
  },
  primary: {
    ...base,
    color: 'blue',
    border: 'solid 1px blue',
  },
  danger: {
    ...base,
    color: 'red',
    border: 'solid 1px red',
  },
};

interface Props {
  type?: ButtonHTMLAttributes<HTMLButtonElement>['type'];
  children?: ButtonHTMLAttributes<HTMLButtonElement>['children'];
  styleType: 'primary' | 'danger' | 'default';
  icon?: 'menu' | 'create' | 'add' | 'delete' | 'clear' | 'delete_forever';
  handleOnClick?: ButtonHTMLAttributes<HTMLButtonElement>['onClick'];
}

function Button(props: Props) {
  return (
    <>
      <button
        type={props.type}
        style={styles[props.styleType]}
        onClick={props.handleOnClick}
      >
        <span className="material-icons">{props.icon}</span>
        {props.children}
      </button>
    </>
  );
}

export default Button;
