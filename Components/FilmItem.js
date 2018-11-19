// Components/FilmItem.js

import React from 'react'
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native'
import { getImageFromAPI } from '../API/TMDBApi'

class FilmItem extends React.Component {

  _displayFavoriteImage() {
    if(this.props.isFilmFavorite) {
      return (
      <Image
        style={styles.favorite_image}
        source={require ('../assets/images/favorite.png')}
      />
    )
  }
}

  render() {
    const { film, displayDetailForFilm } = this.props
    return (
      <TouchableOpacity style={styles.mainContainer} onPress={() => displayDetailForFilm(film.id)}>
        <Image
          style={styles.cover}
          source={{uri: getImageFromAPI(film.poster_path)}}
        />
        <View style={styles.contentContainer}>
            <View style={styles.headerContainer}>
              {this._displayFavoriteImage()}
              <Text style={styles.titleText}>{film.title}</Text>
              <Text style={styles.noteText}>{film.vote_average}</Text>
            </View>
            <View style={styles.descriptionContainer}>
                <Text style={styles.descText} numberOfLines={6}>{film.overview}</Text>
            </View>
            <View style={styles.dateContainer}>
                <Text style={styles.dateText}>Sorti le {film.release_date}</Text>
            </View>
        </View>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
    mainContainer: {
        height: 190,
        flexDirection: 'row',
        margin: 10,
        borderWidth: 1,
        borderColor: '#C6C6C6',
        backgroundColor: '#666666'
      },
      cover: {
        width: 120,
        height: 188,
        marginRight: 5,
      },
      contentContainer: {
        flex: 1,
        margin: 5
      },
      headerContainer: {
        flex: 3,
        flexDirection: 'row'
      },
      titleText: {
        fontWeight: 'bold',
        fontSize: 16,
        flex: 2,
        flexWrap: 'wrap',
        paddingRight: 5,
        color: '#fff'
      },
      noteText: {
        flex: 1,
        textAlign: 'right',
        fontWeight: 'bold',
        fontSize: 26,
        color: '#fff'
      },
      favorite_image: {
        width: 20,
        height: 20
      },
      descriptionContainer: {
        flex: 7
      },
      descText: {
        fontStyle: 'italic',
        color: '#fff'
      },
      dateContainer: {
        flex: 1
      },
      dateText: {
        textAlign: 'right',
        fontSize: 14,
        color: '#fff'
      }

})

export default FilmItem