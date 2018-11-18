// Navigation/Navigation.js

import { createStackNavigator } from 'react-navigation'
import Search from '../Components/Search'
import FilmDetail from '../Components/FilmDetail';

const SearchStackNavigator = createStackNavigator({
  Search: { // Ici j'ai appelé la vue "Search" mais on peut mettre ce que l'on veut. C'est le nom qu'on utilisera pour appeler cette vue
    screen: Search, //screen est le nom de la route
    navigationOptions: {
      title: 'Recherche'
    }
  },
  FilmDetail: {
    screen: FilmDetail
  }
})

export default SearchStackNavigator