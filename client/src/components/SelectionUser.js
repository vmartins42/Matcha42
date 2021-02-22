import React, { Component } from 'react'

import jwt_decode from 'jwt-decode'

import { UserSortList } from './UserFunctions'

import { withStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Slider from '@material-ui/core/Slider';

import { Link } from "react-router-dom";

import '@shwilliam/react-rubber-slider/dist/styles.css'

import { getPreciseDistance } from 'geolib';

const styles = theme => ({
    container: {
        marginTop: "100px",
    },
    cardGrid: {
        paddingTop: theme.spacing(8),
        paddingBottom: theme.spacing(8),
    },
    card: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
    cardMedia: {
        paddingTop: '56.25%', // 16:9
    },
    cardContent: {
        flexGrow: 1,
    },
    reglages: {
        width: "300px",
    }
});

class SelectionUser extends Component {
    constructor() {
        super()
        this.state = {
            firstName: '',
            lastName: '',
            email: '',
            usersList: [],
            usersSortList: [],
            ageMax2: 0,
            scorePop: [0, 800],
            distanceKm: 30,
            lon: null,
            lat: null,
            noResult: 0,
            valuetext: '',
            value: [20, 50],
            intervalKm: [0, 5000],
            reverseScore: 0,
            reverseAge: 0,
            reverseKm: 0,
            newValue: null,
            distance: 0,
            tags: [],
            errors: {}
        }
        this.onSubmit = this.onSubmit.bind(this)
    }

    componentDidMount() {
        const token = localStorage.usertoken
        const decoded = jwt_decode(token)

        this.setState({
            genre: decoded.genre,
            lookingFor: decoded.lookingFor,
        })

        const user = {
            email: decoded.email,
            orientation: !decoded.orientation ? decoded.lookingFor : decoded.orientation,
            sexe: !decoded.genre ? decoded.sexe : decoded.genre,
            lat: decoded.lat,
            lon: decoded.lon,
            username: decoded.username
        }
        if (decoded.completed === 1) {
            UserSortList(user).then(res => {
                if (res) {
                    const tmp = [];
                    let i = 0;
                    res.forEach(user => {
                        i = 0;
                        if ((user.age >= (decoded.age - 5)) && (user.age <= (decoded.age + 5))) {
                            let distance = getPreciseDistance(
                                { latitude: user.lat, longitude: user.lon },
                                { latitude: decoded.lat, longitude: decoded.lon },
                            )
                            distance = distance / 1000;
                            if (distance <= 50 && distance >= 0) {
                                if ((user.scorePop >= decoded.scorePop - 50) && (user.scorePop <= decoded.scorePop + 50)) {
                                    var interests = JSON.parse(user.interests);
                                    var myInterest = JSON.parse(decoded.interests);
                                    interests.forEach(tag => {
                                        myInterest.forEach(tag1 => {
                                            if (tag === tag1 && i === 0) {
                                                tmp.push(user);
                                                i = 1;
                                            }
                                        })
                                    })
                                }
                            }
                        }
                    });
                    this.setState({
                        usersList: tmp,
                    })
                    if (!this.state.scorePop) {
                        this.setState({
                            scorePop: 0,
                        })
                    }
                }
            })
        }
        this.setState({
            firstName: decoded.firstName ? decoded.firstName : decoded.firstname,
            lastName: decoded.lastName ? decoded.lastName : decoded.lastname,
            email: decoded.email,
            genre: decoded.genre ? decoded.genre : decoded.sexe,
            lat: decoded.lat,
            lon: decoded.lon,
            completed: decoded.completed,
        })
    }

    componentWillUnmount() {
        this.setState({
            firstName: '',
            lastName: '',
            email: '',
            usersList: [],
            usersSortList: [],
            ageMax2: 0,
            scorePop: [0, 800],
            distanceKm: 30,
            lon: null,
            lat: null,
            noResult: 0,
            valuetext: '',
            value: [20, 50],
            intervalKm: [0, 5000],
            reverseScore: 0,
            reverseAge: 0,
            reverseKm: 0,
            newValue: null,
            distance: 0,
            tags: [],
            errors: {}
        })
    }

    //////// MYSQL DATA HANDLER ////////////////////////////////////////////
    onSubmit(e) {
        e.preventDefault()
        this.setState({ usersSortList: [], noResult: 0 });
        const data = {
            ageMax: this.state.ageMax,
            scorePop: this.state.scorePop,
            distanceKm: this.state.distanceKm,
            lon: this.state.lon,
            lat: this.state.lat
        }
        let tmp = [];
        if (this.state.usersList) {
            this.state.usersList.forEach((user) => {
                if ((user.age <= this.state.value[1]) && (user.age >= this.state.value[0])) {
                    if ((user.scorePop <= this.state.scorePop[1]) && (user.scorePop >= this.state.scorePop[0])) {
                        let distance = getPreciseDistance(
                            { latitude: user.lat, longitude: user.lon },
                            { latitude: data.lat, longitude: data.lon },
                        )
                        distance = distance / 1000;
                        if (distance <= this.state.intervalKm[1] && distance >= this.state.intervalKm[0]) {
                            if ((this.state.tags[0] !== "exemple") && (this.state.tags.length !== 0)) {
                                var interests = JSON.parse(user.interests);
                                interests.forEach(tag => {
                                    this.state.tags.forEach(tag1 => {
                                        if (tag === tag1) {
                                            tmp.push(user);
                                        }
                                    })
                                })
                            }
                            else {
                                tmp.push(user);
                            }
                        }
                    }
                }
            })
            if (tmp === []) {
                this.setState({ usersSortList: [] })
            }
            else {
                this.setState({ usersSortList: tmp })
            }
            if (this.state.usersSortList.length === 0) {
                this.setState({ noResult: 1 });
            }
        }
    }
    // AGE FILTRE HANDLER  //////////////////////////////////////////////////
    handleKMSlide = (event, intervalKm) => this.setState({ intervalKm });
    /////////////////////////////////////////////////////////////////////////
    // AGE FILTRE HANDLER  //////////////////////////////////////////////////
    handlePopSlide = (event, scorePop) => this.setState({ scorePop });
    /////////////////////////////////////////////////////////////////////////
    // AGE FILTRE HANDLER  //////////////////////////////////////////////////
    handleAgeSlide = (event, value) => this.setState({ value });
    /////////////////////////////////////////////////////////////////////////
    ageHandler() {
        if (this.state.reverseAge === 0) {
            if (this.state.usersSortList.length === 0) {
                let tmp = this.state.usersList;
                tmp.sort(function compare(a, b) {
                    if (a.age < b.age)
                        return -1;
                    if (a.age > b.age)
                        return 1;
                    return 0;
                });
                this.setState({ usersList: tmp })
            }
            else {
                let tmp = this.state.usersSortList;
                tmp.sort(function compare(a, b) {
                    if (a.age < b.age)
                        return -1;
                    if (a.age > b.age)
                        return 1;
                    return 0;
                });
                this.setState({ usersSortList: tmp })
            }
            this.setState({ reverseAge: 1 })
        }
        else {
            if (this.state.usersSortList.length === 0) {
                let tmp = this.state.usersList.reverse();
                this.setState({ userList: tmp })
            }
            else {
                let tmp = this.state.usersSortList.reverse();
                this.setState({ usersSortList: tmp })
            }
            this.setState({ reverseAge: 0 })
        }
    }

    scorePopHandler() {
        if (this.state.reverseScore === 0) {
            if (this.state.usersSortList.length === 0) {
                let tmp = this.state.usersList;
                tmp.sort(function compare(a, b) {
                    if (a.scorePop < b.scorePop)
                        return -1;
                    if (a.scorePop > b.scorePop)
                        return 1;
                    return 0;
                });
                this.setState({ usersList: tmp })
            }
            else if (this.state.usersSortList) {
                let tmp = this.state.usersSortList;
                tmp.sort(function compare(a, b) {
                    if (a.scorePop < b.scorePop)
                        return -1;
                    if (a.scorePop > b.scorePop)
                        return 1;
                    return 0;
                });
                this.setState({ usersSortList: tmp })
            }
            this.setState({ reverseScore: 1 })
        }
        else {
            if (this.state.usersSortList.length === 0) {
                let tmp = this.state.usersList.reverse();
                this.setState({ userList: tmp })
            }
            else {
                let tmp = this.state.usersSortList.reverse();
                this.setState({ usersSortList: tmp })
            }
            this.setState({ reverseScore: 0 })
        }
    }

    kmHandler() {
        if (this.state.reverseKm === 0) {
            if (this.state.usersSortList.length === 0) {
                let tmp = this.state.usersList;
                tmp.sort(function compare(a, b) {
                    let distance = getPreciseDistance(
                        { latitude: a.lat, longitude: a.lon },
                        { latitude: this.state.lat, longitude: this.state.lon },
                    )
                    distance = distance / 1000;

                    let distance2 = getPreciseDistance(
                        { latitude: b.lat, longitude: b.lon },
                        { latitude: this.state.lat, longitude: this.state.lon },
                    )
                    distance2 = distance2 / 1000;
                    if (distance < distance2)
                        return -1;
                    if (distance > distance2)
                        return 1;
                    return 0;
                }.bind(this));

                this.setState({ usersList: tmp })
            }
            else {
                let tmp = this.state.usersList;
                tmp.sort(function compare(a, b) {
                    let distance = getPreciseDistance(
                        { latitude: a.lat, longitude: a.lon },
                        { latitude: this.state.lat, longitude: this.state.lon },
                    )
                    distance = distance / 1000;

                    let distance2 = getPreciseDistance(
                        { latitude: b.lat, longitude: b.lon },
                        { latitude: this.state.lat, longitude: this.state.lon },
                    )
                    distance2 = distance2 / 1000;
                    if (distance < distance2)
                        return -1;
                    if (distance > distance2)
                        return 1;
                    return 0;
                }.bind(this));

                this.setState({ usersList: tmp })
            }
            this.setState({ reverseKm: 1 })
        }
        else {
            if (this.state.usersSortList.length === 0) {
                let tmp = this.state.usersList.reverse();
                this.setState({ userList: tmp })
            }
            else {
                let tmp = this.state.usersSortList.reverse();
                this.setState({ usersSortList: tmp })
            }
            this.setState({ reverseKm: 0 })
        }
    }

    ////////// TAG HANDLER ////////////////////////////////////////////////////////
    TagsInput = props => {
        let tmp = [];
        if (props.tags !== null) {
            let tmp2 = [];
            const [tags, setTags] = React.useState(props.tags);
            const removeTags = indexToRemove => {
                setTags([...tags.filter((_, index) => index !== indexToRemove)]);
                tmp = this.state.tags;
                tmp2 = tmp.filter((_, index) => index !== indexToRemove)
                this.setState({ tags: tmp2 });
            };

            const addTags = event => {
                if (event.target.value !== "") {
                    setTags([...tags, event.target.value]);
                    props.selectedTags([...tags, event.target.value]);
                    tmp = this.state.tags;
                    tmp.push(event.target.value)
                    this.setState({ tags: tmp})
                    event.target.value = "";
                }
            };
            return (
                <div className="tags-input">
                    <ul id="tags">
                        {tags.map((tag, index) => (
                            <li key={index} className="tag">
                                <span className='tag-title'>{tag}</span>
                                <span className='tag-close-icon'
                                    onClick={() => removeTags(index)}
                                >
                                    x
                </span>
                            </li>
                        ))}
                    </ul>
                    <input
                        type="text"
                        onKeyUp={event => event.key === "Enter" ? addTags(event) : null}
                        placeholder="Press enter to add tags"
                    />
                </div>
            );
        }
        else {
            return (<div></div>)
        }

    };
    // TAGS HANDLER END ///////////////////////////////////////////////////

    render() {
        const selectedTags = tags => {
        };

        let $displayTag = (<Grid item xs={12} sm={8}>
            <this.TagsInput selectedTags={selectedTags} tags={["exemple"]} />
        </Grid>);
        const { classes } = this.props
        let $userList = null;
        let distance = 0;
        if (this.state.usersList && this.state.usersSortList.length === 0 && this.state.noResult === 0) {
            $userList = (<Grid container spacing={4}>
                {this.state.usersList.map((user) =>
                    (
                        <Grid item key={user.email} xs={12} sm={6} md={4}>
                            <Card className={classes.card}>
                                {
                                    user.pic1 ?
                                        <CardMedia
                                            className={classes.cardMedia}
                                            image={user.pic1 ? user.pic1 : ""}
                                            title="Image title"
                                            prop={user}
                                        />
                                        : null
                                }
                                <CardContent className={classes.cardContent}>
                                    <Typography gutterBottom variant="h5" component="h2">
                                        {user.firstname} {user.lastname}
                                    </Typography>
                                    <Typography>
                                        {user.age} ans
                                </Typography>
                                    {user.adressUser} ({distance === 0 ? ((getPreciseDistance(
                                        { latitude: user.lat, longitude: user.lon },
                                        { latitude: this.state.lat, longitude: this.state.lon },
                                    )) / 1000) : 0} Km)
                            </CardContent>
                                <CardActions >
                                    <Link
                                        to={{
                                            pathname: `/Profile/${user.firstname}`,
                                            aboutProps: {
                                                user: user
                                            }
                                        }}> Visiter
                                </Link>
                                    <Typography>
                                        score pop : {user.scorePop ? user.scorePop : 0}
                                    </Typography>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
            </Grid>);
        }
        else if (this.state.usersSortList.length > 0) {
            $userList = (<Grid container spacing={4}>
                {this.state.usersSortList.map((user) => (
                    <Grid item key={user.email} xs={12} sm={6} md={4}>
                        <Card className={classes.card}>
                            {
                                user.pic1 ?
                                    <CardMedia
                                        className={classes.cardMedia}
                                        image={user.pic1 ? user.pic1 : ""}
                                        title="Image title"
                                        prop={user}
                                    />
                                    : null
                            }
                            <CardContent className={classes.cardContent}>
                                <Typography gutterBottom variant="h5" component="h2">
                                    {user.firstname} {user.lastname}
                                </Typography>
                                <Typography>
                                    {user.age} ans
                            </Typography>
                                {user.adressUser}
                            </CardContent>
                            <CardActions >
                                <Link
                                    to={{
                                        pathname: `/Profile/${user.firstname}`,
                                        aboutProps: {
                                            user: user
                                        }
                                    }}> Visiter
                            </Link>
                                <Typography>
                                    score pop : {user.scorePop ? user.scorePop : 0}
                                </Typography>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>);
        }
        else {
            $userList = (<div>No users found</div>)
        }
        return (
            <div className={classes.container}>
                <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
                    Selectionnés pour vous !
                </Typography>
                <Container className={classes.cardGrid} maxWidth="md">
                    <Grid container spacing={4}>
                        <Grid item xs={12} sm={6} md={4}>
                            <div className={classes.root}>
                                <Typography id="range-slider" gutterBottom>
                                    tranche d'age
                                </Typography>
                                <Slider
                                    min={18}
                                    max={90}
                                    value={this.state.value}
                                    onChange={this.handleAgeSlide}
                                    valueLabelDisplay="auto"
                                    aria-labelledby="range-slider"
                                />
                            </div>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <div className={classes.root}>
                                <Typography id="range-slider" gutterBottom>
                                Distance (km) max
                                </Typography>
                                <Slider
                                    min={0}
                                    max={9000}
                                    value={this.state.intervalKm}
                                    onChange={this.handleKMSlide}
                                    valueLabelDisplay="auto"
                                    aria-labelledby="range-slider"
                                />
                            </div>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <div className={classes.root}>
                                <Typography id="range-slider" gutterBottom>
                                    Score popularite
                                </Typography>
                                <Slider
                                    min={0}
                                    max={1000}
                                    value={this.state.scorePop}
                                    onChange={this.handlePopSlide}
                                    valueLabelDisplay="auto"
                                    aria-labelledby="range-slider"
                                />
                            </div>
                        </Grid>
                        {$displayTag}
                        <form noValidate onSubmit={this.onSubmit}>
                            <Grid item xs={12} sm={4}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="secondary"
                                    className={classes.save}>Recherche
                            </Button>
                            </Grid>
                        </form>
                    </Grid>
                    <Grid container spacing={4}>
                        <Grid item xs={12} sm={4}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="secondary"
                                className={classes.save}
                                onClick={() => this.ageHandler()}
                            >trier par age
                            </Button>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="secondary"
                                className={classes.save}
                                onClick={() => this.kmHandler()}
                            >trier par km
                            </Button>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="secondary"
                                className={classes.save}
                                onClick={() => this.scorePopHandler()}
                            >trier par score Pop
                            </Button>
                        </Grid>
                    </Grid>
                    {this.state.completed === 1 ? $userList : "Veuillez completer votre profil"}
                </Container>
            </div>
        )
    }
}

export default withStyles(styles, { withTheme: true })(SelectionUser)