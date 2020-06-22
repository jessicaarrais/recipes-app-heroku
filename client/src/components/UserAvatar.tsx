import React from 'react';

function UserAvatar() {
  return (
    <div>
      <label htmlFor="avatar">choose image: </label>
      <input id="avatar" type="file" accept="image/png, image/jpg, image/jpeg" />
    </div>
  );
}

export default UserAvatar;
