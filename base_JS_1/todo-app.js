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

  function createTodoItem ({name, done}) {
    let item = document.createElement('li');
    let buttonGroup = document.createElement('div');
    let doneButton = document.createElement('button');
    let deleteButton = document.createElement('button');
    
    item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
    if (done) {
      item.classList.add('list-group-item-success')
    }
    item.textContent =  name;
    buttonGroup.classList.add('btn-group', 'btn-group-sm');
    doneButton.classList.add('btn', 'btn-success');
    doneButton.textContent = 'Готово';
    deleteButton.classList.add('btn', 'btn-danger');
    deleteButton.textContent = 'Удалить';


    buttonGroup.append(doneButton);
    buttonGroup.append(deleteButton)
    item.append(buttonGroup);


    return {
      item,
      doneButton,
      deleteButton,
    }
  }

  let todoArr = []

  function createTodoApp(container, title = 'Список дел', listName) {

    let todoAppTitle = createAppTitle(title);
    let todoItemForm = createTodoItemForm();
    let todoList = createTodoList();

    container.append(todoAppTitle);
    container.append(todoItemForm.form);
    container.append(todoList);

    todoArr = getTodoFromLocalStorage(listName); // получаем данные из localStorage

    for ( let i = 0; i < todoArr.length; i++) {
      let itemData = todoArr[i];
      let todoItemFromLocalStorage = createTodoItem(itemData)
      setButtonFromLocal(todoItemFromLocalStorage, itemData, listName)
      todoList.append(todoItemFromLocalStorage.item)
    }

    function setButtonFromLocal (todoItemFromLocalStorage, itemData, listName) {
      
      todoItemFromLocalStorage.doneButton.addEventListener('click', function() {
        todoItemFromLocalStorage.item.classList.toggle('list-group-item-success');

        // меняем статус задачи для кнопки "готово"
        for(let i = 0; i < todoArr.length; i++) {
          object = todoArr[i]
          if(object.id === itemData.id) {
            object.done = !object.done;
            saveTodoToLocalStorage(listName, todoArr); // обновляем массив и сохраняем
            break;
            
          }
        }
      });

      todoItemFromLocalStorage.deleteButton.addEventListener('click', function() {
        
        // удаляем объект не только из списка DOM, но из массива объектов
        if (confirm('Вы уверены?')) {
          todoItemFromLocalStorage.item.remove()
        }
        
        for( let i = 0; i < todoArr.length; i++) {
          object = todoArr[i]
          if(object.id === itemData.id) {
          todoArr.splice(i, 1)
          saveTodoToLocalStorage(listName, todoArr); // обновляем массив и сохраняем его
          break;
          }
        }
      });
    }


    todoItemForm.form.addEventListener('submit', function(e) {
      // эту строчку добавили, чтобы предотвратить стандартное действие браузера
      // т.е. страница не будет перезагружаться при отправке формы
      e.preventDefault();

      // игнорируем создание элемента, если пользователь ничего не ввёл
      if (!todoItemForm.input.value) {
        return;
      };

      let newTodoItem = { 
        name: todoItemForm.input.value,
        done: false,
        id: generateId()
      }

      todoArr.push(newTodoItem); // добавляем дело в массив
      saveTodoToLocalStorage(listName, todoArr); // cохраняем список дел в LocalStorage

      let todoItem = createTodoItem(newTodoItem);
      todoList.append(todoItem.item);  // Создаем и добавляем в список новое дело из поля ввода
      todoItemForm.input.value = '';  // Cтираем значение в input, чтобы значение не сохранялось далее

      // добавляем обработчики к кнопкам 

      todoItem.doneButton.addEventListener('click', function() {
        todoItem.item.classList.toggle('list-group-item-success');

        // меняем статус задачи для кнопки "готово"
        for(let i = 0; i < todoArr.length; i++) {
          object = todoArr[i]
          if(object.id === newTodoItem.id) {
            object.done = !object.done;
            saveTodoToLocalStorage(listName, todoArr); // обновляем массив и сохраняем
            break;
            
          }
        }
      });

      todoItem.deleteButton.addEventListener('click', function() {
        
        // удаляем объект не только из списка DOM, но из массива объектов
        if (confirm('Вы уверены?')) {
          todoItem.item.remove()
        }
        
        for( let i = 0; i < todoArr.length; i++) {
          object = todoArr[i]
          if(object.id === newTodoItem.id) {
          todoArr.splice(i, 1)
          saveTodoToLocalStorage(listName, todoArr); // обновляем массив и сохраняем его
          break;
          }
        }
      });
    });
  }

  // функция принимает ключ и данные, переводит в формат строки JSON и сохраняет в LocalStorage
  function saveTodoToLocalStorage (key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  // Функция принимает ключ, извлекает данные с этим ключом и возвращает данные в виде объекта, если данных нет, вернёт пустой массив
  function getTodoFromLocalStorage(key) {
    data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }

  // генерируем ID 
  function generateId () {
    if (todoArr.length > 0) {
      let maxId = todoArr.reduce(
        (accumulator, currentValue) => currentValue.id > accumulator ? currentValue.id : accumulator, todoArr[0].id);
        return maxId +1;
    }
    return 1;
  }

  window.createTodoApp = createTodoApp;

})();