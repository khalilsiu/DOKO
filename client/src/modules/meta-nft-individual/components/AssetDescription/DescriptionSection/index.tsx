import { Grid, Link, makeStyles } from '@material-ui/core';
import React from 'react';
import { Attribute } from './Attribute';
import { MetaverseIcon } from './MetaverseIcon';

interface Props {
  mataverseName: string | null;
  contactAddress: string;
  district: string;
  tokenId: string;
  tokenStandard: string | null;
  externalLink: string | null;
}

export const DescriptionSection = React.memo<Props>(
  ({ mataverseName, contactAddress, district, tokenId, tokenStandard, externalLink }) => {
    const classes = useStyles();

    return (
      <Grid container>
        <Attribute title="Metaverse">
          <MetaverseIcon metaverseName={mataverseName} />
          {mataverseName ?? 'N/A'}
          {externalLink && (
            <Link className={classes.link} href={externalLink} target="_blank">
              View on {mataverseName}
            </Link>
          )}
        </Attribute>
        <Attribute title="District">{district}</Attribute>
        <Attribute title="Contact Address">{contactAddress}</Attribute>
        <Attribute title="Token ID">{tokenId}</Attribute>
        <Attribute title="Token Standard">{tokenStandard ?? 'N/A'}</Attribute>
      </Grid>
    );
  },
);

const useStyles = makeStyles((theme) => ({
  link: {
    marginLeft: theme.spacing(1),
    fontStyle: 'italic',
    fontSize: '0.8rem',
    position: 'relative',
    top: '0.1rem',
    color: theme.palette.secondary.main,
  },
}));
