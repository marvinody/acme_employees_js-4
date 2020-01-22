const employees = [
  { id: 1, name: 'moe' },
  { id: 2, name: 'larry', managerId: 1 },
  { id: 4, name: 'shep', managerId: 2 },
  { id: 3, name: 'curly', managerId: 1 },
  { id: 5, name: 'groucho', managerId: 3 },
  { id: 6, name: 'harpo', managerId: 5 },
  { id: 8, name: 'shep Jr.', managerId: 4 },
  { id: 99, name: 'lucy', managerId: 1 }
]

const spacer = (text) => {
  if (!text) {
    return console.log('')
  }
  const stars = new Array(5).fill('*').join('')
  console.log(`${stars} ${text} ${stars}`)
}

// great variable names and use of lambda (fat arrow funcs)
const findEmployeeByName = (name, employeeArr) => employeeArr.find(employee => employee.name === name)


spacer('findEmployeeByName Moe')
// given a name and array of employees, return employee
console.log(findEmployeeByName('moe', employees))//{ id: 1, name: 'moe' }
spacer('')

// consistent variable naming
// be wary of line length, above 80 should be a warning to chop off
// above 100 means definitely!
const findManagerFor = (employee, employeeArr) => employeeArr.find(manager => employee.managerId === manager.id)


spacer('findManagerFor Shep')
//given an employee and a list of employees, return the employee who is the manager
console.log(findManagerFor(findEmployeeByName('shep Jr.', employees), employees))//{ id: 4, name: 'shep', managerId: 2 }
spacer('')

// great variable names even in lambda!
const findCoworkersFor = (employee, employeeArr) => employeeArr.filter(coworker => coworker !== employee && coworker.managerId === employee.managerId)


spacer('findCoworkersFor Larry')

//given an employee and a list of employees, return the employees who report to the same manager
console.log(findCoworkersFor(findEmployeeByName('larry', employees), employees))/*
[ { id: 3, name: 'curly', managerId: 1 },
  { id: 99, name: 'lucy', managerId: 1 } ]
*/

spacer('')

// short and concise recursive function. perfect!
const findManagementChainForEmployee = (employee, employeeArr) => {
  if (!employee.managerId) {
    return []
  }
  const manager = findManagerFor(employee, employeeArr)
  const nextManager = findManagementChainForEmployee(manager, employeeArr)

  return nextManager.concat(manager)
}


spacer('findManagementChain for moe')
//given an employee and a list of employees, return a the management chain for that employee. The management chain starts from the employee with no manager with the passed in employees manager
console.log(findManagementChainForEmployee(findEmployeeByName('moe', employees), employees))//[  ]
spacer('')

spacer('findManagementChain for shep Jr.')
console.log(findManagementChainForEmployee(findEmployeeByName('shep Jr.', employees), employees))/*
[ { id: 1, name: 'moe' },
  { id: 2, name: 'larry', managerId: 1 },
  { id: 4, name: 'shep', managerId: 2 }]
*/
spacer('')


// could be better named helper function
// maybe findWorkers? and the first param can be manager
// good names go a great way in reducing overhead for people reading your code!
const findEmployee = (employee, employeeArr) => {
  return employeeArr.filter(worker => {
    return worker.id !== employee.id && worker.managerId === employee.id
  })
}
// console.log('findEmployee', findEmployee(employees[0], employees))

const generateManagementTree = (employeeArr) => {
  const recursiveFn = (employee) => {
    const reports = findEmployee(employee, employeeArr)

    if (reports.length === 0) {
      return []
    }

    return reports.map(report => {
      return {
        ...report,
        reports: recursiveFn(report)
      }
    })
  }

  // what if the first employee wasn't the top level manager?
  // complicates things a bit. if you have time, would be a nice challenge for you
  return {
    ...employeeArr[0],
    reports: recursiveFn(employeeArr[0])
  }
}


spacer('generateManagementTree')
//given a list of employees, generate a tree like structure for the employees, starting with the employee who has no manager. Each employee will have a reports property which is an array of the employees who report directly to them.
console.log(JSON.stringify(generateManagementTree(employees), null, 2))
/*
{
  "id": 1,
  "name": "moe",
  "reports": [
    {
      "id": 2,
      "name": "larry",
      "managerId": 1,
      "reports": [
        {
          "id": 4,
          "name": "shep",
          "managerId": 2,
          "reports": [
            {
              "id": 8,
              "name": "shep Jr.",
              "managerId": 4,
              "reports": []
            }
          ]
        }
      ]
    },
    {
      "id": 3,
      "name": "curly",
      "managerId": 1,
      "reports": [
        {
          "id": 5,
          "name": "groucho",
          "managerId": 3,
          "reports": [
            {
              "id": 6,
              "name": "harpo",
              "managerId": 5,
              "reports": []
            }
          ]
        }
      ]
    },
    {
      "id": 99,
      "name": "lucy",
      "managerId": 1,
      "reports": []
    }
  ]
}
*/
spacer('')

// eerily similar to my code! good job
// even this though is what is being 'expected', try writing this to return
// a string instead of console logging it. not super priority
//(I think the one above is a better use of time)

const displayManagementTree = (employeeTree, branches = 0) => {
  console.log(`${'-'.repeat(branches)}${employeeTree.name}`)

  if (employeeTree.reports.length === 0) {
    return
  }

  employeeTree.reports.forEach(report => {
    displayManagementTree(report, branches + 1)
  })
}


spacer('displayManagementTree')
//given a tree of employees, generate a display which displays the hierarchy
displayManagementTree(generateManagementTree(employees))/*
moe
-larry
--shep
---shep Jr.
-curly
--groucho
---harpo
-lucy
*/
