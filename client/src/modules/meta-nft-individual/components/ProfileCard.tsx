import React from 'react';
import Intro from 'modules/core/Intro';
import { Card } from '@material-ui/core';

export const ProfileCard = React.memo(() => {
  return (
    <Card>
      <Intro drawer={false} />
    </Card>
  );
});
