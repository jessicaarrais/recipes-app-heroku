import React, { useState } from 'react';
import '../assets/css/editable-text-area.css';

interface Props {
  semanticalType: 'h2' | 'p';
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
          className={`editable-input-${props.semanticalType}`}
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
          className={`editable-span-${props.semanticalType}`}
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
