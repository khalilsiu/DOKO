import { makeStyles, Grid, LinearProgress, Typography } from '@material-ui/core';

interface NFtRarityProps {
  traits: any;
  totalSupply: any;
}

const useStyles = makeStyles({
  root: {
    height: 10,
    borderRadius: 5,
    width: '100%',
    backgroundColor: '#333333',
  },
  bar: {
    borderRadius: 5,
    background:
      'linear-gradient( -45deg, #ff06d7 0%, #ff06d7 30%, rgba(80, 92, 176, 1) 50%, #00ffef 80%, #00ffef 100%)',
  },
});

export const Rarity = ({ traits, totalSupply }: NFtRarityProps) => {
  const styles = useStyles();
  const ntraits = traits.length;

  let traitRaritySum = 0;
  let rarityRank = 0;
  let progress = 0;
  const hasTraitsCount = ntraits > 0 && totalSupply > 0;
  if (hasTraitsCount) {
    traits.map((trait: any) => {
      traitRaritySum += trait.trait_count;
      return traitRaritySum;
    });
    rarityRank = Math.floor(traitRaritySum / ntraits);
    progress = Math.round(100 - (rarityRank / totalSupply) * 100);
  }
  return (
    <Grid container direction="column" spacing={2}>
      <Grid item>
        <Typography variant="h5" style={{ fontWeight: 'bolder' }}>
          Rarity
        </Typography>
      </Grid>
      <Grid item>
        {hasTraitsCount ? (
          <div>
            <LinearProgress classes={{ root: styles.root, bar: styles.bar }} variant="determinate" value={progress} />
            <Typography variant="body1" style={{ marginTop: '7px' }}>
              This NFT is ranked <i>{rarityRank || 'N/A'}</i> out of <i>{totalSupply}</i> within this collection
            </Typography>
          </div>
        ) : (
          <Typography variant="body1">N/A</Typography>
        )}
      </Grid>
    </Grid>
  );
};

export default Rarity;
