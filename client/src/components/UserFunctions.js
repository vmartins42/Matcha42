import axios from 'axios'

export const register = newUser => {
  return axios
    .post('users/register', {
      firstname: newUser.firstname,
      lastname: newUser.lastname,
      email: newUser.email,
      username: newUser.username,
      password: newUser.password
    })
    .then(res => {
      if (res.data.error) {
        return (res.data);
      }
      else {
      }
    })
}

export const login = user => {
  return axios
    .post('users/login', {
      username: user.username,
      password: user.password
    })
    .then(res => {
      if (res.data.error){
        return res.data
      }
        localStorage.setItem('usertoken', res.data)
        return res.data
    })
    .catch(err => {
      console.log(err)
    })
}

export const logOut = user => {
  return axios
    .post('users/logout', {
      email: user.email,
    })
    .then(res => {
      return res.data
    })
    .catch(err => {
      console.log(err)
    })
}

export const refreshUser = user => {
  return axios
    .post('/users/refreshUser/:name', {
      username: user.username,
      liked: user.liked,
      errors: {}
    })
    .then(res => {
      if (res.data.error) {
        return (res.user.error);
      }
      else {
        return res.data
      }
    })
    .catch(err => {
      console.log(err)
    })
}

export const UserLiked = user => {
  return axios
    .post('/users/UserLiked', {
      username: user.username,
      errors: {}
    })
    .then(res => {
      if (res.data.error) {
        return (res.user.error);
      }
      else {
        return res.data
      }
    })
    .catch(err => {
      console.log(err)
    })
}

export const UserVisit = user => {
  return axios
    .post('/users/UserVisit', {
      username: user.username,
      errors: {}
    })
    .then(res => {
      if (res.data.error) {
        return (res.user.error);
      }
      else {
        return res.data
      }
    })
    .catch(err => {
      console.log(err)
    })
}

export const refreshUserDate = user => {
  return axios
    .post('/users/refreshUserDate/:name', {
      username: user.username,
      liked: user.liked,
      errors: {}
    })
    .then(res => {
      if (res.data.error) {
        return (res.user.error);
      }
      else {
        return res.data
      }
    })
    .catch(err => {
      console.log(err)
    })
}

export const dataHandler = user => {
  return axios
    .post('users/profile', {
      firstName: user.first_name,
      lastName: user.last_name,
      username: user.username,
      email: user.email,
      genre: user.genre,
      lookingFor: user.lookingFor,
      age: user.age,
      city: user.city,
      state: user.state,
      zip: user.zip,
      country: user.country,
      bio: user.bio,
      interests: user.interests,
      pic1: user.pic1,
      pic2: user.pic2,
      pic3: user.pic3,
      imagePreviewUrl: user.imagePreviewUrl,
      lat: user.lat,
      lon: user.lon,
      adressUser: user.adressUser,
      file: user.file,
      errors: {}
    })
    .then(res => {
      if (res.data.error) {
        return (res.data.error);
      }
      else {
        localStorage.setItem('usertoken', res.data)
        return res.data
      }
    })
    .catch(err => {
      console.log(err)
    })
}

export const UserSortListMatch = user => {
  return axios
    .post('users/UserListMatcher', {
      orientation: user.orientation,
      email: user.email,
      sexe: user.sexe,
      username: user.username,
      errors: {}
    })
    .then(res => {
      if (res.data.error) {
        return (res.data.error);
      }
      else {
        return res.data
      }
    })
    .catch(err => {
      console.log(err)
    })
}

export const UserSortList = user => {
  return axios
    .post('users/UserList', {
      orientation: user.orientation,
      email: user.email,
      sexe: user.sexe,
      username: user.username,
      errors: {}
    })
    .then(res => {
      if (res.data.error) {
        return (res.data.error);
      }
      else {
        return res.data
      }
    })
    .catch(err => {
      console.log(err)
    })
}

export const dataFilterHandler = data => {
  return axios
    .post('users/UserSortList', {
      ageMax: data.ageMax,
      scorePop: data.scorePop,
      distanceKm: data.distanceKm,
      errors: {}
    })
    .then(res => {
      if (res.data.error) {
        return (res.data.error);
      }
      else {
        return res.data
      }
    })
    .catch(err => {
      console.log(err)
    })
}

export const likeUser = data => {
  return axios
    .post('/users/LikeUser/:name', {
      email: data.email,
      username: data.username,
      liked: data.liked,
      scorePop: data.scorePop,
      errors: {}
    })
    .then(res => {
      if (res.data.error) {
        return (res.data.error);
      }
      else {
        return res.data
      }
    })
    .catch(err => {
      console.log(err)
    })
}

export const UnlikeUser = data => {
  return axios
    .post('/users/UnLikeUser/:name', {
      email: data.email,
      liked: data.liked,
      username: data.username,
      scorePop: data.scorePop,
      errors: {}
    })
    .then(res => {
      if (res.data.error) {
        return (res.data.error);
      }
      else {
        return res.data
      }
    })
    .catch(err => {
      console.log(err)
    })
}

export const UserMatchList = user => {
  return axios
    .post('/users/UserMatchList', {
      username: user.username,
      errors: {}
    })
    .then(res => {
      if (res.data.error) {
        return (res.user.error);
      }
      else {
        return res.data
      }
    })
    .catch(err => {
      console.log(err)
    })
}

export const notificationVisitHandler = user => {
  return axios
    .post('/users/notificationVisitHandler', {
      email: user.email,
      sender: user.liked,
      scorePop: user.scorePop,
      errors: {}
    })
    .then(res => {
      if (res.data.error) {
        return (res.user.error);
      }
      else {
        return res.data
      }
    })
    .catch(err => {
      console.log(err)
    })
}

export const getNotifications = user => {
  return axios
    .post('/users/getNotifications', {
      username: user.username,
      errors: {}
    })
    .then(res => {
      if (res.data.error) {
        return (res.user.error);
      }
      else {
        return res.data
      }
    })
    .catch(err => {
      console.log(err)
    })
}

export const getNotificationsNav = user => {
  return axios
    .post('/users/getNotificationsNav', {
      username: user.username,
      errors: {}
    })
    .then(res => {
      if (res.data.error) {
        return (res.user.error);
      }
      else {
        return res.data
      }
    })
    .catch(err => {
      console.log(err)
    })
}

export const getUser = user => {
  return axios
    .post('/users/getUser', {
      username: user.username,
      errors: {}
    })
    .then(res => {
      if (res.data.error) {
        return (res.user.error);
      }
      else {
        return res.data
      }
    })
    .catch(err => {
      console.log(err)
    })
}

export const blockUser = user => {
  return axios
    .post('/users/blockUser', {
      username: user.username,
      blocked: user.blocked,
      errors: {}
    })
    .then(res => {
      if (res.data.error) {
        return (res.user.error);
      }
      else {
        return res.data
      }
    })
    .catch(err => {
      console.log(err)
    })
}

export const reportUser = user => {
  return axios
  .post('/users/reportUser', {
    username: user.username,
    email: user.email,
    blocked: user.blocked,
    blockedEmail: user.blockedEmail
  })
  .then(res => {
    if (res.data.error) {
      return (res.user.error);
    }
    else {
      return res.data
    }
  })
  .catch(err => {
    console.log(err)
  })
}

export const emailMdpHandler = user => {
  return axios
    .post('/users/emailMdpHandler', {
      newEmail: user.newEmail,
      email: user.email,
      confirmEmail: user.confirmEmail,
      mdp: user.mdp,
      confirmMdp: user.confirmMdp,
      errors: {},
      username: user.username
    })
    .then(res => {
      if (res.data.error) {
        return (res.user.error);
      }
      else {
        localStorage.setItem('usertoken', res.data)
        return res.data
      }
    })
    .catch(err => {
      console.log(err)
    })
}

export const emailReset = user => {
  return axios 
  .post('/users/emailresetsent', {
    email: user.email,
    type: "resetPassword"
  })
  .then(res => {
    if(res.data.error) {
      return res.data;
    }
    else {
      return res.data
    }
  })
  .catch( err => {
    console.log(err);
  })
}

export const resetpassword = user => {
  return axios
  .post('/users/resetpassword/'+user.hash, {
    password1: user.password1,
    password2: user.password2,
    email: user.email
  })
  .then(res => {
    if(res.data.error) {
      return res.data
    }
    else {
      return res.data
    }
  })
  .catch( err => {
    console.log(err);
  })
}


export const UserBlockedList = user => {
  return axios
  .post('/users/blockedList', {
    username: user.username,
    error: user.error
  })
  .then(res => {
    if(res.data.error) {
      return res.data
    }
    else {
      return res.data
    }
  })
  .catch( err => {
    console.log(err);
  })
}

