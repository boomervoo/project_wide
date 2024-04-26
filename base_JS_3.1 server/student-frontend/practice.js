parseEmpoyeesData(`
Тиунов Тимофей  Сергеевич,  системный архитектор
Иванов Иван Иванович , frontend-разработчик
`);

function parseEmpoyeesData (dataString) {
  return dataString

  .split('/n')

  .filter(line => line.trim().length > 0)

  .map(line => {
    const [fullName, occupation] = line
    .split(',')
    .map(str => str.trim())
    .filter(text => text.length > 0);

    const [surname, name, middleName] = fullName
    .split(' ')
    .filter(text => text.length > 0);
    return {
      surname, name, middleName, occupation
    }
  });
}


function getPageLinkDomains () {
  return Array.from(document.getElementsByTagName('a'))

  .map (link => link.href
      .replace('http://', '')
      .replace('https://', '')
      .replace('www.', '')
      .split('/')
      .shift()
    )

  .reduce((uniqueDomains, domain) => {
    if (uniqueDomains.includes(domain)) return uniqueDomains;
    return [...uniqueDomains, domain]
  }, [])
}
