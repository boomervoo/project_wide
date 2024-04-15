

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

  let year = studentObj.birthday.split('.');
  let yearDate = new Date(year[2], year[1] - 1, year[0]);

  const minDate = new Date(1900, 0, 1);
  let maxYear = new Date().getFullYear();
  let maxDate = new Date(maxYear, 11, 31);

  if (yearDate <= maxDate && yearDate >= minDate) {
    let ageStudents = getAge(yearDate);
    birthdayStudent.textContent = `${studentObj.birthday} (${ageStudents} лет)`;
    row.appendChild(birthdayStudent);
  } else {
    birthdayStudent.textContent = 'Дата рождения вне допустимого диапазона';
    row.appendChild(birthdayStudent);
  }

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

  let minDateStartLearn = new Date(2000, 8, 1);
  let minYear = minDateStartLearn.getFullYear();

  if (studentObj.yearStartLearn > minYear) {
    let yearDiff = currentYear - startLearn;
    let course = currentMonth >= 8 && currentYear < finishLearn ? yearDiff + 1 : yearDiff;

    let status = (currentYear > finishLearn) || (currentYear === finishLearn && currentMonth >= 8) ? "закончил" : `${course} курс`;

    yearLearn.textContent = `${startLearn} - ${finishLearn} (${status})`;

    row.append(yearLearn);

    return row;

  } else {
    yearLearn.textContent = 'Дата начала обучения вне допустимого диапазона';
    row.append(yearLearn);
    return row;
  }

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

  let inputs = [inputName, inputSurname, inputMiddleName, inputBirthday, inputFaculty, inputStartLearn];

  inputs.forEach(input => {
    input.classList.add('input');
  });

  h1.classList.add('title');
  form.classList.add('form');
  button.classList.add('btn-form');

  inputName.placeholder = ('Введите имя');
  inputSurname.placeholder = ('Введите фамилию');
  inputMiddleName.placeholder = ('Введите отчество');
  inputBirthday.placeholder = ('Введите дату рождения');
  inputStartLearn.placeholder = ('Введите дату начала обучения');
  inputFaculty.placeholder = ('Введите название факультета');
  button.textContent = 'Добавить студента';
  h1.textContent = 'Форма для добавления студентов';

  form.append(h1, inputName, inputSurname, inputMiddleName, inputBirthday, inputStartLearn, inputFaculty, button);

  formContainer.append(form);

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!inputName.value || !inputMiddleName || !inputSurname || !inputBirthday || !inputFaculty) {
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
    let maxYear = new Date().getFullYear();
    let maxDate = new Date(maxYear, 11, 31);

    if (birthdayValue < minDate || birthdayValue > maxDate) {
      alert('Дата рождения вне допустимого диапазона. Введите дату между 01.01.1900 и текущей датой.');
      return;
    }

    // проверка года начала обучения

    let yearStartLearn = parseInt(inputStartLearn.value, 10);

    let currentYear = new Date(2000, 8, 1);
    let minDateLearn = currentYear.getFullYear();

    if (yearStartLearn < minDateLearn) {
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
        const learnB = b.yearLearnStart;

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

// Этап 6. Создайте функцию фильтрации массива студентов и добавьте события для элементов формы.

(() => {
  document.addEventListener('DOMContentLoaded', (event) => {
    renderStudentsTable(studentsList);
    createAddStudentsForm();
    sortStudents(studentsList);
  });
})();
