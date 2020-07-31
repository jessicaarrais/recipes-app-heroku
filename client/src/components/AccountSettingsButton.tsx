import React from 'react';
import { Link } from 'react-router-dom';
import Button from './Button';
import Icon from './Icon';

function AccountSettingsButton() {
  return (
    <Link to="/account-settings">
      <Button actionType="default">
        <Icon icon="menu" />
      </Button>
    </Link>
  );
}

export default AccountSettingsButton;
