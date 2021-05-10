import React, { useState, useEffect } from 'react'
import { observer, inject } from 'mobx-react'
import Login from './Login'
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { FormLabel } from '@material-ui/core';
import { FormControl } from '@material-ui/core';
import { FormGroup } from '@material-ui/core';
import { FormControlLabel } from '@material-ui/core';
import { FormHelperText } from '@material-ui/core';
import { Checkbox } from '@material-ui/core';
import { createMuiTheme, ThemeProvider } from '@material-ui/core';
import AudioPlayer from 'material-ui-audio-player';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';

const muiTheme = createMuiTheme({});

const useStyles = makeStyles((theme) => ({
	root: {
		display: 'flex',
		padding: '8px',
	},
	formControl: {
		margin: theme.spacing(13),
	},
}));

const useStylesPlayer = makeStyles((theme) => ({
	root: {
		display: 'flex',
		margin: '7px',
		borderRadius: '10px',
	},
	details: {
		display: 'flex',
		// flexDirection: 'column',
	},
	content: {
		justifyContent: 'space-between',
		flexDirection: 'column',
		display: 'flex',
		flex: '1 0 auto',
	},
	cover: {
		width: 200,
		height: 200,
	},
	controls: {
		display: 'flex',
		alignItems: 'center',
		paddingLeft: theme.spacing(1),
		paddingBottom: theme.spacing(1),
	},
	playIcon: {
		height: 38,
		width: 38,
	},
}));

const useStylesA = makeStyles({
	login: {
		// display: 'grid',
		// placeItems: 'center',
		// height: '100vh',

		// '& a:img':{
		//     width: '20%'
		// },

		'& a': {
			padding: '20px',
			borderRadius: '99px',
			backgroundColor: '#1db978',
			fontWeight: 600,
			// backgroundColor: 'black',
			color: 'white',
			textDecoration: 'none',
		},

		'& a:hover': {
			backgroundColor: ' white',
			borderColor: '#1db954',
			color: '#1db954',
		}
	},
});


const Home = inject("home")(observer((props) => {
	const error = props.home.artists.filter((v) => v.preferred).length > 5;
	const classes = useStyles();
	const classesPlayer = useStylesPlayer();
	const classesA = useStylesA()

	useEffect(() => {
		(async () => {
			props.home.getToken()
		})()
	}, [])


	return (
		<div className="home">
			{props.home.recommendedTracks.length > 0 ? <Login /> 
				: window.location.pathname === '/' ? <input placeholder="Enter track title" onKeyPress={props.home.searchTrack}></input> 
				: null
			}
			<div className="tmp">
				{props.home.inputTracks.length > 0 ? props.home.inputTracks.map((t, i) => {
					return (
						<div key={i} onClick={() => props.home.addTrack(t)}>
							<h3>{t.name}</h3>
							<img className="trackImg" src={t.img} alt="" />
							<div> by {t.artists[0].name}</div>
							<br />
						</div>
					)
				}) : null}
			</div>
			{/* <br />
			<br /> */}
			{props.home.tracks.length > 0 ?
				<div>
					<h2>Selected Tracks</h2>
					<div className="tracks">
						{props.home.tracks.map((t, i) => {
							return (
								<div className="track" key={i} >
									<IconButton className="removeIcon" onClick={() => props.home.removeTrack(t)}>
										<HighlightOffIcon />
									</IconButton>
									<h3 className="title">{t.name}</h3>
									<br />
									<img className="trackImg" height="150px" src={t.img} alt="" />
									<div> by {t.artists[0].name}</div>
									< br />
								</div>
							)
						})}
					</div>
				</div> : null}

			{props.home.trigger ?
				<div className="idk">
					<FormControl required error={error} component="fieldset" className={classes.formControl}>
						<FormLabel component="legend">Preferred Artists</FormLabel>
						<FormGroup>
							{[...props.home.artists].map((a, i) => {
								return (
									<FormControlLabel
										control={<Checkbox checked={a.preferred} onChange={props.home.choosePreferredArtists} name={a.name} />}
										label={a.name} key={i}
									/>
								)
							})}
						</FormGroup>
						<FormHelperText>Pick Five Max</FormHelperText>
					</FormControl>
				</div>
				: null}

			{props.home.tracks.length > 0 ?
				<div>
					<label htmlFor="playlistSize">Playlist Size </label>
					<select id="playlistSize" onChange={e => props.home.setPlaylistSize(e.target.value)}>
						<option value="10"> S</option>
						<option value="25"> M</option>
						<option value="50"> L</option>
						<option value="100"> XL</option>
					</select>
				</div>
				: null}
			{props.home.tracks.length > 0 ? <button onClick={() => props.home.searchSimilarTracks()}>Search similar tracks</button> : null}

			{props.home.recommendedTracks.length > 0 ?
				<div>
					<div className="recommendedTracks">
						{props.home.recommendedTracks.map((t, i) => {
							return (
								<div key={i}>
									<Card className={classesPlayer.root} >
										<CardMedia
											className={classesPlayer.cover}
											image={t.img}>
											<IconButton className="iconBtn" onClick={() => props.home.removeRecommendedTrack(t)}>
												<DeleteForeverIcon className="icn" style={{ color: "white" }} />
											</IconButton>
										</CardMedia>

										<div className={classesPlayer.details}>
											<CardContent className={classesPlayer.content}>

												{t.preview_url ?
													<ThemeProvider theme={muiTheme}>
														<AudioPlayer src={t.preview_url}
															elevation={0}
															variation="primary"
															width="300px"
															// height="50px"
															order="reverse"
															spacing={2} />
													</ThemeProvider> : <Typography variant="overline" color="textSecondary">audio is unavailable</Typography>}
												<Typography className="songTitle" component="h6" variant="h6">{t.name}</Typography>
												<Typography variant="subtitle1" color="textSecondary">{t.artists[0].name} </Typography>

											</CardContent>
										</div>
									</Card>
								</div>
							)
						})}
					</div>
				</div>
				: null}
		</div>
	)
}))

export default Home;
