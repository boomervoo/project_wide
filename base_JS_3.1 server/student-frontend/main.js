

let studentsList = [];

function getStudentItem(studentObj) {
  let row = document.createElement('tr');
  row.classList.add('row');
  row.id = `row-element-${studentObj.id}`

  // выводим ФИО

  let fullNameStudent = document.createElement('td');
  fullNameStudent.classList.add('td-col');
  fullNameStudent.textContent = `${studentObj.surname} ${studentObj.name} ${studentObj.lastname}`

  // `${studentObj.surname.toUpperCase() + studentObj.surname.slice(1).toLowerCase()}
  // ${studentObj.name.charAt(0).toUpperCase() + studentObj.name.slice(1).toLowerCase()} ${studentObj.lastname.charAt(0).toUpperCase() + studentObj.lastname.slice(1).toLowerCase()}`;

  row.appendChild(fullNameStudent);

  // выводим дату рождения и возраст

  let birthdayStudent = document.createElement('td');
  birthdayStudent.classList.add('td-col');

  function toStringDate(isoString) {
    const date = new Date(isoString);
    let day = date.getUTCDate().toString().padStart(2, '0');
    let month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    let year = date.getUTCFullYear();
    return `${day}.${month}.${year}`;
  }

  let date = new Date(studentObj.birthday)
  let dateFormatted = toStringDate(date);

  let ageStudents = getAge(date);
  birthdayStudent.textContent = `${dateFormatted} (${ageStudents} лет)`;
  row.appendChild(birthdayStudent);


  function getAge(yearDate) {
    let birthday = new Date(yearDate);
    let currentDate = new Date();
    let age = currentDate.getUTCFullYear() - birthday.getUTCFullYear();
    let month = currentDate.getUTCMonth() - birthday.getUTCMonth();
    if (month < 0 || (month === 0 && currentDate.getUTCDate() < birthday.getUTCDate())) {
      age--;
    }
    return age;
  }


  // выводим факультет

  let faculty = document.createElement('td');
  faculty.classList.add('td-col');
  faculty.textContent = studentObj.faculty
  row.appendChild(faculty);

  // выводим дату начала обучение и конец обучения

  let yearLearn = document.createElement('td');
  yearLearn.classList.add('td-col');

  let startLearn = parseInt(studentObj.studyStart, 10);
  let finishLearn = startLearn + 4;

  let currentDate = new Date();
  let currentYear = currentDate.getFullYear();
  let currentMonth = currentDate.getMonth();

  let yearDiff = currentYear - startLearn;
  let course = currentMonth >= 8 && currentYear < finishLearn ? yearDiff + 1 : yearDiff;

  let status = (currentYear > finishLearn) || (currentYear === finishLearn && currentMonth >= 8) ? "закончил" : `${course} курс`;

  yearLearn.textContent = `${startLearn} - ${finishLearn} (${status})`;

  row.append(yearLearn);

  // выводим кнопку удаления

  let btnDelete = document.createElement('button');
  btnDelete.classList.add('btn-delete');
  btnDelete.id = 'deleteButton'
  btnDelete.textContent = 'Удалить';

  btnDelete.addEventListener('click', e => {
    if(!confirm('Вы уверены?')) {
      return;
    }
    deleteStudent(studentObj.id, row)
  })
  // btnDelete.onclick = () => deleteStudent(studentObj.id, row)
  row.append(btnDelete);

  return row;
}

function renderStudentsTable(studentsArray) {

  const table = document.getElementById('t-body')
  table.innerHTML = ' ';

  studentsArray.forEach(student => {
    let studentRow = getStudentItem(student);
    const tableBody = document.getElementById('t-body');
    tableBody.append(studentRow);
  });
}

async function loadStudent () {
  const response = await fetch('http://localhost:3000/api/students');
  if (!response.ok) {
    throw new Error (`HTTP error! status ${response.status}`)
  }
  const studentsListServer = await response.json();
  studentsList = studentsListServer;

  renderStudentsTable(studentsList);
}

function createfilterStudents() {

  const title = document.createElement('h2')
  const containerFilter = document.getElementById('form')
  const filter = document.createElement('div');
  const inputName = document.createElement('input');
  const inputFaculty = document.createElement('input');
  const inputStartLearn = document.createElement('input');
  const inputEndLearn = document.createElement('input');

  inputName.classList.add('name-filter', 'input-filter');
  inputFaculty.classList.add('faculty-filter', 'input-filter');
  inputStartLearn.classList.add('learn-start-filter', 'input-filter');
  inputEndLearn.classList.add('end-learn-filter', 'input-filter');
  filter.classList.add('filter');
  title.classList.add('title-h2')

  inputName.placeholder = ('Введите ФИО');
  inputFaculty.placeholder = ('Введите факультет');
  inputStartLearn.placeholder = ('Введите год начала обучения');
  inputEndLearn.placeholder = ('Введите год конца обучения');
  title.textContent = "Фильтр по студентам";

  inputName.type = 'text';
  inputFaculty.type = 'text';
  inputStartLearn.type = 'number';
  inputEndLearn.type = 'number';

  filter.append(inputName, inputFaculty, inputStartLearn, inputEndLearn);
  containerFilter.append(title);
  containerFilter.appendChild(filter);

  const table = document.getElementsByClassName('table');

  function applyFilters() {
    let filteredStudents = studentsList;
    console.log(filteredStudents);

    // фильтрация по фио
    if (inputName.value) {
      filteredStudents = filteredStudents.filter(student => {
        const fullName = `${student.surname} ${student.name} ${student.lastname}`.toLowerCase();
        return fullName.includes(inputName.value.toLowerCase());
      })
    }

    // фильтрация по факультету

    if (inputFaculty.value) {
      filteredStudents = filteredStudents.filter(student => {
        const faculty = `${student.faculty}`.toLowerCase();
        return faculty.includes(inputFaculty.value.toLowerCase());
      });
    }

    // фильтрация по дате начала обучения

    if (inputStartLearn.value) {
      filteredStudents = filteredStudents.filter(student => {
        const dateLearn = student.studyStart;
        if(parseInt(dateLearn, 10) === parseInt(inputStartLearn.value)) {
          return dateLearn
        }
      });
    }


    // фильтрация по дате конца обучения

    if (inputEndLearn.value) {
      const endYear = parseInt(inputEndLearn.value);
      filteredStudents = filteredStudents.filter(student => {
        const dateEndLearn = student.studyStart;
        if(parseInt(dateEndLearn, 10) + 4 === endYear)
        return dateEndLearn;
      });
    }

    table.innerHTML = ' ';
    renderStudentsTable(filteredStudents);
  }

  inputName.addEventListener('input', applyFilters);
  inputFaculty.addEventListener('input', applyFilters);
  inputStartLearn.addEventListener('input', applyFilters);
  inputEndLearn.addEventListener('input', applyFilters);
}

function createAddStudentsForm() {

  let formContainer = document.getElementById('form');

  let h1 = document.createElement('h1');

  let form = document.createElement('form');
  let inputName = document.createElement('input');
  let inputSurname = document.createElement('input');
  let inputlastname = document.createElement('input');
  let inputBirthday = document.createElement('input');
  let inputStartLearn = document.createElement('input');
  let inputFaculty = document.createElement('input');
  let button = document.createElement('button');


  inputName.type = 'text';
  inputlastname.type = 'text';
  inputSurname.type = 'text';
  inputFaculty.type = 'text';
  inputStartLearn.type = 'number';
  inputBirthday.type = 'date';

  let inputs = [inputName, inputSurname, inputlastname, inputBirthday, inputFaculty, inputStartLearn];

  inputs.forEach(input => {
    input.classList.add('input');
    const inputBlock = document.createElement('div');
    const label = document.createElement('label');
    const spanError = document.createElement('span');
    inputBlock.classList.add('validate-block');
    label.classList.add('label')
    spanError.classList.add('span-validate', 'hidden-on');
    spanError.textContent = 'Заполните это поле';
    label.append(spanError, input)
    inputBlock.append(label);
    form.append(inputBlock);
  });


  h1.classList.add('title');
  form.classList.add('form');
  button.classList.add('btn-form');

  inputName.placeholder = ('Введите имя');
  inputSurname.placeholder = ('Введите фамилию');
  inputlastname.placeholder = ('Введите отчество');
  inputBirthday.placeholder = ('Введите дату рождения');
  inputStartLearn.placeholder = ('Введите год начала обучения');
  inputFaculty.placeholder = ('Введите название факультета');
  button.textContent = 'Добавить студента';
  h1.textContent = 'Форма для добавления студентов';

  form.append(h1, button);

  formContainer.append(form);

  form.addEventListener('submit', async e => {
    e.preventDefault();

    let formValid = true;

    inputs.forEach(input => {
      const errorMessage = input.previousElementSibling;
      if (!input.value) {
        errorMessage.classList.remove('hidden-on');
        formValid = false;
      } else {
        errorMessage.classList.add('hidden-on');
      }
    })

    if (!formValid) {
      return;
    }

    const newStudent = {
      name: inputName.value.trim().toString(),
      surname: inputSurname.value.trim().toString(),
      lastname: inputlastname.value.trim().toString(),
      birthday: new Date(inputBirthday.value).toISOString().toString(),
      studyStart: inputStartLearn.value.toString(),
      faculty: inputFaculty.value.trim().toString()
    }

    // проверка даты рождения

    let birthdayValue = new Date(inputBirthday.value);

    const minDate = new Date(1900, 0, 1);
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    if (birthdayValue < minDate || birthdayValue > currentDate) {
      alert('Дата рождения вне допустимого диапазона. Введите дату между 01.01.1900 и текущей датой.');
      return;
    }

    // проверка года начала обучения

    let studyStart = parseInt(inputStartLearn.value, 10);

    let currentYear = new Date(2000, 8, 1);
    let maxValidationYear = new Date();
    let minDateLearn = currentYear.getFullYear();
    let maxDateLearn = maxValidationYear.getFullYear();

    if (studyStart < minDateLearn || studyStart > maxDateLearn) {
      alert('Дата начала обучения вне допустимого диапазона. Введите дату начала обучения с 2000 года по текущий год');
      return;
    }

    const response = await fetch('http://localhost:3000/api/students', {
      method: 'POST',
      body: JSON.stringify(newStudent),
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const createNewStudent = await response.json();

    studentsList.push(createNewStudent)
    console.log('Updated students list:', studentsList);
    let studentRow = getStudentItem(createNewStudent);
    const addNewStudent = document.getElementById('t-body');
    addNewStudent.appendChild(studentRow);


    inputName.value = '';
    inputSurname.value = '';
    inputlastname.value = '';
    inputBirthday.value = '';
    inputStartLearn.value = '';
    inputFaculty.value = '';

  })

}

function sortStudents(arrayStudents) {

  const nameColumn = document.getElementById('name');

  if (nameColumn) {
    nameColumn.addEventListener('click', () => {
      arrayStudents.sort((a, b) => {
        const fullNameA = `${a.surname} ${a.name} ${a.lastname}`;
        const fullNameB = `${b.surname} ${b.name} ${b.lastname}`;

        if (fullNameA < fullNameB) {
          return -1;
        }

        if (fullNameA > fullNameB) {
          return 1;
        }

        return 0;
      });
      renderStudentsTable(arrayStudents);
    })
  }

  const birthdayColumn = document.getElementById('birthday');

  if (birthdayColumn) {
    birthdayColumn.addEventListener('click', () => {
      arrayStudents.sort((a, b) => {

        // const dateParseA = a.birthday.split('.');
        // const dateParseB = b.birthday.split('.');
        // const dateA = new Date(dateParseA[2], dateParseA[1] - 1, dateParseA[0]);
        // const dateB = new Date(dateParseB[2], dateParseB[1] - 1, dateParseB[0]);

        const dateA = new Date(a.birthday);
        const dateB = new Date(b.birthday);

        if (dateA < dateB) {
          return -1;
        }

        if (dateA > dateB) {
          return 1;
        }

        return 0;
      });
      renderStudentsTable(arrayStudents);
    });
  };

  const facultyColumn = document.getElementById('faculty');

  if (facultyColumn) {
    facultyColumn.addEventListener('click', () => {
      arrayStudents.sort((a, b) => {
        return a.faculty.localeCompare(b.faculty);
      });
      renderStudentsTable(arrayStudents);
    });
  };

  const yearLearnStart = document.getElementById('year-learn')
  if (yearLearnStart) {
    yearLearnStart.addEventListener('click', () => {
      arrayStudents.sort((a, b) => {
        const learnA = a.studyStart;
        const learnB = b.studyStart;

        if (learnA < learnB) {
          return -1;
        }

        if (learnA > learnB) {
          return 1;
        }

        return 0;
      });
      renderStudentsTable(arrayStudents);
    });
  };
};

async function deleteStudent(idStudents, rowStudents) {
  const response = await fetch(`http://localhost:3000/api/students/${idStudents}`, {
    method: 'DELETE'
  });

  if(response.ok) {
    rowStudents.remove();
  }
}


(() => {
  document.addEventListener('DOMContentLoaded', async (event) => {
    await loadStudent();
    renderStudentsTable(studentsList);
    createAddStudentsForm();
    sortStudents(studentsList);
    createfilterStudents();
  });
})();
