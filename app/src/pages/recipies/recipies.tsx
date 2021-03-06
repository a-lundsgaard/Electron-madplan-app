import React, { Fragment, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { red } from '@material-ui/core/colors';
import Grid from '@material-ui/core/Grid';

import listenToSearchInput from 'Redux/helpers/subscribe'
import HTTP from '../../HTTP/http';

import ReceiptCard from '../../components/shared/card/recipeCard.jsx';

import CreateRecipeDialog from '../../components/componentPages/createRecipe/index/createRecipeDialog.jsx';
import ReceiptSceletonLoader from '../../components/shared/loaders/receiptSceletonLoader';

import useStyles from './styles';

import SnackBar from "../../components/shared/snackbar/snackbar.jsx";




export default function SpacingGrid({ onClick, dialogOpen, ...props }) {
  // const [spacing, setSpacing] = React.useState(2);
  const classes = useStyles();

  const [searchString, setSearchString] = useState(window.store.getState().searchInput); // getting search bar input
  const [recipes, setRecipes] = useState([]);

  const [recipesInSearch, setRecipesInSearch] = useState([])

  const [isReceiptSavedOrDeleted, setReceiptSaved] = useState('') // letting us know when a receipt is saved to rerender dishes
  const [isLoading, setIsLoading] = useState(false) // letting us know when a receipt is saved to rerender dishes
  const [clickedDishId, setClickedDishId] = useState('');

  const recipeCount = parseInt(localStorage.getItem('recipeCount')) || 0;

  const [message, setMessage] = useState({});


  function getRecipes(showLoading: boolean) {

    if(showLoading) setIsLoading(true)

    const token = localStorage.getItem('token');
    const requestBody = HTTP.recipes.getRecipesAndReturnFields('_id name text image createdAt ingredients {name unit quantity} persons', { token: token })

    HTTP.post(requestBody)
      .then(res => {
        setRecipes(res.data.receipts);
        setRecipesInSearch(res.data.receipts);
        localStorage.setItem('recipeCount', JSON.stringify(res.data.receipts.length)) // for loading skeleton recipes
        setIsLoading(false)
      })
      .catch(e =>
        console.log(e)
      )
  }

  const handleRecipeCardClick = (id) => {
    //console.log('ID of clicked dish: ' + id)
    setClickedDishId(id);
    onClick(id)
  }

  function recipeOnPlan(id) {
    return props.recipies ? props.recipies.find((recipe) => recipe._id === id) : false;
  }

  useEffect(() => {
    listenToSearchInput(setSearchString) // sets up redux listener on the search input
  }, [])


  useEffect(() => {
    console.log(searchString);
  }, [searchString])

  useEffect(() => {
    console.log('Found receipts:')
    console.log(recipes);
  }, [recipes])


  useEffect(() => {
    if (!searchString) {
      setRecipesInSearch(recipes);
      return;
    }
    const filteredRecipes = recipes.filter((recipe) => {
      const ingredientsString = recipe.ingredients.reduce((a, b) => {
        a += b.name
        return a
      }, '')

      if (searchString) {
        return recipe.name.toLowerCase().includes(searchString) || ingredientsString.includes(searchString)
      }
    })
    setRecipesInSearch(filteredRecipes)

  }, [searchString])


  useEffect(() => {
    if(!isReceiptSavedOrDeleted) getRecipes(true)
  }, [isReceiptSavedOrDeleted])

  const handleRecipeSave = (id: string) => {
    setMessage({ msg: `Retten blev gemt`, type: 'success', key: Math.random() })
    setReceiptSaved(id)
  }

  const handleRecipeDeletion = (id: string) => {
    setMessage({ msg: `Retten blev slettet`, type: 'success', key: Math.random() })
    setReceiptSaved(id)
  }

  // const [expanded, setExpanded] = React.useState(false);

  /*const handleExpandClick = () => {
    setExpanded(!expanded);
  };*/

  return (
    <Fragment>

      <Grid container className={classes.root} justify="center" >
        <Grid item xs={10}>

          <Grid container justify="center" spacing={5}>
            {
              isLoading ?
                Array(recipeCount).fill(recipeCount)
                  .map((receipt, index) => (
                    <Grid key={index} item>
                      <ReceiptSceletonLoader />
                    </Grid>))
                :
                recipesInSearch.map((recipe, index) => {
                  return <Grid
                    key={recipe._id}
                    item>
                    <ReceiptCard
                      recipeOnPlan={recipeOnPlan(recipe._id)}
                      recipe={recipe}
                      clikedDish={id => handleRecipeCardClick(id)}
                      visitFromCreatePlan={props.visitFromCreatePlan}
                      dialogOpen={bool => dialogOpen(bool)}
                      onRecipeDelete={id => handleRecipeDeletion(id) }
                    />
                  </Grid>
                })}

          </Grid>

        </Grid>
      </Grid>

      <div className={classes.addReceiptButton}>
        <CreateRecipeDialog onReceiptSave={(value) => handleRecipeSave(value)} />
      </div>

      {message.msg ? <SnackBar key={message.key} type={message.type} message={message.msg} /> : null}

    </Fragment>
  );
}