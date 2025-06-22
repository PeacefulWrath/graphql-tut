import './App.css';
import { gql, useQuery, useMutation } from '@apollo/client';
import { useState } from 'react';

const query = gql`
query GetAllTodos {
  getToDos {
    id
   title
   completed
   user {
     name
     email
   }
  }
}
`

const ADD_TODO = gql`
  mutation addTodo($input: TodoInput!) {
    addTodo(input: $input) {
      id
      title
      completed
      user {
        name
        email
      }
    }
  }
`;

const UPDATE_TODO = gql`
  mutation updateTodo($id:ID!,$input: TodoInput2!) {
    updateTodo(id: $id, input: $input) 
  }
`;

const DELETE_TODO = gql`
  mutation deleteTodo($id:ID!) {
    deleteTodo(id: $id)
  }
`;

function App() {
  const {data, loading, refetch} = useQuery(query)
  const [newTitle, setNewTitle] = useState('');
  const [addTodo] = useMutation(ADD_TODO);
  const [updateTodo] = useMutation(UPDATE_TODO);
  const [deleteTodo] = useMutation(DELETE_TODO);

  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState('');
  
  const handleAdd = async () => {
    if (!newTitle.trim()) return alert('Title cannot be empty');
    await addTodo({
      variables: { input: { title: newTitle, completed: false, userId: '1' } },
    });
    setNewTitle('');
    refetch();
  };

  const handleUpdate = async (todo) => {
    if (!editingTitle.trim()) return alert('Title cannot be empty');
  
    const input = {
      title: editingTitle,
    };
  
    await updateTodo({
      variables: { id: todo.id, input },
    });
  
    setEditingId(null);
    setEditingTitle('');
    refetch();
  };
  

  const handleEdit=(todo)=>{
     setEditingId(todo.id)
     setEditingTitle(todo.title)
  }

  const handleDelete = async (delId) => {
    await deleteTodo({
      variables: { id: delId },
    });
    refetch();
  };



  if(loading){
    return <h1>loading....</h1>
  }
  return (
    <div className="App" style={{ padding: 20, maxWidth: 600, margin: 'auto' }}>
    <h1>Todo List</h1>

   
    <div style={{ marginBottom: 20 }}>
      <input
        type="text"
        placeholder="New todo title"
        value={newTitle}
        onChange={(e) => setNewTitle(e.target.value)}
        style={{ padding: 8, width: '70%', marginRight: 8 }}
      />
      <button onClick={handleAdd} style={{ padding: '8px 16px' }}>
        Add Todo
      </button>
    </div>

    <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          <th>Title</th>
          <th>User</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {data.getToDos.map((todo) => (
          <tr key={todo.id}>
              <td>
                {editingId === todo.id ? (
                  <input
                    type="text"
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                  />
                ) : (
                  todo.title
                )}
              </td>
            <td>{todo.user?.name || 'Unknown'}</td>
            <td>
              
            {editingId === todo.id ? (
                  <>
                    <button onClick={() => handleUpdate(todo)}>Save</button>
                    <button onClick={() => setEditingId(null)}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleEdit(todo)}>Edit</button>
                    <button onClick={() => handleDelete(todo.id)}>Delete</button>
                  </>
                )}

               
              
            </td>
          </tr>
        ))}
        {data.getToDos.length === 0 && (
          <tr>
            <td colSpan="3" style={{ textAlign: 'center' }}>
              No todos found.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
  );
}

export default App;
