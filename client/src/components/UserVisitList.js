import React, { Component } from 'react'

import { UserVisit } from './UserFunctions'

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
  container: {
    marginTop: '70px',
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
});

class UserVisitList extends Component {
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
      UserVisit(user).then(res => {
        if (res.length > 0) {
          this.setState({
            likes: res,
          })
        }
      })
      this.setState({
        firstName: decoded.firstName ? decoded.firstName : decoded.firstname,
        lastName: decoded.lastName ? decoded.lastName : decoded.lastname,
        username: decoded.username,
        pic1: decoded.pic1,
      })
      /*************** END LIKED HANDLER ***************************/
    }
  }

  render() {

    const { classes } = this.props

    let $list = null;
    
    if (this.state.likes) {
      $list = (<Container className={classes.cardGrid} maxWidth="md">
        {/* End hero unit */}
        <Typography component="h1" variant="h4" color="textPrimary" gutterBottom>
          Ils ont visite votre profil :
        </Typography>
        <Grid container spacing={4}>
          {this.state.likes.map((card) => (
            <Grid item key={card.scorePop} xs={12} sm={6} md={4}>
              <Card className={classes.card}>
                <CardMedia
                  className={classes.cardMedia}
                  image={card.pic1}
                  title="Image title"
                />
                <CardContent className={classes.cardContent}>
                  <Typography gutterBottom variant="h5" component="h2">
                    {card.sender}
                  </Typography>
                  <Typography>
                    {card.age} ans
                </Typography>
                <Typography>
                   Score pop : {card.scorePop} 
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
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>)
    }
    return (
      <div className={classes.container}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            {$list}
          </Grid>
        </Grid>
      </div>
    )
  }
}

export default withStyles(styles, { withTheme: true })(UserVisitList)
