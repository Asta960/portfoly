export async function loadTodoItems({ owner }) {
  const response = await fetch(`http://localhost:3000/api/todos?owner=${owner}`);
  const data = await response.json();
  return data;
}

export async function addTodoTask({ name, owner, done }) {
  const response = await fetch('http://localhost:3000/api/todos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, owner, done }),
  });
  return await response.json();
}

export async function markTodoAsDone(item, owner) {
  let done = '';
  let list = await loadTodoItems({ owner });
  for (let i of list) {
    if (i.id == item.id) {
      done = !(i.done);
      break
    };
  };
  const response = await fetch(`http://localhost:3000/api/todos/${item.id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ done: done })
  });
  const data = await response.json();
}

export async function deleteTodoItem(item, owner) {
  const response = await fetch(`http://localhost:3000/api/todos/${item.id}`, {
    method: 'DELETE',
  });
}

export async function getPastTask(owner) {
  let list = loadTodoItems(owner);
  let flag = false;
  if (list) flag = true;
  return flag
}
