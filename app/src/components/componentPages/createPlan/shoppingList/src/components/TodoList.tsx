import zIndex from '@material-ui/core/styles/zIndex';
import React, { useContext, useEffect, useState } from 'react';
import { TodosContext, DispatchContext } from '../contexts/todos.context.jsx';
import Todo from './Todo.jsx';



function TodoList() {

  const todos = useContext(TodosContext);

  return (
    <ul style={{ paddingLeft: 10, width: "95%", overflowY: 'scroll', maxHeight: 'calc(75vh - 50px - 50px)' }}>
      {
    /*     todos.map((todo, index) => (
          <Todo key={index+300} {...todo} />
        )) */
        todos.map((todo, index) => {          
          return <Todo key={todo.task} {...todo} />
        })
      }
    </ul>
  );
}

export default TodoList;