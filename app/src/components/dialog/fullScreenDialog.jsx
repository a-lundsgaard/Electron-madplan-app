import React, {useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import PlusButton from 'Components/buttons/plusButton/plusButton'

import SnackBar from "Components/snackbar/snackbar";
import TextField from '@material-ui/core/TextField';
import NumberPicker from 'Components/numberPicker/numberPicker1/numberPicker.jsx'
import Grid from '@material-ui/core/Grid';
import ImageUploader from 'Components/upload/uploadImage.jsx'

import CircularLoader from 'Components/loaders/circular/circularLoader'

import {HTTP} from '../../HTTP/http';



import SaveIcon from '@material-ui/icons/Save';


const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
    background: '#c24e00' // dark orange
  },

  mainGrid: {
    marginTop: -20
  },

  importButton: {
    marginLeft: 20
  },  
  
  urlField: {
    marginBottom: 20
  },

  imageInputField: {
    marginTop: 20,
    maxWidth: 280,
    width: "100%"
  },


  importUrlInput: {
    maxWidth: 500,
    width: "100%"
  },

  textAreaGrid: {
    marginTop: 32,
  },

  ImageUploader: {
    cursor: 'pointer'
  },


  ingredientTextField: {
    maxWidth: 300,
    width: "100%"
  },

  prepareTextField: {
    minWidth: 400,
    
  },

  numPicker: {
    marginTop: 20
  },

  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});




export default function FullScreenDialog({onReceiptSave}) {

  const classes = useStyles();
  const [open, setOpen] = useState(false); // set false when not testing

  // state for input fields
  const [state, setState] = useState({
    //image: 'https://aosa.org/wp-content/uploads/2019/04/image-placeholder-350x350.png',
    numPicker: 1
  }); 

  // displaying server messages
  const [message, setMessage] = useState({});

  // for circular loader when scraping receipt
  const [isLoading, setLoading] = useState(false);


  const [inputError, setInputError] = useState({
    importUrl: false,
    title: false,
    ingredients: false
  }); 



 /* useEffect(()=> {
    setState({...state, importUrl: 'tester'})
  }, [])*/



  const onInputchange = (event) => {
    // sets state from by deriving the name of the input field when user entering input
    setState({
      ...state,
      [event.target.name]: event.target.value
    });
    // removes error when text field is edited
    setInputError({...inputError, [event.target.name]: false});
  }

  const onNumPickerChange = (value) => {
    //setPersons(value)
   setState({
      ...state,
      numPicker: value
    });
  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {

    // Clearing states and messages
    setState({
      numPicker: 1
    })
    setMessage({})
    setOpen(false);
  };

  const handleImportUrl = () => {

    if(isLoading) return;

    if(!state.importUrl) {
      setInputError({...inputError, importUrl: true})
      return;
    } 

    setLoading(true)

    const requestBody = `mutation {
        scrapeReceipt(crawlerInput: "${state.importUrl}") {
          _id
          name
          text
          persons
          source
          text
          image
          ingredients {
            name
            unit
            quantity
          }
        }
      }`

    HTTP.post(requestBody)
    .then(res => {
      setLoading(false)
      setMessage({msg: `Opskrift blev hentet`, type: 'success', key: Math.random()})
      const { data: { scrapeReceipt: {_id, name, text, persons, source, image, ingredients }} } = res;

      let formattedAttachments = '';
      ingredients.map(ingredient => {
        formattedAttachments += `${ingredient.quantity || ''} ${ingredient.unit || ''} ${ingredient.name} \n`.trimLeft();      
      });

      setState({
        ...state,
        numPicker: persons,
        title: name,
        receipt: text,
        image: image,
        source: source,
        ingredients: formattedAttachments
      })

      // Removing alle red borders from input fields, when these are filled out automatically by scraper
      let obj;
      Object.keys(inputError).forEach(key => obj = {...obj, [key] : false })
      setInputError(obj)

    })
    .catch(error => {
    //  console.log(error)
      setMessage({msg: error.message, type: 'error', key: Math.random()}) 
    })
  }
  

  const handleSaveReceipt = () => {

    // checks for empty required fields upon saving a receipt
    console.log(state);

    let errorState = inputError, stopScript = false;
    Object.keys(inputError)
    .forEach((key)=> {
      if(key === 'importUrl') return;
      if(!state[key]) {
        errorState = {...errorState, [key]: true}
         stopScript = true;
        }
    })
    setInputError(errorState);
    if(stopScript) return;


    // Script to transform ingredients into array with name, unit and quantity
    const ingrArray = state.ingredients.split('\n').filter(line => line !=="");
    console.log(ingrArray)

    const transformedIngredients = ingrArray
      .map( (str, i)=> {
        let strArr = str.trimEnd().split(' ');
        let quantity = strArr.find(el => Number(el)) || null;
        let unit = strArr.find(el => el.includes('*')) || null;

        // removes quantity and unit from array and leaves name
        [quantity, unit].forEach((item)=>{
          const index = strArr.indexOf(item);
          if(index != -1 ) {
            //console.log('Splicing element: ' + strArr[index])
            strArr.splice(index, 1);
          } 
        })

        return { name: strArr.join(' ').toLowerCase(), unit: unit, quantity: parseFloat(quantity)}
      })

      console.log(transformedIngredients);

      // Using variables. Variables type must be of same type as defined in Schema incl the "!"
      const query = `mutation($name: String!, $type: String!, $persons: Float!, $source: String,  $text: String!, $image: String, $ingredients: [ingredientInput]!) {
          createReceipt(receiptInput: {
            name: $name, 
            type: $type, 
            persons: $persons,
            source: $source,
            text: $text, 
            image: $image
            ingredients: $ingredients }) {
            _id
            name
            text
            persons
            source
            text
            image
            ingredients {
              name
              unit
              quantity
            }
          }
        }`
      
      
      const {title, type, numPicker, source, receipt, image} = state;

      const variables = {
        name: title,
        type: 'veg',
        persons: numPicker,
        source: source,
        text: receipt, // text is required
        image: image,
        ingredients: transformedIngredients
      }


      HTTP.post(query, '', variables)
      .then(res => {
        setMessage({msg: `${state.title} er gemt`, type: 'success', key: Math.random()})
        onReceiptSave(Date.now())
      })
      .catch(error => {
      //  console.log(error)
        setMessage({msg: error.message, type: 'error', key: Math.random()}) 
      })
    
  }

  return (
    <div>
      <span onClick={handleClickOpen}><PlusButton/></span>
      <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              Tilføj ny opskrift
            </Typography>
            <Button autoFocus color="inherit" onClick={handleSaveReceipt}>
              gem
            </Button>
          </Toolbar>
        </AppBar>

        <List>
          <ListItem className={classes.urlField}>
          <TextField name="importUrl" id="standard-basic" label="Web-adresse*" 
            error={inputError.importUrl}
            onChange={onInputchange}
            className={classes.importUrlInput}
            value={state.importUrl}
          />
            <Button className={classes.importButton} variant="contained" onClick={handleImportUrl}>
                Importér opskrift
            </Button>
            <span className={classes.importButton}>{ isLoading ? <CircularLoader/> : null}</span>
              
          </ListItem>
          </List>

          <Divider/>


        <Grid
          container
          direction="row"
          justify="flex-start"
          alignItems="flex-start"
          spacing={8}
          className={classes.mainGrid}
        >

          <Grid item >
          <List>
          <div>

          <ListItem className={classes.numPicker}>
                <NumberPicker 
                  name="numPicker" 
                  onChange={(value) => onNumPickerChange(value)}
                  value={state.numPicker}
                />
            </ListItem>
            
            <ListItem>
              <TextField name="title" id="standard-basic" label="Titel*" 
              error={inputError.title}
              onChange={onInputchange}
              value={state.title}
              InputLabelProps={{ shrink: state.title ? true : false }}
              />
            </ListItem>

            <ListItem>
              <TextField name="source" id="standard-basic" label="Kilde" 
                onChange={onInputchange}
                value={state.source}
                InputLabelProps={{ shrink: state.source ? true : false }}

              />
            </ListItem>
           

          </div>
          </List>

          </Grid>

          <Grid item className={classes.textAreaGrid}>
          <TextField
                name="ingredients"
                className={classes.ingredientTextField}
                label="Ingredienser*"
                multiline
                rows={20}
                rowsMax={99}
                variant="outlined" 
                size="medium"
                error={inputError.ingredients}
                onChange={onInputchange}
                helperText= 'Indtast * ved angivelse af enheder, f.eks. stk*'
                value={state.ingredients}
                InputLabelProps={{ shrink: state.ingredients ? true : false }}

              />
          </Grid>

          <Grid item className={classes.textAreaGrid}>

          <TextField
                name="receipt"
                className={classes.prepareTextField}
                label="Tilberedning"
                multiline
                rows={20}
                rowsMax={99}
                variant="outlined" 
                size="medium"
                onChange={onInputchange}
                value={state.receipt}
                InputLabelProps={{ shrink: state.receipt ? true : false }}

              />
          </Grid>

          <Grid item className={classes.textAreaGrid}>
            <ImageUploader name="receipt" src={state.image}/>
            <TextField name="image" id="standard-basic" label="Billede"
                className={classes.imageInputField}
                onChange={onInputchange}
                value={state.image}
                InputLabelProps={{ shrink: state.image ? true : false }}
                />
          </Grid>

        </Grid>
        { message.msg ? <SnackBar key={message.key} type={message.type} message={message.msg}/> : null}

      </Dialog>
    </div>
  );
}