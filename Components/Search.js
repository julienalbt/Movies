// Components/Search.js

import React from 'react'
import { StyleSheet, View, TextInput, Button, Text, FlatList, ActivityIndicator } from 'react-native'
import FilmList from './FilmList'
import { getFilmsFromApiWithSearchedText } from '../API/TMDBApi'

class Search extends React.Component {

  constructor(props) {
    super(props)
    this.searchedText = ""
    this.page = 0
    this.totalPages = 0
    this.state = {
      films: [],
      isLoading: false
    }
    this._loadFilms = this._loadFilms.bind(this) // fonction loadFilm bindé
  }

  _loadFilms() {
    if (this.searchedText.length > 0) {
      this.setState({ isLoading: true })
      getFilmsFromApiWithSearchedText(this.searchedText, this.page+1).then(data => {
          this.page = data.page
          this.totalPages = data.total_pages
          this.setState({
            films: [ ...this.state.films, ...data.results ],
            isLoading: false
          })
      })
    }
  }

  _searchTextInputChanged(text) {
    this.searchedText = text
  }

  _searchFilms() {
    this.page = 0
    this.totalPages = 0
    this.setState({
      films: [],
    }, () => {
        this._loadFilms()
    })
  }

  _displayLoading() {
    if (this.state.isLoading) {
      return (
        <View style={styles.loading_container}>
          <ActivityIndicator size='large' />
        </View>
      )
    }
  }

  render() {
    return (
      <View style={styles.mainContainer}>
        <TextInput
          style={styles.textinput}
          placeholder='recherche un film...'
          onChangeText={(text) => this._searchTextInputChanged(text)}
          onSubmitEditing={() => this._searchFilms()}
        />
        <Button style={{ height: 50 }} title='Rechercher' onPress={() => this._searchFilms()}/>
        <FilmList
          films={this.state.films} // C'est bien le component Search qui récupère les films depuis l'API et on les transmet ici pour que le component FilmList les affiche
          navigation={this.props.navigation} // Ici on transmet les informations de navigation pour permettre au component FilmList de naviguer vers le détail d'un film
          loadFilms={this._loadFilms} // _loadFilm charge les films suivants, ça concerne l'API, le component FilmList va juste appeler cette méthode quand l'utilisateur aura parcouru tous les films et c'est le component Search qui lui fournira les films suivants
          page={this.page}
          totalPages={this.totalPages} // les infos page et totalPages vont être utile, côté component FilmList, pour ne pas déclencher l'évènement pour charger plus de film si on a atteint la dernière page
          favoriteList={false}
        />
        {this._displayLoading()}
      </View>
    )
  }
}

/*
Pour utiliser plusieurs style sur un component :
<TextInput style={[styles.textinput1, styles.textinput2]} placeholder='Titre du film'/>
ou
<TextInput style={[styles.textinput, { marginBottom: 10 }]} placeholder='Titre du film'/>
*/

const styles = StyleSheet.create({

  mainContainer: {
    flex: 1,
    backgroundColor: '#2B2B2B'
  },

  textinput: {
    marginLeft: 5,
    marginRight: 5,
    fontSize: 18,
    color: '#fff',
    marginTop: 20,
    marginBottom: 20,
    height : 35,
    borderColor: '#C6C6C6',
    borderWidth: 1,
    paddingLeft: 5,
    textAlign: 'center'
  },
  loadingContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 75,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
  }

})

export default Search