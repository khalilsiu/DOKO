import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import React, { useEffect, useState } from 'react';

import {
  Card,
  Grid,
  makeStyles,
  Typography
} from '@material-ui/core';

interface NFtTraitsProps {
	traits: any,
	totalSupply: any
}

export const GradientSVG = () => {

	let color0 = '#ff06d7';
	let color30 = '#ff06d7';
	let color50 = '#505cb0';
	let color80 = '#00ffef';
	let color100 = '#00ffef';
	let gradientTransform = `rotate(-45)`;
	let idCSS = 'lingrad';

    return (
      <svg style={{ height: 0, width:0 }}>
        <defs>
          <linearGradient id={idCSS} gradientTransform={gradientTransform}>
            <stop offset="0%" stopColor={color0} />
            <stop offset="30%" stopColor={color30} />
            <stop offset="50%" stopColor={color50} />
            <stop offset="80%" stopColor={color80} />
            <stop offset="100%" stopColor={color100} />
          </linearGradient>
        </defs>
      </svg>
    );
  }

export const NftTraits = ({traits, totalSupply}: NFtTraitsProps) => {

	const styles = useStyles();

	return (

		<Grid container justifyContent="flex-start" spacing={3} className="traits">
		   <GradientSVG/>
		  {
		  	traits.map((trait: any, i:number) => {
		  		let traitPercentage = Math.round((trait.trait_count / 7000) * 100);
		  		return (
		  			<Grid item container lg={2} xl={2} md={4} sm={3} xs={3}>
		  			   <Card className={styles.traitCard}>
		  			      <div style={{marginBottom: '1em'}}>
		  			        <Typography variant="body1" style={{fontWeight: 'bolder'}}>
		  			           {trait.trait_type}
		  			        </Typography>
		  			      </div>
		  			      <CircularProgressbar 
		  			          value={traitPercentage}
		  			          text = {`${traitPercentage}%`}
		  			          styles = {{
		  			          	path: {
		  			          		stroke: 'url(#lingrad)'
		  			          	},
		  			          	trail: {
		  			          		stroke: '#333333'
		  			          	},
		  			          	text: {
		  			          		fill: 'white',
		  			          		fontSize: '16px'
		  			          	}

		  			          }}
		  			       >
		  			      </CircularProgressbar>
		  			      <div style={{textAlign: 'center', marginTop: '1em'}}>
		  			        <Typography variant="body1" style={{fontWeight: 'bolder'}}>
		  			          { trait.value }
		  			        </Typography>
		  			        <Typography variant="body1" style={{fontStyle: 'italic'}}>
		  			          {traitPercentage} % have this trait
		  			        </Typography>
		  			      </div>
		  			   </Card>
		  			</Grid>
		  	    )
		  	})
		  }
		</Grid>
		)
}

const useStyles = makeStyles(theme => ({
	traits: {
	},
	traitCard: {
		padding: '1.5em',
		background: 'inherit',
		display: 'flex',
		minHeight: '250px',
		width: '100%',
		flexDirection: 'column',
		borderRadius: '20px',
		border: '1px solid white',
		alignItems: 'center'
	}
}))