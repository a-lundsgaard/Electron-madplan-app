import React, { useEffect, useContext } from 'react';
import TodoApp from './TodoApp';
import useStyles from '../styles/AppStyles';
import Paper from '@material-ui/core/Paper';
//import Stepper from 'Components/stepper/linearStepper'

import Stepper from './stepper/linearStepper';



function App({ ingredientArray }) {
  const classes = useStyles();

  return (

    <Paper className={classes.paper} elevation={3}>
      <div className={classes.App}>
        <header className={classes.header}>
          <h1>Indkøb</h1>
        </header>

        <TodoApp ingredientArray={ingredientArray} />
      </div>
    </Paper>
  );
}

export default App;
