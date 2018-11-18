// Components/Search.js

import React from 'react'
import FilmItem from './FilmItem'
import { StyleSheet ,View, TextInput, Button, FlatList, ActivityIndicator } from 'react-native'
import { getFilmsFromApiWithSearchedText } from '../API/TMDBApi' // import { } from ... car c'est un export nommé dans TMDBApi.js

class Search extends React.Component {

  constructor(props) {
    super(props)
    this.searchedText = ""
    this.page = 0
    this.totalPages = 0
    this.state = { films: [], isLoading: false }
  }

  _loadFilms() {
    if (this.searchedText.length > 0) {
      this.setState({ isLoading: true }) // Lancement du chargement
      getFilmsFromApiWithSearchedText(this.searchedText, this.page+1).then(data => {
        this.page = data.page
        this.totalPages = data.total_pages
          this.setState({
            films: [ ...this.state.films, ...data.results ],
            isLoading: false // Arrêt du chargement
          })
      })
    }
}

_displayLoading() {
  if (this.state.isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size='large' color="#fff"/>
      </View>
    )
  }
}

_searchFilms() {
  this.page = 0
  this.totalPages = 0
  this.setState({
    films: [], },
    () => {
  console.log("Page : " + this.page + " / TotalPages : " + this.totalPages + " / Nombre de films : " + this.state.films.length)
  this._loadFilms()
})
}

_searchTextInputChanged(text) {
  this.searchedText = text
}

_displayDetailForFilm = (idFilm) => {
  console.log("Display film with id : " + idFilm)
  this.props.navigation.navigate("FilmDetail", { idFilm: idFilm })
}

  render() {
    console.log(this.state.isLoading)
    return (
      <View style={styles.mainContainer}>
      <TextInput style={styles.textinput}
      placeholder='Titre du film'
      onChangeText={(text) => this._searchTextInputChanged(text)}
      onSubmitEditing={() => this._searchFilms()}
      />
      <View style={styles.button}>
        <Button style={{ height: 50 }} title='Rechercher'
        onPress={() => this._searchFilms()}
        />
      </View>
      <FlatList
        data={this.state.films}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({item}) => <FilmItem film={item} displayDetailForFilm={this._displayDetailForFilm}/>}
        onEndReachedThreshold={1}
        onEndReached={() => {
          if(this.state.films.length > 0 && this.page < this.totalPages) {
          this._loadFilms()
          }
        }}
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

  button: {
    marginBottom: 20
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