import React, { Component } from 'react'

import jwt_decode from 'jwt-decode'

import { withStyles } from "@material-ui/core/styles"
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';

const styles = theme => ({
  container: {
    marginTop: '30px',
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

      this.setState({
        username: decoded.username,
        age: decoded.age,
        scorePop: decoded.scorePop,
        pic1: decoded.pic1,
        adressUser: decoded.adressUser,
        bio: decoded.bio,
        tags: decoded.interests
      })
    }
  }

  render() {
    const { classes } = this.props
    let $list = null;
    
    if (this.state.username) {
      $list = (<Container className={classes.cardGrid} maxWidth="md">
        {/* End hero unit */}
        <Typography component="h1" variant="h4" color="textPrimary" gutterBottom>
          Votre Profil
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card className={classes.card}>
              { this.state.pic1 !== null ? <CardMedia
                className={classes.cardMedia}
                image={this.state.pic1}
                title="Image title"
              /> : 0}
              <CardContent className={classes.cardContent}>
                <Typography gutterBottom variant="h5" component="h2">
                  {this.state.username}
                </Typography>
                <Typography>
                  {this.state.age} ans
              </Typography>
                <Typography>
                  {this.state.adressUser}
                </Typography>
              </CardContent>
              <Typography>
                Score pop : {this.state.scorePop}
              </Typography>
              <Typography>
                {this.state.bio}
              </Typography>
            </Card>
          </Grid>
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




