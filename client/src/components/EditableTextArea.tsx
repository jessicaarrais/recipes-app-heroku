import React, { useState } from 'react';
import '../assets/css/sheet.css';
import '../assets/css/todo.css';

interface Props {
  styleTypeInput: 'sheet-title-input' | 'todo-text-input' | 'user-username-input';
  styleTypeSpan: 'sheet-title' | 'todo-text' | 'user-username';
  children: string;
  onSubmit(text: string): void;
}

function EditableTextArea(props: Props) {
  const [text, setNewText] = useState(props.children);
  const [isEditing, setIsEditing] = useState(false);

  const update = (text: string): void => {
    setIsEditing(false);
    if (text !== props.children) {
      props.onSubmit(text);
    }
  };

  return (
    <>
      {isEditing ? (
        <input
          className={props.styleTypeInput}
          ref={(ref) => {
            ref && ref.focus();
          }}
          type="text"
          value={text}
          onChange={(e) => setNewText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') update(text);
          }}
          onBlur={() => update(text)}
        />
      ) : (
        <span
          className={props.styleTypeSpan}
          tabIndex={0}
          onClick={() => {
            setIsEditing(true);
            setNewText(props.children);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              setIsEditing(true);
              setNewText(props.children);
            }
          }}
        >
          {props.children}
        </span>
      )}
    </>
  );
}

export default EditableTextArea;
