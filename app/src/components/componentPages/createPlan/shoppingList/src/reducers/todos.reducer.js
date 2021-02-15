//import uuid from 'uuid/v4';
//import { uuidv4 } from 'uuid';
import uuidv4 from "uuid/dist/v4";
import { useReducer } from "react";


import {
  ADD_TODO,
  REMOVE_TODO,
  TOGGLE_TODO,
  EDIT_TODO,
  ADD_INGREDIENT_ARRAY,
  COMPLETE_TODO,
  UNCOMPLETE_TODO,
  ADD_SALES_TO_TODO
} from '../constants/actions';

const reducer = (state, action) => {
  switch (action.type) {
    case ADD_TODO:

      /*let index = 0;
        const duplicate = state.find((obj, i) => {
          if (obj.task === action.task) {
            index === i;
            return true
          }
        }) || 0;
  
        
        if (duplicate) {
          //alert(JSON.stringify(duplicate));
          const duplicateObject = state[index];
          state[index] =  {...duplicateObject, quantity: 2 }
          return state;
        } */

      //const duplicate = state.find((obj, i) => obj.task === action.task);

      let index = 0;
      const duplicate = state.find((obj, i) => {
        if (obj.task === action.task) {
          index === i;
          return true
        }
      })

      if (duplicate) {
        //const newArr = state;
        //const duplicateObject = newArr[index];
        //state.splice(index, 1, { ...duplicate, quantity: 2 })
        //newArr[index] = { ...duplicateObject, quantity: 2 }
        return state;
        //return state
      } else {
        return [{ id: uuidv4(), task: action.task, quantity: action.quantity || 1, completed: false, initiator: 'USER' }, ...state];
      }



    case REMOVE_TODO:
      return state.filter(todo => todo.id !== action.id);
    case TOGGLE_TODO:
      return state.map(todo =>
        todo.id === action.id ? { ...todo, completed: !todo.completed } : todo
      );

    case COMPLETE_TODO:
      return state.map(todo =>
        todo.id === action.id ? { ...todo, completed: true } : todo
      );

    case UNCOMPLETE_TODO:
      console.log('THE REDUCER WAS CALLED')

      return state.map(todo =>
        ({ ...todo, completed: false })
      );
    case EDIT_TODO:
      //const initiator = action.initiator === 'REPLACEMENT_FROM_SALES' ? action.initiator : null;
      console.log('Edit reducer got called')
      return state.map(todo =>
        todo.id === action.id ? { ...todo, task: action.task, initiator: action.initiator, img: action.img, unit: action.unit, quantity: action.quantity } : todo
      );

    case ADD_SALES_TO_TODO:
      //const initiator = action.initiator === 'REPLACEMENT_FROM_SALES' ? action.initiator : null;
      console.log('Edit reducer got called')
      return state.map(todo =>
        todo.id === action.id ? { ...todo, img: action.img } : todo
      );
    case ADD_INGREDIENT_ARRAY:
      console.log('THE REDUCER WAS CALLED');

      // the array of new objects added from a meal
      const newIngredientArrayToAdd = action.task.map((ingr, index) => ({
        id: uuidv4(),
        task: `${ingr.name}`,
        unit: ingr.unit && ingr.unit.replace('*', ''),
        quantity: ingr.quantity,
        completed: false
      }))

      // makes an object from the state to make duplicate lookups
      const ingredientArrayAsObject = state.reduce((a, n) => {
        a[n.task] = n
        return a;
      }, {})

      // make duplicate lookups in the master object and adds quantity to duplicate item object, or adds the item to the master object if no duplicate
      newIngredientArrayToAdd.forEach((newIngredient) => {
        const foundDuplicate = ingredientArrayAsObject[newIngredient.task];
        const q2 = newIngredient.quantity || 1;
        if (foundDuplicate) {
          const q1 = foundDuplicate.quantity || 1; // if no quantity assigns one as quantity, so the quantity also increases when a duplicate is found
          ingredientArrayAsObject[newIngredient.task] = { ...foundDuplicate, quantity: q1 + q2 }
        } else {
          ingredientArrayAsObject[newIngredient.task] = newIngredient;
        }
      });

      // changes the object back to an array again and returns it
      const newState = Object.keys(ingredientArrayAsObject).map(key => ingredientArrayAsObject[key]);
      return newState;


    /*       return [...state, ...action.task.map((ingr, index) => ({
            id: uuidv4(),
            task: `${ingr.name}`,
            unit: ingr.unit && ingr.unit.replace('*', ''),
            quantity: ingr.quantity,
            completed: false
          }))] */


    default:
      return state;
  }
};


export default reducer;
