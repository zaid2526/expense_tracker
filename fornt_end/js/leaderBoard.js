window.addEventListener('load', () => {
    // const expenseList = document.getElementById('expnese-list');
    // expenseList.innerHTML = `<h2 > Expense Details </h2>`;
    console.log('loaded');
    axios.get('http://localhost:8000/purchase/leaderboard')
        .then((expenses) => {
            console.log(expenses);
            allExpenses=expenses.data.sort((a,b)=>{
                return a.totalExpenses>b.totalExpenses ? -1 : 1
            })
            console.log(allExpenses)
        //     expenses.data.forEach(expense => {
        //         const expenseHTML = `
        // <ul id="item-${expense.id}">
        //     <li>id : ${expense.id}</li>
        //     <li>expense:  ${expense.expense}</li>
        //     <li>description ${expense.description}</li>
            
        //     <li class="prod-details">
        //        <span> category ${expense.category}</span>
        //     </li>
        // </ul><hr>`
        //         expenseList.innerHTML += expenseHTML
            // })

        })

})