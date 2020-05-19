import React from 'react';

interface ButtonType {
  children?: string;
  handleOnClick: (param?: any) => void;
}

function Button(props: ButtonType) {
  return <button onClick={props.handleOnClick}>{props.children}</button>;
}

export default Button;
