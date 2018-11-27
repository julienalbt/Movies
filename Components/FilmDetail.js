// Components/FilmDetail.js

import React from 'react'
import { StyleSheet, View, Text, ActivityIndicator, ScrollView, Image, TouchableOpacity, Share, Alert, Platform } from 'react-native'
import { getFilmDetailFromApi } from '../API/TMDBApi'
import { getImageFromAPI } from '../API/TMDBApi'
import Moment from 'moment'
import numeral from 'numeral'
import { connect } from 'react-redux'

class FilmDetail extends React.Component {

  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state
    // On accède à la fonction shareFilm et au film via les paramètres qu'on a ajouté à la navigation
    if (params.film != undefined && Platform.OS === 'ios') {
      return {
          // On a besoin d'afficher une image, il faut donc passe par une Touchable une fois de plus
          headerRight: <TouchableOpacity
                          style={styles.share_touchable_headerrightbutton}
                          onPress={() => params.shareFilm()}>
                          <Image
                            style={styles.share_image}
                            source={require('../assets/images/ic_share.png')} />
                        </TouchableOpacity>
      }
    }
}

  constructor(props) {
    super(props)
    this.state = {
      film: undefined, // Pour l'instant on n'a pas les infos du film, on initialise donc le film à undefined.
      isLoading: true // A l'ouverture de la vue, on affiche le chargement, le temps de récupérer le détail du film
    }
    this._shareFilm = this._shareFilm.bind(this)
  }

  // Fonction pour faire passer la fonction _shareFilm et le film aux paramètres de la navigation. Ainsi on aura accès à ces données au moment de définir le headerRight
  _updateNavigationParams() {
    this.props.navigation.setParams({
      shareFilm: this._shareFilm,
      film: this.state.film
    })
  }

  componentDidUpdate() {
    console.log("componentDidUpdate : ")
    console.log(this.props.favoritesFilm)
  }

  _displayLoading() {
    if (this.state.isLoading) {
      // Si isLoading vaut true, on affiche le chargement à l'écran
      return (
        <View style={styles.loading_container}>
          <ActivityIndicator size='large' />
        </View>
      )
    }
  }

  // Dès que le film est chargé, on met à jour les paramètres de la navigation (avec la fonction _updateNavigationParams) pour afficher le bouton de partage
  componentDidMount() {
    const favoriteFilmIndex = this.props.favoritesFilm.findIndex(item => item.id === this.props.navigation.state.params.idFilm)
    if (favoriteFilmIndex !== -1) { 
      this.setState({
        film: this.props.favoritesFilm[favoriteFilmIndex]
      }, () => { this._updateNavigationParams() })
      return
    }
    
    this.setState({ isLoading: true })
    getFilmDetailFromApi(this.props.navigation.state.params.idFilm).then(data => {
      this.setState({
        film: data,
        isLoading: false
      }, () => { this._updateNavigationParams() })
    })
  }

_toggleFavorite() {
  const action = { type: "TOGGLE_FAVORITE", value: this.state.film }
  this.props.dispatch(action)
}

_displayFavoriteImage() {
  var sourceImage = require('../assets/images/noFavorite.png')
  if(this.props.favoritesFilm.findIndex(item => item.id === this.state.film.id) !== -1 ) {
    sourceImage = require('../assets/images/favorite.png')
  } return (
    <Image
      style={styles.favorite_image}
      source={sourceImage}
    />
  )
}

_displayFilm() {
  const {film} = this.state
  if (this.state.film != undefined) {
    return (
      <ScrollView style={styles.scrollview_container}>
        <Image
          style={styles.cover}
          source={{uri: getImageFromAPI(film.backdrop_path)}}
        />
        <Text style={styles.titleText}>{film.title}</Text>
        <TouchableOpacity
          style={styles.favorite_container}
          onPress={() => this._toggleFavorite()}>
          {this._displayFavoriteImage()}
        </TouchableOpacity>
        <Text style={styles.descText}>{film.overview}</Text>
        <View style={styles.info}>
          <Text>Sorti le {Moment(film.release_date).format('DD/MM/YYYY')}</Text>
          <Text>Note : {film.vote_average} /10</Text>
          <Text>Nombre de vote : {film.vote_count}</Text>
          <Text>Budget : {numeral(film.budget).format('0,0')} $</Text>
          <Text>Genre(s) : {film.genres.map(function(genre){
              return genre.name;
            }).join(" / ")}</Text>
          <Text>Companie(s) : {film.production_companies.map(function(companie){
              return companie.name;
            }).join(" / ")}</Text>
        </View>
      </ScrollView>
    )
  }
}

_shareFilm() {
  const {film}=this.state
  Share.share({ title: film.title, message: film.overview })
    .then(
      Alert.alert(
        'Succès',
        'Film partagé',
        [
          {text: 'OK', onPress: () => {}}
        ]
      )
    )
    .catch(err =>
      Alert.alert(
        'Échec',
        'Film non partagé',
        [
          {text: 'OK', onPress: () => {}}
        ]
      ))
}

_displayFloatingActionButton() {
  const {film}=this.state
  if (film != undefined && Platform.OS === 'android' ) {
    return (
      <TouchableOpacity
        style={styles.share_touchable_floatingactionbutton}
        onPress={() => this._shareFilm()}>
      <Image
        style={styles.share_image}
        source={require('../assets/images/ic_share.android.png')} />
      </TouchableOpacity>
    )
  }
}

  render() {
    console.log(this.props)
    Moment.locale('fr');
    return (
      <View style={styles.main_container}>
        {this._displayLoading()}
        {this._displayFilm()}
        {this._displayFloatingActionButton()}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  main_container: {
    flex: 1
  },
  loading_container: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
  },
  scrollview_container: {
    flex: 1
  },
  cover: {
    height: 190
  },
  titleText: {
    fontWeight: 'bold',
    fontSize: 30,
    margin: 10,
    textAlign: 'center',
    flexWrap: 'wrap'
  },
  descText: {
    margin: 15,
    fontSize: 15,
    fontStyle: 'italic',
    color: '#757575'
  },
  info: {
    margin: 15
  },
  favorite_container: {
    alignItems: 'center', // Alignement des components enfants sur l'axe secondaire, X ici
  },
  favorite_image: {
    width: 40,
    height: 40
  },
  share_touchable_floatingactionbutton: {
    position: 'absolute',
    width: 60,
    height: 60,
    right: 30,
    bottom: 30,
    borderRadius: 30,
    backgroundColor: '#e91e63',
    justifyContent: 'center',
    alignItems: 'center'
  },
  share_image: {
    width: 30,
    height: 30
  },
  share_touchable_headerrightbutton: {
    marginRight: 8
  }
})

const mapStateToProps = (state) => {
  return {
    favoritesFilm: state.favoritesFilm
  }
}

export default connect(mapStateToProps)(FilmDetail)