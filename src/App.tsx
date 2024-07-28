import './App.css'
import { observable } from '@legendapp/state'
import { syncedCrud } from '@legendapp/state/sync-plugins/crud'
import { For, Memo, useSelector } from '@legendapp/state/react'

type Todo = {
  id: string;
  title: string;
}

const todos = [
  { id: '1', title: 'todo 1' },
  { id: '2', title: 'todo 2' },
  { id: '3', title: 'todo 3' },
]

async function getTodos(): Promise<Todo[]> {
  console.log('getTodos')
  await new Promise(resolve => setTimeout(resolve, 1000))
  return todos;
}

async function createTodo(todo: Todo): Promise<Todo> {
  console.log('createTodo', todo)
  await new Promise(resolve => setTimeout(resolve, 1000))
  todos.push(todo)
  return todo;
}

async function updateTodo(todo: Todo): Promise<Todo> {
  console.log('updateTodo', todo)
  await new Promise(resolve => setTimeout(resolve, 1000))
  const index = todos.findIndex(t => t.id === todo.id)
  todos[index] = todo
  return todo;
}

async function deleteTodo(todo: Todo): Promise<void> {
  console.log('deleteTodo', todo)
  await new Promise(resolve => setTimeout(resolve, 1000))
  const index = todos.findIndex(t => t.id === todo.id)
  todos.splice(index, 1);
}

const todos$ = observable(syncedCrud({
  list: getTodos,
  create: createTodo,
  update: updateTodo,
  delete: deleteTodo,
}));


function App() {
  const loading = useSelector(() => todos$.get() === undefined);
  
  console.log('rendering', Date.now());

  return (
    <div>
      <h1>Todos loading {loading ? 'true' : 'false'}</h1>
      <ul>
        <For
          each={todos$}
          item={(prop) => {
            return (
              <li>
                <Memo>{prop.item$.title}</Memo>

                <button onClick={() => {
                    prop.item$.assign({
                      title: 'new title ' + Math.floor(Math.random() * 100).toString()
                    })
                  }}
                >
                  Update todo
                </button>

                <button onClick={() => {
                  prop.item$.delete()
                }}>
                  Delete todo
                </button>
              </li>
            )
          }}
        />
      </ul>

      <button onClick={() => {
        todos$.assign({
          [Math.random().toString()]: {
            id: Math.random().toString(),
            title: 'new todo'
          }
        })
      }}>
        Add todo
      </button>
    </div>
  )
}

export default App
