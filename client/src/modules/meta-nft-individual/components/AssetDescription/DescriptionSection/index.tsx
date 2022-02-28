import { Grid, makeStyles } from '@material-ui/core';
import React from 'react';
import { Attribute } from './Attribute';
import { ExternalLink } from './ExternalLink';
import { MetaverseIcon } from './MetaverseIcon';

interface Props {
  mataverseName: string | null;
  contactAddress: string;
  tokenId: string;
  tokenStandard: string | null;
  externalLink: string | null;
}

export const DescriptionSection = React.memo<Props>(
  ({ mataverseName, contactAddress, tokenId, tokenStandard, externalLink }) => {
    const classes = useStyles();

    return (
      <Grid className={classes.root} container spacing={2}>
        <Attribute title="Metaverse">
          <MetaverseIcon metaverseName={mataverseName} />
          {mataverseName ?? 'N/A'}
          {externalLink && mataverseName && (
            <ExternalLink mataverseName={mataverseName} url={externalLink} />
          )}
        </Attribute>
        <Attribute title="Contact Address">{contactAddress}</Attribute>
        <Attribute title="Token ID">{tokenId}</Attribute>
        <Attribute title="Token Standard">{tokenStandard ?? 'N/A'}</Attribute>
      </Grid>
    );
  },
);

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: theme.spacing(2),
  },
  link: {
    marginLeft: theme.spacing(1),
    fontStyle: 'italic',
    fontSize: '0.8rem',
    position: 'relative',
    top: '0.1rem',
    color: theme.palette.secondary.main,
  },
}));
