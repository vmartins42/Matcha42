import React, { Component } from 'react'

import jwt_decode from 'jwt-decode'

import NavBar from "./Navigation/index"
import { dataHandler, emailMdpHandler } from './UserFunctions'

import { withStyles } from "@material-ui/core/styles"

import Paper from '@material-ui/core/Paper';
import { Button } from "@material-ui/core"
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import AlgoliaPlaces from 'algolia-places-react'
import "./tag.scss"
import NoFoundPage from './NoFoundPage'

const styles = theme => ({
  appBar: {
    position: 'relative',
  },
  layout: {
    marginBottom: "-50%",
    width: 'auto',
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
      width: 600,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      marginTop: theme.spacing(10),
      marginBottom: theme.spacing(6),
      padding: theme.spacing(3),
    },
  },
  stepper: {
    padding: theme.spacing(3, 0, 5),
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
  },
  save: {
    marginLeft: "auto",
    marginRight: "auto",
    width: "150px",
  },
  buttonDl: {
    width: '150px',
    height: '35px',
    color: '#fff',
    border: '1px solid white',
    background: '#f50057',
    cursor: 'pointer',
    overflow: 'hidden',
    borderRadius: '25px',
    fontSize: '18px',
    marginTop: '5px',
  },
  buttonChoisir: {
    width: '150px',
    height: '35px',
    color: '#fff',
    border: '1px solid white',
    background: '#f50057',
    cursor: 'pointer',
    overflow: 'hidden',
    borderRadius: '25px',
    fontSize: '18px',
    padding: '5px',
  },
  inputDisplay: {
    display: 'none',
  },
  errImg: {
    color: 'red',
    fontWeight: 'bold',
  },
  errors: {
    color: 'red',
    textAlign: 'center',
    width: '100%',
    fontWeight: 'bold',
  },
  valid: {
    color: 'green',
    textAlign: 'center',
    width: '100%',
    fontWeight: 'bold',
  },
  buttonChoice: {
    margin: '10px',
  },
  map: {
    width: '100%',
  }
});

class Profile extends Component {
  constructor() {
    super()
    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      genre: '',
      lookingFor: '',
      age: '',
      state: '',
      zip: '',
      bio: "salut",
      tags: [],
      interests: [],
      file: null,
      imagePreviewUrl: '',
      pic1: '',
      country: '',
      city: '',
      latitude: null,
      longitude: null,
      zoom: 12,
      adressUser: null,
      buffer: null,
      confirmMdp: '',
      mdp: '',
      confirmEmail: '',
      newEmail: '',
      errors: '',
      imgExtension: ['.jpg', '.jpeg', '.png'],
      maxFileSize: '300000',
      imgValid: false,
      errImg: '',
      errorsCity: '',
      showAlgo: false,
      showLocalisation: false,
      errorMdpEmail: '',
      updateMdpEmail: '',
      updateProfile: '',
      errorTags: '',
      save: [],
      noToken: false
    }
    this.onChange = this.onChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.onChangeData = this.onChangeData.bind(this)
    this._handleImageChange = this._handleImageChange.bind(this);
    this._handleSubmit = this._handleSubmit.bind(this);
    this.getLocation = this.getLocation.bind(this);
    this.getCoordinates = this.getCoordinates.bind(this);
    this.reverseGeocodeCoordinates = this.reverseGeocodeCoordinates.bind(this)
  }

  // LOCATION HANDLER
  reverseGeocodeCoordinates() {
    fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${this.state.latitude},${this.state.longitude}&sensor=false&key=AIzaSyDsG0tzNP2IhOpHeoN7n8H4EDdVonFZBRE`)
      .then(response => response.json())
      .then(data =>
        this.setState({
          city: data.results[0].address_components[2].long_name,
        }))
      .catch(error => alert(error))

  }

  getLocation() {
    this.setState({ showLocalisation: true, showAlgo: false })
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.getCoordinates, this.handleLocationError);
    } else {
      alert("La géolocalisation n'est pas prise en charge par votre navigateur");
    }
  }

  getCoordinates(position) {
    this.setState({
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    })
    this.reverseGeocodeCoordinates();
  }

  handleLocationError(error) {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        alert("L'utilisateur a refusé la demande de géolocalisation.")
        break;
      case error.POSITION_UNAVAILABLE:
        alert("Les informations de localisation ne sont pas disponibles.")
        break;
      case error.TIMEOUT:
        alert("La demande d’obtention de l’emplacement de l’utilisateur a expiré.")
        break;
      case error.UNKNOWN_ERROR:
        alert("Une erreur inconnue est survenue.")
        break;
      default:
        alert("Une erreur inconnue est survenue.")
    }
  }
  ////////////////////// END localisation HANDLER

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value })
  }
  ////////////////////////////////////////////////////////////////

  componentDidMount() {
    if (localStorage.usertoken) {
      const token = localStorage.usertoken
      const decoded = jwt_decode(token)
      this.setState({
        firstName: decoded.firstName ? decoded.firstName : decoded.firstname,
        lastName: decoded.lastName ? decoded.lastName : decoded.lastname,
        username: decoded.username,
        email: decoded.email,
        genre: decoded.genre ? decoded.genre : decoded.sexe,
        lookingFor: decoded.lookingFor ? decoded.lookingFor : decoded.orientation,
        age: decoded.age,
        city: decoded.city,
        state: decoded.state,
        zip: decoded.zip,
        country: decoded.countryy,
        bio: decoded.bio,
        pic1: decoded.pic1,
        pic2: decoded.pic2,
        pic3: decoded.pic3,
        interests: decoded.interests,
        latitude: decoded.lat,
        longitude: decoded.lon,
        adressUser: decoded.adressUser,
        showAlgo: decoded.city ? true : false,
        save: decoded.interests ? JSON.parse(decoded.interests) : [],
      })
    }
    else {
      this.setState({ noToken: true })
    }
  }

  componentWillUnmount() {
    this.setState({
      firstName: '',
      username: '',
      lastName: '',
      email: '',
      genre: '',
      lookingFor: '',
      age: '',
      city: '',
      state: '',
      zip: '',
      country: '',
      bio: '',
      pic1: '',
      pic2: '',
      pic3: '',
      interests: '',
      latitude: '',
      longitude: '',
      adressUser: '',
      newEmail: '',
      confirmEmail: '',
      mdp: '',
      confirmMdp: '',
      updateMdpEmail: '',
      errors: '',
      errImg: '',
      errorsCity: '',
      save: '',
      updateProfile: '',
    });
  }
  /////// Picture HANDLER TO DATABASE
  _handleSubmit(e) {
    e.preventDefault();
    const user = {
      email: this.state.email,
      first_name: this.state.firstName,
      last_name: this.state.lastName,
      genre: this.state.genre,
      lookingFor: this.state.lookingFor,
      age: this.state.age,
      city: this.state.city,
      state: this.state.state,
      zip: this.state.zip,
      country: this.state.country,
      bio: this.state.bio,
      tags: this.state.tags,
      pic1: !this.state.pic1 ? this.state.imagePreviewUrl : this.state.pic1,
      pic2: (this.state.pic1 !== null) && this.state.imagePreviewUrl && !this.state.pic2 ? this.state.imagePreviewUrl : this.state.pic2,
      pic3: this.state.pic2 && this.state.pic2 && this.state.imagePreviewUrl ? this.state.imagePreviewUrl : this.state.pic3,
      imagePreviewUrl: this.state.imagePreviewUrl,
      interests: this.state.interests,
      lat: this.state.latitude,
      lon: this.state.longitude,
      file: this.state.file,
      adressUser: this.state.adressUser,
      username: this.state.username,
    }
    dataHandler(user).then(res => {
      if (res) {
        const decoded = jwt_decode(res)
        this.setState({ pic1: decoded.pic1, pic2: decoded.pic2, pic3: decoded.pic3, imagePreviewUrl: '' })
      }
    })
  }
  ////////// TAG HANDLER ////////////////////////////////////////////////////////
  TagsInput = props => {
    let tmp = this.state.save;
    if (props.tags !== null) {
      let tmp2 = [];
      const [tags, setTags] = React.useState(props.tags);
      const removeTags = indexToRemove => {
        setTags([...tags.filter((_, index) => index !== indexToRemove)]);
        if (this.state.save.length > 0) {
          tmp = this.state.save;
          tmp2 = tmp.filter((_, index) => index !== indexToRemove)
          this.setState({ tags: tmp2, save: tmp2 });
        }
      };
      const addTags = event => {
        if (event.target.value !== "") {
          setTags([...tags, event.target.value]);
          props.selectedTags([...tags, event.target.value]);
          tmp = this.state.save;
          tmp.push(event.target.value)
          this.setState({ tags: tmp, save: tmp })
          event.target.value = "";
          this.setState({ errorTags: "" })
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
            placeholder="Cliquez pour ajouter d'autres tags"
          />
        </div>
      );
    }
    else {
      return (<div></div>)
    }

  };
  // TAGS HANDLER END ///////////////////////////////////////////////////

  //////// MYSQL DATA HANDLER ////////////////////////////////////////////
  onSubmit(e) {
    e.preventDefault()
    var interests = null;

    if (this.state.firstName === "" || this.state.lastName === "" || this.state.age === null || this.state.genre === null)
      return this.setState({ errors: "Un ou des champs de sont pas bon, veuillez les rectifier avant d'enregistrer." })
    else if (!RegExp(/^[A-Za-z]{3,20}$/).test(this.state.firstName))
      return this.setState({ errors: "Prénom mauvais. Autorisé : A-Z, a-z, 3-20 caractères max." })
    else if (!RegExp(/^[A-Za-z]{3,15}$/).test(this.state.lastName))
      return this.setState({ errors: "Nom mauvais. Autorisé : A-Z, a-z, 3-20 caractères max." })
    else if (this.state.age < 18 || this.state.age > 99)
      return this.setState({ errors: "L'âge doit être compris entre 18 et 99 ans." })
    else if (this.state.city === "" || this.state.city === null)
      return this.setState({ errors: "Le champ ville n'a pas été renseigné." })
    else {
      this.setState({ errors: '' })
      if (this.state.save) {
        interests = JSON.stringify(this.state.save)
      }
      else {
        interests = JSON.stringify(this.state.save)
      }
      const user = {
        email: this.state.email,
        first_name: this.state.firstName,
        last_name: this.state.lastName,
        genre: this.state.genre,
        lookingFor: this.state.lookingFor,
        age: this.state.age,
        city: this.state.city,
        state: this.state.state,
        zip: this.state.zip,
        country: this.state.country,
        bio: this.state.bio,
        pic1: this.state.pic1,
        pic2: this.state.pic2,
        pic3: this.state.pic3,
        imagePreviewUrl: this.state.imagePreviewUrl,
        interests: interests,
        lat: this.state.latitude,
        username: this.state.username,
        lon: this.state.longitude,
        adressUser: this.state.adressUser,
      }

      dataHandler(user).then(res => {
        if (res) {
          const decoded = jwt_decode(res)
          this.setState({ pic1: decoded.pic1, pic2: decoded.pic2, pic3: decoded.pic3, city: decoded.city, updateProfile: 'Informations mis à jour.' })
        }
      })
      this.props.history.push(`/profile`)
    }
  }
  //////// MYSQL DATA HANDLER END ////////////////////////////////////////////

  //////// MYSQL DATA HANDLER ////////////////////////////////////////////
  onChangeData(e) {
    e.preventDefault()
    if ((this.state.newEmail !== "" && this.state.confirmEmail === "") || (this.state.newEmail === "" && this.state.confirmEmail !== ""))
      return this.setState({ errorMdpEmail: "Un des deux champs email n'est pas remplis, veuillez le remplir." })
    else if ((this.state.newEmail !== this.state.confirmEmail) || (this.state.confirmEmail !== this.state.newEmail))
      return this.setState({ errorMdpEmail: "Les deux adresses email ne sont pas identiques." })
    else if ((this.state.newEmail !== "" && !RegExp(/^[\w-]+@([\w-]+\.)+[\w-]{2,4}$/).test(this.state.newEmail)) || (this.state.newEmail !== "" && !RegExp(/^[\w-]+@([\w-]+\.)+[\w-]{2,4}$/).test(this.state.confirmEmail)))
      return this.setState({ errorMdpEmail: "L'email n'est pas bon. Autorisé : ex@exemple.ex" })
    else
      this.setState({ errorMdpEmail: "" })

    if ((this.state.mdp !== "" && this.state.confirmMdp === "") || (this.state.mdp === "" && this.state.confirmMdp !== ""))
      return this.setState({ errorMdpEmail: "Un des deux champs mot de passe n'est pas remplis, veuillez le remplir." })
    else if ((this.state.mdp && this.state.mdp < 6) || (this.state.confirmMdp && this.state.confirmMdp < 6))
      return this.setState({ errorMdpEmail: "Minimum 6 caractères pour les mots de passes" })
    else if ((this.state.mdp !== this.state.confirmMdp) || (this.state.confirmMdp !== this.state.mdp))
      return this.setState({ errorMdpEmail: "Les deux mots de passes doivent être identiques." })
    else {
      this.setState({ errorMdpEmail: "" })
    }

    if ((this.state.newEmail && this.state.confirmEmail) || (this.state.mdp && this.state.confirmMdp)) {

      const user = {
        email: this.state.email,
        newEmail: this.state.newEmail,
        confirmEmail: this.state.confirmEmail,
        mdp: this.state.mdp,
        confirmMdp: this.state.confirmMdp,
        username: this.state.username
      }
      localStorage.removeItem("usertoken")
      emailMdpHandler(user).then(res => {
        if (res) {
          this.setState({
            newEmail: '',
            confirmEmail: '',
            mdp: '',
            confirmMdp: '',
            updateMdpEmail: 'Informations mis à jour.'
          })
          this.props.history.push(`/profile`)
        }
      })
    }

  }
  //////// MYSQL DATA HANDLER END ////////////////////////////////////////////

  hasExtension(fileName) {
    const pattern = '(' + this.state.imgExtension.join('|').replace(/\./g, '\\.') + ')$';
    return new RegExp(pattern, 'i').test(fileName);
  }

  checkValidFiles(file) {
    if (file && !this.hasExtension(file.name)) {
      this.setState({
        errImg: "Mauvaise Extension: " + file.name + " Extension autorisées: jpg, jpeg, png",
        file: '',
        imagePreviewUrl: ''
      })
      return 1
    }
    // Check for file size
    else if (file && file.size > this.state.maxFileSize) {
      this.setState({
        errImg: "Taille du fichier trop grande: " + file.size + " Taille max autorisé: 300ko",
        file: '',
        imagePreviewUrl: ''
      })
      return 1
    }
    return 0
  }

  // FILE SELECTOR INPUT HANDLER ////////////////////////////////////////
  _handleImageChange(e) {
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];
    let check = this.checkValidFiles(file)
    // Iterate over all uploaded files
    if (check === 0 && file) {
      reader.onloadend = () => {
        this.setState({
          file: '',
          imagePreviewUrl: reader.result
        });
      }
      reader.readAsDataURL(file)
      this.setState({ imgValid: true, errImg: "" })
    }
    else {
      this.setState({ imgValid: false })
    }


  }
  // FILE SELECTOR INPUT HANDLER END ////////////////////////////////////

  removePic1(e) {
    if (this.state.pic1) {
      this.setState({ pic1: null })
    }
  }
  removePic2(e) {
    if (this.state.pic2) {
      this.setState({ pic2: null })
    }
  }
  removePic3(e) {
    if (this.state.pic3) {
      this.setState({ pic3: null })
    }
  }

  handleChangeCity = ({ suggestion }) => {
    this.setState({ city: suggestion.name, longitude: suggestion.latlng.lng, latitude: suggestion.latlng.lat })
  }

  onClear = () => {
    this.setState({ adressUser: "", longitude: "", latitude: "" })
  }

  showAlgolia = () => {
    this.setState({ showAlgo: true, showLocalisation: false })
  }

  render() {
    const { classes } = this.props

    let { imagePreviewUrl } = this.state;
    let $imagePreview = null;
    let $pic1 = null;
    let $pic2 = null;
    let $pic3 = null;
    let $displayTag = null;
    let $displayTag2 = null;

    const selectedTags = tags => {
    };

    if (this.state.pic1 !== "") {
      $pic1 = (<img width="80%" src={this.state.pic1} alt="" />);
    }
    if (this.state.pic2) {
      $pic2 = (<img width="80%" src={this.state.pic2} alt="" />);
    }
    if (this.state.pic3) {
      $pic3 = (<img width="80%" src={this.state.pic3} alt="" />);
    }

    if (imagePreviewUrl) {
      $imagePreview = (<img width="35%" src={imagePreviewUrl} alt="" />);
    }
    if (this.state.interests !== null && this.state.interests !== undefined && this.state.interests !== "[]") {
      if (this.state.interests.length > 4) {
        let tagsTab = JSON.parse(this.state.interests);
        $displayTag = (<Grid item xs={12} >
          <this.TagsInput selectedTags={selectedTags} tags={tagsTab} />
        </Grid>);
      }
    }
    else if (this.state.tags.length === 0){
      $displayTag2 = (<Grid item xs={12} >
        <this.TagsInput selectedTags={selectedTags} tags={["exemple"]} />
      </Grid>);
    }
    else {
      $displayTag2 = (<Grid item xs={12} >
        <this.TagsInput selectedTags={selectedTags} tags={["exemple"]} />
      </Grid>);
    }

    return (

      <div>
        <NavBar />
        {
          this.state.noToken ? <NoFoundPage />
            :
            <div >

              <main className={classes.layout}>
                <Paper className={classes.paper}>
                  <Typography variant="h6" gutterBottom>
                    Votre profil :
              </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <form onSubmit={this._handleSubmit}>
                        {this.state.imgValid === true ? "" : <p className={classes.errImg}>{this.state.errImg}</p>}
                        <label htmlFor="file" className={classes.buttonChoisir}>Choisir une photo</label>
                        <input id="file" type="file" className={classes.inputDisplay} onChange={this._handleImageChange} />
                        <button type="submit" className={classes.buttonDl} onClick={this._handleSubmit}>Télécharger</button>
                      </form>
                      {$imagePreview}
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      1ere photo :
                  {$pic1}
                      <IconButton onClick={() => { this.removePic1() }}><CloseIcon /></IconButton>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      2eme photo :
                  {$pic2}
                      <IconButton onClick={() => { this.removePic2() }}><CloseIcon /></IconButton>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      3eme photo :
                  {$pic3}
                      <IconButton onClick={() => { this.removePic3() }}><CloseIcon /></IconButton>
                    </Grid>
                  </Grid>
                  <form noValidate onSubmit={this.onSubmit}>
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          required
                          id="firstName"
                          name="firstName"
                          label="Prénom"
                          value={this.state.firstName}
                          fullWidth
                          autoComplete="given-name"
                          onChange={this.onChange}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField

                          id="lastName"
                          name="lastName"
                          label="Nom"
                          value={this.state.lastName}
                          fullWidth
                          autoComplete="family-name"
                          onChange={this.onChange}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <FormControl component="fieldset">
                          <FormLabel component="legend">Je suis :</FormLabel>
                          <RadioGroup aria-label="gender" name="genre" value={this.state.genre} onChange={this.onChange}>
                            <FormControlLabel value="female" control={<Radio />} label="Femme" />
                            <FormControlLabel value="male" control={<Radio />} label="Homme" />
                            <FormControlLabel value="Bisexuelle" control={<Radio />} label="Autres" />
                          </RadioGroup>
                        </FormControl>
                      </Grid>
                      <Grid item xs={6}>
                        <FormControl component="fieldset">
                          <FormLabel component="legend">Je recherche :</FormLabel>
                          <RadioGroup aria-label="gender" name="lookingFor" value={this.state.lookingFor} onChange={this.onChange}>
                            <FormControlLabel value="female" control={<Radio />} label="Femme" />
                            <FormControlLabel value="male" control={<Radio />} label="Homme" />
                            <FormControlLabel value="Bisexuelle" control={<Radio />} checked={this.state.lookingFor.includes('Bisexuelle') || this.state.lookingFor.includes('other')} label="Les deux" />
                          </RadioGroup>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          id="outlined-number"
                          label="Votre age"
                          value={this.state.age ? this.state.age : ''}
                          type="number"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          variant="outlined"
                          name="age"
                          onChange={this.onChange}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        {this.state.showLocalisation ? <TextField
                          required
                          id="city"
                          name="city"
                          label="Ville"
                          value={this.state.city || ''}
                          fullWidth
                          autoComplete="shipping address-level2"
                          onChange={this.onChange}
                        /> : ""}

                        {this.state.showAlgo ? <AlgoliaPlaces
                          placeholder='Nom de votre ville'
                          options={{
                            appId: 'plZIE2XHC34M',
                            apiKey: '1c0bf3be7b703fa6273f620378933162',
                            language: 'fr',
                            countries: ['fr'],
                            type: 'city',
                          }}
                          defaultValue={this.state.city || ''}
                          onChange={this.handleChangeCity}
                          onClear={() => { this.onClear() }}
                        /> : ""}
                      </Grid>
                      <Grid item xs={12} sm={1}>
                        {this.state.showAlgo || this.state.showLocalisation ? <span>OU</span> : ""}
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        {this.state.showLocalisation ? "" : <Button
                          className={classes.buttonChoice}
                          type="submit"
                          variant="contained"
                          color="secondary"
                          onClick={this.getLocation}>Localiser</Button>}

                        {this.state.showAlgo ? "" : <Button
                          className={classes.buttonChoice}
                          variant="contained"
                          color="secondary"
                          onClick={this.showAlgolia}>Entrer ville
                      </Button>}
                      </Grid>

                      <Grid item xs={12} >
                        {
                          this.state.latitude && this.state.longitude ?
                            <img src={`https://maps.googleapis.com/maps/api/staticmap?center=${this.state.latitude},${this.state.longitude}&zoom=14&size=550x300&sensor=false&markers=color:red%7C${this.state.latitude},${this.state.longitude}&key=AIzaSyDsG0tzNP2IhOpHeoN7n8H4EDdVonFZBRE`} alt='' />
                            :
                            null
                        }

                      </Grid>
                      <Grid item xs={12} >
                        <TextareaAutosize style={{ resize: "none", width: "100%", marginTop: "12px" }} name="bio" aria-label="minimum height" rowsMin={9} value={this.state.bio ? this.state.bio : ""} placeholder="Decrivez vous en quelque mots !!" onChange={this.onChange} />
                      </Grid>
                      {$displayTag}
                      {$displayTag2}
                      {this.state.errors ? <p className={classes.errors}>{this.state.errors}</p> : ""}
                      {this.state.updateProfile ? <p className={classes.valid}>{this.state.updateProfile}</p> : ""}
                      <Button
                        type="submit"
                        variant="contained"
                        color="secondary"
                        className={classes.save}>Enregistrer
                  </Button>
                    </Grid>
                  </form>
                </Paper>
                <Paper className={classes.paper}>
                  <Typography variant="h6" gutterBottom>
                    Changer email et mot de passe
              </Typography>
                  {this.state.errorMdpEmail ? <p className={classes.errors}>{this.state.errorMdpEmail}</p> : ""}
                  {this.state.updateMdpEmail ? <p className={classes.valid}>{this.state.updateMdpEmail}</p> : ""}
                  <form noValidate onSubmit={this.onChangeData}>
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          id="newEmail"
                          name="newEmail"
                          label="Nouveau email"
                          value={this.state.newEmail || ""}
                          fullWidth
                          autoComplete="given-name"
                          onChange={this.onChange}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          required
                          id="confirmEmail"
                          name="confirmEmail"
                          label="Confirmez email"
                          value={this.state.confirmEmail || ""}
                          fullWidth
                          autoComplete="family-name"
                          onChange={this.onChange}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          required
                          id="mdp"
                          name="mdp"
                          label="Nouveau mot de passe"
                          type="password"
                          value={this.state.mdp}
                          fullWidth
                          autoComplete="given-name"
                          onChange={this.onChange}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          required
                          id="confirmMdp"
                          name="confirmMdp"
                          label="Confirm mot de passe"
                          type="password"
                          value={this.state.confirmMdp}
                          fullWidth
                          autoComplete="family-name"
                          onChange={this.onChange}
                        />
                      </Grid>
                      <Button
                        type="submit"
                        variant="contained"
                        color="secondary"
                        className={classes.save}>Enregistrer
                  </Button>
                    </Grid>
                  </form>
                </Paper>
              </main>
            </div>
        }
      </div >
    )
  }
}

export default withStyles(styles, { withTheme: true })(Profile)