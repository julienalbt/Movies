// Components/FilmDetail.js

import React from 'react'
import { StyleSheet, View, Text, ActivityIndicator, ScrollView, Image, TouchableOpacity } from 'react-native'
import { getFilmDetailFromApi } from '../API/TMDBApi'
import { getImageFromAPI } from '../API/TMDBApi'
import Moment from 'moment'
import numeral from 'numeral'
import { connect } from 'react-redux'

class FilmDetail extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      film: undefined, // Pour l'instant on n'a pas les infos du film, on initialise donc le film à undefined.
      isLoading: true // A l'ouverture de la vue, on affiche le chargement, le temps de récupérer le détail du film
    }
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

  componentDidMount() {
    getFilmDetailFromApi(this.props.navigation.state.params.idFilm).then(data => {
      this.setState({
        film: data,
        isLoading: false
      })
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

  render() {
    console.log(this.props)
    Moment.locale('fr');
    return (
      <View style={styles.main_container}>
        {this._displayLoading()}
        {this._displayFilm()}
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
  }
})

const mapStateToProps = (state) => {
  return {
    favoritesFilm: state.favoritesFilm
  }
}

export default connect(mapStateToProps)(FilmDetail)