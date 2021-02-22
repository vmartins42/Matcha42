import React, { Component } from 'react'

import { withStyles } from "@material-ui/core/styles"
import Welcome from './Welcome'
import UserWelcome from './UserWelcome';

const styles =  ({
  container: {
    height: "100vh",
    display: 'flex',
    flexFlow: 'wrap',
    alignItems: 'center',
    flexDirection:'column',
    justifyContent: 'center',
  },
});

class UserBanner extends Component {
  constructor() {
    super()
    this.state = {
      connected: false
    }
  }

  componentDidMount() {
    if (localStorage.usertoken)
      this.setState({connected: true})
  }
// CHECK THIS.STATE COMPONENT VOIR SI CA CRASH QUAND ON SERACONNECTER

  render() {
    const { classes } = this.props
    return (
      <div className={classes.container}>
        {this.state.connected === true ? <UserWelcome />: <Welcome />}
      </div>
    )
  }
}

export default withStyles(styles, { withTheme: true })(UserBanner)
