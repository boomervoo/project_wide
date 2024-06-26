

const studentsList = [
  {
    name: 'Иван',
    surname: 'Волков',
    middleName: 'Алексеевич',
    birthday: '18.12.1998',
    yearStartLearn: 2016,
    faculty: 'Реклама и PR'
  },
  {
    name: 'Алексей',
    surname: 'Занозов',
    middleName: 'Владимирович',
    birthday: '11.01.2004',
    yearStartLearn: 2022,
    faculty: 'Ядерная физика и прикладная математика'
  },
  {
    name: 'Владимир',
    surname: 'Иконников',
    middleName: 'Дмитриевич',
    birthday: '05.05.1997',
    yearStartLearn: 2016,
    faculty: 'Реклама и PR'
  },
  {
    name: 'Светлана',
    surname: 'Чуприна',
    middleName: 'Иувинальевна',
    birthday: '27.05.2001',
    yearStartLearn: 2018,
    faculty: 'Филологический факультет'
  },
  {
    name: 'Дмитрий',
    surname: 'Зайцев',
    middleName: 'Петрович',
    birthday: '01.09.2002',
    yearStartLearn: 2020,
    faculty: 'Реклама и PR'
  },
  {
    name: 'Алексей',
    surname: 'Волков',
    middleName: 'Сергеевич',
    birthday: '11.11.1994',
    yearStartLearn: 2013,
    faculty: 'Реклама и PR'
  },
  {
    name: 'Александра',
    surname: 'Бастрыкина',
    middleName: 'Дмитриевна',
    birthday: '17.05.1985',
    yearStartLearn: 2002,
    faculty: 'Исторический'
  }
]


function getStudentItem(studentObj) {
  let row = document.createElement('tr');
  row.classList.add('row');

  // выводим ФИО

  let fullNameStudent = document.createElement('td');
  fullNameStudent.classList.add('td-col');
  fullNameStudent.textContent = `${studentObj.surname.charAt(0).toUpperCase() + studentObj.surname.slice(1).toLowerCase()}
  ${studentObj.name.charAt(0).toUpperCase() + studentObj.name.slice(1).toLowerCase()} ${studentObj.middleName.charAt(0).toUpperCase() + studentObj.middleName.slice(1).toLowerCase()}`;

  row.appendChild(fullNameStudent);

  // выводим дату рождения и возраст

  let birthdayStudent = document.createElement('td');
  birthdayStudent.classList.add('td-col');

  // Конвертируем дату к единому формату YYYY, MM, DD
  let dateParts = studentObj.birthday.includes('-') ? studentObj.birthday.split('-').map(part => parseInt(part)) : studentObj.birthday.split('.').reverse().map(part => parseInt(part));
  let birthDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);

  // Форматируем дату в DD.MM.YYYY
  let formattedDate = dateParts[2] + '.' + (dateParts[1] < 10 ? '0' + dateParts[1] : dateParts[1]) + '.' + dateParts[0];

  let ageStudents = getAge(birthDate);
  birthdayStudent.textContent = `${formattedDate} (${ageStudents} лет)`;
  row.appendChild(birthdayStudent);


  function getAge(yearDate) {
    let currentDate = new Date();
    let age = currentDate.getFullYear() - yearDate.getFullYear();
    let month = currentDate.getMonth() - yearDate.getMonth();
    if (month < 0 || (month === 0 && currentDate.getDate() < yearDate.getDate())) {
      age--;
    }
    return age;
  }


  // выводим факультет

  let faculty = document.createElement('td');
  faculty.classList.add('td-col');
  faculty.textContent = studentObj.faculty.trim(' ')
  row.appendChild(faculty);

  // выводим дату начала обучение и конец обучения

  let yearLearn = document.createElement('td');
  yearLearn.classList.add('td-col');

  let startLearn = studentObj.yearStartLearn;
  let finishLearn = startLearn + 4;

  let currentDate = new Date();
  let currentYear = currentDate.getFullYear();
  let currentMonth = currentDate.getMonth();

  let yearDiff = currentYear - startLearn;
  let course = currentMonth >= 8 && currentYear < finishLearn ? yearDiff + 1 : yearDiff;

  let status = (currentYear > finishLearn) || (currentYear === finishLearn && currentMonth >= 8) ? "закончил" : `${course} курс`;

  yearLearn.textContent = `${startLearn} - ${finishLearn} (${status})`;

  row.append(yearLearn);
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

    // фильтрация по фио
    if (inputName.value) {
      filteredStudents = filteredStudents.filter(student => {
        const fullName = `${student.surname} ${student.name} ${student.middleName}`.toLowerCase();
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
        const dateLearn = student.yearStartLearn;
        return dateLearn === parseInt(inputStartLearn.value);
      });
    }

    // фильтрация по дате конца обучения

    if (inputEndLearn.value) {
      const endYear = parseInt(inputEndLearn.value);
      filteredStudents = filteredStudents.filter(student => {
        return student.yearStartLearn + 4 === endYear;
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
  let inputMiddleName = document.createElement('input');
  let inputBirthday = document.createElement('input');
  let inputStartLearn = document.createElement('input');
  let inputFaculty = document.createElement('input');
  let button = document.createElement('button');


  inputName.type = 'text';
  inputMiddleName.type = 'text';
  inputSurname.type = 'text';
  inputFaculty.type = 'text';
  inputStartLearn.type = 'number';
  inputBirthday.type = 'date';

  let inputs = [inputName, inputSurname, inputMiddleName, inputBirthday, inputFaculty, inputStartLearn];

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
  inputMiddleName.placeholder = ('Введите отчество');
  inputBirthday.placeholder = ('Введите дату рождения');
  inputStartLearn.placeholder = ('Введите год начала обучения');
  inputFaculty.placeholder = ('Введите название факультета');
  button.textContent = 'Добавить студента';
  h1.textContent = 'Форма для добавления студентов';

  form.append(h1, button);

  formContainer.append(form);

  form.addEventListener('submit', (e) => {
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
      name: inputName.value.trim(),
      surname: inputSurname.value.trim(),
      middleName: inputMiddleName.value.trim(),
      birthday: inputBirthday.value,
      yearStartLearn: parseInt(inputStartLearn.value, 10),
      faculty: inputFaculty.value.trim()
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

    let yearStartLearn = parseInt(inputStartLearn.value, 10);

    let currentYear = new Date(2000, 8, 1);
    let maxValidationYear = new Date();
    let minDateLearn = currentYear.getFullYear();
    let maxDateLearn = maxValidationYear.getFullYear();

    if (yearStartLearn < minDateLearn || yearStartLearn > maxDateLearn) {
      alert('Дата начала обучения вне допустимого диапазона. Введите дату начала обучения с 2000 года по текущий год');
      return;
    }

    studentsList.push(newStudent)
    let studentRow = getStudentItem(newStudent);
    const addNewStudent = document.getElementById('t-body');
    addNewStudent.appendChild(studentRow);

    inputName.value = '';
    inputSurname.value = '';
    inputMiddleName.value = '';
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
        const fullNameA = `${a.surname} ${a.name} ${a.middleName}`;
        const fullNameB = `${b.surname} ${b.name} ${b.middleName}`;

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

        const dateParseA = a.birthday.split('.');
        const dateParseB = b.birthday.split('.');
        const dateA = new Date(dateParseA[2], dateParseA[1] - 1, dateParseA[0]);
        const dateB = new Date(dateParseB[2], dateParseB[1] - 1, dateParseB[0]);

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
        const learnA = a.yearStartLearn;
        const learnB = b.yearStartLearn;

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


(() => {
  document.addEventListener('DOMContentLoaded', (event) => {
    renderStudentsTable(studentsList);
    createAddStudentsForm();
    sortStudents(studentsList);
    createfilterStudents();
  });
})();
