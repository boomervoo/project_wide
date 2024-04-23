(function() {


  function createAppTitle(title) {
    let appTitle = document.createElement('h2')
    appTitle.innerHTML = title;
    return appTitle;
  }

  function createTodoItemForm () {
    let form = document.createElement('form');
    let input = document.createElement('input');
    let buttonWrapper = document.createElement('div');
    let button = document.createElement('button');

    form.classList.add('input-group', 'mb-3');
    input.classList.add('form-control');
    input.placeholder = ('Введите название нового дела');
    buttonWrapper.classList.add('input-group-append');
    button.classList.add('btn', 'btn-primary');
    button.textContent = 'Добавить дело';
    button.disabled = true;

    buttonWrapper.append(button);
    form.append(input);
    form.append(buttonWrapper);

    button.disabled = !input.value.trim();

    input.addEventListener('input', function(e) {
      button.disabled = !input.value.trim();
    })

    return {
      form,
      input,
      button,
    };
  }

  function createTodoList() {
    let list = document.createElement('ul');
    list.classList.add('list-group');
    return list;
  }

  function createTodoItemElement (todoItem, { onDone, onDelete}) {
    const doneClass = "list-group-item-success"

    let item = document.createElement('li');
    let buttonGroup = document.createElement('div');
    let doneButton = document.createElement('button');
    let deleteButton = document.createElement('button');
    
    item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
    if (todoItem.done) {
      item.classList.add(doneClass)
    }

    item.textContent = todoItem.name;
    buttonGroup.classList.add('btn-group', 'btn-group-sm');
    doneButton.classList.add('btn', 'btn-success');
    doneButton.textContent = 'Готово';
    deleteButton.classList.add('btn', 'btn-danger');
    deleteButton.textContent = 'Удалить';

    // добавляем обработчики к кнопкам 

    doneButton.addEventListener('click', function() {
      onDone({ todoItem, element: item})
      item.classList.toggle(doneClass, todoItem.done);
    });

    deleteButton.addEventListener('click', function() {
      
      // удаляем объект не только из списка DOM, но из массива объектов
      onDelete({ todoItem, element: item})
    });

    buttonGroup.append(doneButton);
    buttonGroup.append(deleteButton)
    item.append(buttonGroup);


    return item;
  }

  async function createTodoApp(container, title = 'Список дел', listName) {

    let todoAppTitle = createAppTitle(title);
    let todoItemForm = createTodoItemForm();
    let todoList = createTodoList();

    const handlers = {
      onDone({ todoItem }) {
        todoItem.done = !todoItem.done;
        fetch(`http://localhost:3000/api/todos/${todoItem.id}`, {
          method: 'PATCH',
          body: JSON.stringify({ done: todoItem.done }),
          headers: {
            'Content-Type': 'application/json',
          }
        });
      },
      onDelete({ todoItem, element }) {
        if(!confirm('Вы уверены?')) {
          return;
        }
        element.remove();
        fetch(`http://localhost:3000/api/todos/${todoItem.id}`, {
          method: 'DELETE',
          body: JSON.stringify({ done: todoItem.done }),
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
      }

    };

    container.append(todoAppTitle);
    container.append(todoItemForm.form);
    container.append(todoList);

    // Отправляем запрос на список всех дел

    const response = await fetch('http://localhost:3000/api/todos');
    const todoItemsList = await response.json();

    todoItemsList.forEach(todoItem => {
      const todoItemElement = createTodoItemElement(todoItem, handlers);
      todoList.append(todoItemElement);
    });

    todoItemForm.form.addEventListener('submit', async e => {
      // эту строчку добавили, чтобы предотвратить стандартное действие браузера
      // т.е. страница не будет перезагружаться при отправке формы
      e.preventDefault();

      // игнорируем создание элемента, если пользователь ничего не ввёл
      if (!todoItemForm.input.value) {
        return;
      };

      const response = await fetch('http://localhost:3000/api/todos', {
        method: 'POST',
        body: JSON.stringify({
          name: todoItemForm.input.value.trim(),
          owner: 'Владимир',
        }),
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const todoItem = await response.json();
      
      const todoItemElement = createTodoItemElement(todoItem, handlers);
      
      todoList.append(todoItemElement);  // Создаем и добавляем в список новое дело из поля ввода
      todoItemForm.input.value = '';  // Cтираем значение в input, чтобы значение не сохранялось далее
    });
  }



  window.createTodoApp = createTodoApp;

})();