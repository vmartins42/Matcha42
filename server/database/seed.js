var connection = require('./db')
const pictures = require('./pictures.js');
const names = require('./names.js');
const faker = require('faker');
const crypto = require('crypto')
var bcrypt = require('bcryptjs')

const emailProvider = [
  'hotmail.fr',
  'gmail.com',
  'yahoo.com',
  'laposte.net',
  'orange.fr',
  'sfr.fr',
  'live.fr'
];
const cities = [
  'Paris',
  'Marseille',
  'Lyon',
  'Toulouse',
  'Nice',
  'Nantes',
  'Montpellier',
  'Strasbourg',
  'Bordeaux',
  'Lille',
  'Rennes',
  'Reims',
  'Saint-Etienne',
  'Toulon',
];
const coord = {
  'Paris': [48.855, 2.33],
  'Marseille': [43.3, 5.41],
  'Lyon': [45.75, 4.86],
  'Toulouse': [43.6, 1.44],
  'Nice': [43.73, 7.27],
  'Nantes': [47.2, -1.55],
  'Montpellier': [43.6, 3.88],
  'Strasbourg': [48.58, 7.75],
  'Bordeaux': [44.84, -0.58],
  'Lille': [50.63, 3.062],
  'Rennes': [48.11, -1.68],
  'Reims': [49.25, 4.03],
  'Saint-Etienne': [45.43, 4.39],
  'Toulon': [43.15, 5.93]
};

const interestsList = [
  'burritos',
  'cinema',
  'nature',
  'netflix',
  'manger',
  'courrir',
  'animaux',
  'jeux videos',
  'chill',
  'chili con carne',
  'voyage',
  'payasage',
  'dormir',
  'chat',
  'chien',
  'dinosaures',
  'tauromachie',
  'cassoulet',
  'anarchie',
  'choucroute',
  'evasionfiscale',
  'yolo',
  'paradisfiscaux',
  'sorcellerie',
  'pisciculture',
  'CNRS',
  'frites',
  'rhododendron',
  'fauconnerie',
  'philatelie',
  'yoga',
  'confucianisme',
  'cancerducolon',
  'jacobinisme',
  'meteorites',
  'collapsologie',
  'chlamydia',
];

const biography = [
  'Salut je cherches quelque chose de serieux.',
  'Libre et vacciné',
  'Vive Macron',
  'Le COVID ou la COVID ? lol like si tu me trouves drôle',
  'Pas sérieux ne pas liker merci byyye',
  'Jaime la nature et courrir dans leau avec mes chossures trop classes',
]

const saveDb = async (index) => {
  return new Promise(async (resolve, reject) => {
    var user = {}
    const ville = cities[Math.floor(Math.random() * cities.length)];
    const today = new Date()
    const onlydate = today.getDate() + "-" + parseInt(today.getMonth() + 1) + "-" + today.getFullYear();
    const arrayOfInterests = [interestsList[Math.floor(Math.random() * interestsList.length)], interestsList[Math.floor(Math.random() * interestsList.length)], interestsList[Math.floor(Math.random() * interestsList.length)], interestsList[Math.floor(Math.random() * interestsList.length)]]
    user.sexe = names.randomSexeUser()
    user.age = Math.floor(Math.random() * (68 - 18 + 1)) + 18
    user.lastname = faker.name.lastName()
    user.firstname = user.sexe === 'male' ? names.randomManFirstName() : names.randomWomanFirstName()
    user.username = `${user.firstname}.${user.lastname}${index}`
    user.email = `${user.firstname}_${user.lastname}@${emailProvider[Math.floor(Math.random() * emailProvider.length)]}`
    user.password = await bcrypt.hashSync('qwertyui', 10);
    user.inscription_date = today
    user.orientation = names.randomSexeUser()
    user.bio = biography[Math.floor(Math.random() * biography.length)]
    user.city = ville
    user.lat = coord[user.city][0]
    user.lon = coord[user.city][1]
    user.valid = true
    user.completed = true
    user.pic1 = user.sexe === 'male' ? pictures.randomManPic() : pictures.randomWomanPic()
    user.scorePop = Math.floor(Math.random() * 100)
    user.country = ville
    user.hash = crypto.randomBytes(20).toString('hex')
    user.connected = onlydate
    user.online = false
    user.interests = JSON.stringify(arrayOfInterests)
    await connection.query('INSERT INTO users SET username = ?, firstname = ?, lastname = ?, email = ?, password= ?, inscription_date= ?, sexe = ?, orientation = ?, bio = ?, scorePop= ?, interests = ?, age = ?, city = ?, country = ?,  pic1 = ?, lat = ?, lon = ?, valid = ?, completed= ?, hash= ?, connected= ?, online= ?', [user.username, user.firstname, user.lastname, user.email, user.password, user.inscription_date, user.sexe, user.orientation, user.bio, user.scorePop, user.interests, user.age, user.city, user.country, user.pic1, user.lat, user.lon, user.valid, user.completed, user.hash, user.connected, user.online], (err) => {
      if (err) {
        console.log("ERROR INSERT => ", err)
        return reject(err)
      } else {
        console.log(`user n° ${index} créé`)
        return resolve()
      }
    })
  })
}

const seedUsers = async () => {
  for (var index = 0; index < 1000; index++) {
    await saveDb(index)
  }

}


const seed = async () => {
  try {
    await seedUsers()
    console.log("Et voilà!")
    connection.end()
  }
  catch (error) {
    console.log(error)
    connection.end()
  }
}

seed()