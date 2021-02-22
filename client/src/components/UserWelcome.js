import React, { Component } from 'react'

import { UserLiked } from './UserFunctions'

import jwt_decode from 'jwt-decode'

import { withStyles } from "@material-ui/core/styles"
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { Link } from "react-router-dom";

const styles = theme => ({
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
});

class UserWelcome extends Component {

  constructor() {
    super()
    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      pic1: '',
      errors: {}
    }
    this.onChange = this.onChange.bind(this)
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value })
  }

  componentDidMount() {
    if (localStorage.usertoken) {
      const token = localStorage.usertoken
      const decoded = jwt_decode(token)

      const user = {
        username: decoded.username,
        first_name: this.state.firstName,
      }
      /********* UserLike handler ******************************* */
        UserLiked(user).then(res => {
          if (res.length > 0) {
            this.setState({
              likes: res,
            })
          }
        })
      this.setState({
        firstName: decoded.firstName,
        lastName: decoded.lastName,
        email: decoded.email,
        username: decoded.username,
        age: decoded.age,
        scorePop: decoded.scorePop,
        pic1: decoded.pic1,
      })
      /*************** END LIKED HANDLER ***************************/
    }
  }

  componentWillUnmount() {
    this.setState({
      firstName: '',
      lastName: '',
      email: '',
      pic1: '',
      errors: {}
  })
  }

  render() {

    const { classes } = this.props

    let $likedList = null;

    if (this.state.likes) {
      $likedList = (<Container className={classes.cardGrid} maxWidth="md">
        {/* End hero unit */}
        <Typography component="h1" variant="h4" color="textPrimary" gutterBottom>
          Ils vous Like :
        </Typography>
        <Grid container spacing={4}>
          {this.state.likes.map((card) => (
            <Grid item key={card.email} xs={12} sm={6} md={4}>
              <Card className={classes.card}>
                <CardMedia
                  className={classes.cardMedia}
                  image={card.pic1}
                  title="Image title"
                />
                <CardContent className={classes.cardContent}>
                  <Typography gutterBottom variant="h5" component="h2">
                    {card.username}
                  </Typography>
                  <Typography>
                    {card.age} ans
              </Typography>
                  <Typography>
                    {card.adressUser}
                  </Typography>
                </CardContent>
                <CardActions >
                  <Link
                    to={{
                      pathname: `/Profile/${card.username}`,
                      aboutProps: {
                        user: card
                      }
                    }}><Button variant="contained" color="secondary"> Visiter</Button>
                  </Link>
                  <Typography>
                    Score pop : {card.scorePop}
                  </Typography>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>)
    }
    return (
      <Grid container spacing={3}>
        <Grid item xs={12}>
          {$likedList}
        </Grid>
      </Grid>
    )
  }
}

export default withStyles(styles, { withTheme: true })(UserWelcome)