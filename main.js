const depositButton = document.getElementById('deposit')
const withdrawButton = document.getElementById('withdraw')
const applyLoanButton = document.getElementById('apply')
const payLoanButton = document.getElementById('pay')
const names = Array.from(document.getElementsByClassName('name'))
const savingsBalance = document.getElementById('savingsBalance')
const loanBalance = document.getElementById('loanBalance')
const savingsData = document.getElementById('savingsData')
const loanData = document.getElementById('loanData')
const progressBar = document.querySelector('.progress-bar')
const searchForm = document.getElementById('searchForm')
const display = document.getElementById('display')
const searchInput = document.getElementById('search')
const contributions = document.getElementById('contributions')
const registrationForm = document.getElementById('registrationForm')


searchForm.addEventListener('submit',(e)=>{
    e.preventDefault()
    fetch(`http://localhost:3000/users/${searchInput.value}`)
        .then(res => res.json())
        .then(user => {
            names.forEach((name)=> name.textContent = user.name)
            const formattedSavingsBalance = new Intl.NumberFormat('en-KE', { 
                style: 'currency', 
                currency: 'KES',
                minimumFractionDigits: 2, // Ensure two decimal places
                maximumFractionDigits: 2  // Ensure two decimal places
            }).format(user.savingsbalance);
            const formattedLoanBalance = new Intl.NumberFormat('en-KE', { 
                style: 'currency', 
                currency: 'KES',
                minimumFractionDigits: 2, // Ensure two decimal places
                maximumFractionDigits: 2  // Ensure two decimal places
            }).format(user.loanbalance);
            loanBalance.textContent = formattedLoanBalance;
            savingsBalance.textContent = formattedSavingsBalance;
            let contributionRatio = Number(user.contributions) / Number(user.totalcontributions)
            let percentageContribution = contributionRatio * 100;
            progressBar.style.width = `${percentageContribution}%`;
            contributions.textContent = `Total contributions: ${user.contributions}/${user.totalcontributions}`
            // Store the current user ID in localStorage
            localStorage.setItem('currentUserId', user.id);
        })
        .catch(error => {
            alert(`User not found, try again`);
        });
})

function displayProfile(){
    let lastUserId = localStorage.getItem('currentUserId');
    //if null display the first person
    if(lastUserId == null || lastUserId == undefined){
        lastUserId = "001"
    }
    fetch(`http://localhost:3000/users/${lastUserId}`)
    .then(res => res.json())
    .then(user => {
        names.forEach((name)=> name.textContent = user.name)
        const formattedSavingsBalance = new Intl.NumberFormat('en-KE', { 
            style: 'currency', 
            currency: 'KES',
            minimumFractionDigits: 2, // Ensure two decimal places
            maximumFractionDigits: 2  // Ensure two decimal places
        }).format(user.savingsbalance);
        const formattedLoanBalance = new Intl.NumberFormat('en-KE', { 
            style: 'currency', 
            currency: 'KES',
            minimumFractionDigits: 2, // Ensure two decimal places
            maximumFractionDigits: 2  // Ensure two decimal places
        }).format(user.loanbalance);
        loanBalance.textContent = formattedLoanBalance;
        savingsBalance.textContent = formattedSavingsBalance;
        let contributionRatio = Number(user.contributions) / Number(user.totalcontributions)
        let percentageContribution = contributionRatio * 100;
        progressBar.style.width = `${percentageContribution}%`;
        contributions.textContent = `Total contributions: ${user.contributions}/${user.totalcontributions}`
    })
    .catch(error => {
        alert(`User not found, try again`);
    });
}

function withdrawMoney(){
    let lastUserId = localStorage.getItem('currentUserId');
    fetch(`http://localhost:3000/users/${lastUserId}`)
    .then(res => res.json())
    .then(user => {
        let currentBalance = user.savingsbalance
        const inputData = {
            savingsbalance : currentBalance- Number(savingsData.value) 
        }
        fetch(`http://localhost:3000/users/${lastUserId}`,{
            method:'PATCH',
            headers:{
                'Content-Type':'application/json'
            },
            body : JSON.stringify(inputData)
        })
        .then(res =>{
            if(!res.ok){
                throw new Error('Response was not ok')
            }else{
                return res.json()
            }
        })
        .then( data =>{
            console.log(`Success ${data}`)
            alert(`Successful withdrawal`)
        })
        .catch( error =>{
            console.log(`error:${error}`)
        })
    });
}
function applyLoan(){
    let lastUserId = localStorage.getItem('currentUserId');
    fetch(`http://localhost:3000/users/${lastUserId}`)
    .then(res => res.json())
    .then(user => {
        let currentBalance = user.savingsbalance
        let loanBalance  = user.loanbalance
        const inputData = {
            loanbalance : loanBalance - Number(loanData.value),
            savingsbalance: currentBalance + Number(loanData.value) 
        }
        fetch(`http://localhost:3000/users/${lastUserId}`,{
            method:'PATCH',
            headers:{
                'Content-Type':'application/json'
            },
            body : JSON.stringify(inputData)
        })
        .then(res =>{
            if(!res.ok){
                throw new Error('Response was not ok')
            }else{
                return res.json()
            }
        })
        .then( data =>{
            alert('Success')
            console.log(`Success ${data}`)
        })
        .catch( error =>{
            console.log(`error:${error}`)
        })
    })
}
function payLoan(){
    let lastUserId = localStorage.getItem('currentUserId');
    fetch(`http://localhost:3000/users/${lastUserId}`)
    .then(res => res.json())
    .then(user => {
        let currentBalance = user.savingsbalance
        let loanBalance  = user.loanbalance
        const inputData = {
            loanbalance : loanBalance + Number(loanData.value) ,
            savingsbalance: currentBalance - Number(loanData.value)
        }
        fetch(`http://localhost:3000/users/${lastUserId}`,{
            method:'PATCH',
            headers:{
                'Content-Type':'application/json'
            },
            body : JSON.stringify(inputData)
        })
        .then(res =>{
            if(!res.ok){
                throw new Error('Response was not ok')
            }else{
                return res.json()
            }
        })
        .then( data =>{
            alert('Success')
        })
        .catch( error =>{
            console.log(`error:${error}`)
        })
    })
}

withdrawButton.addEventListener('click',withdrawMoney)


depositButton.addEventListener('click',(event) => {
    event.preventDefault()
    let currentBalance
    let lastUserId = localStorage.getItem('currentUserId');
    fetch(`http://localhost:3000/users/${lastUserId}`)
    .then(res => res.json())
    .then(user => {
            currentBalance = Number(user.savingsbalance);
            console.log(currentBalance)
    const inputData = {
        savingsbalance :  currentBalance + Number(savingsData.value)
    }
    fetch(`http://localhost:3000/users/${lastUserId}`,{
        method:'PATCH',
        headers:{
            'Content-Type':'application/json'
        },
        body : JSON.stringify(inputData)
    })
    .then(res =>{
        if(!res.ok){
            throw new Error('Response was not ok')
        }else{
            return res.json()
        }
    })
    .then( data =>{
        alert("successful deposit")
        console.log(`Success ${data}`)
    })
    .catch( error =>{
        console.log(`error:${error}`)
    })
    })
})
applyLoanButton.addEventListener('click',applyLoan)
payLoanButton.addEventListener('click',payLoan)

const newUserName = document.getElementById('newUserName');
const initialSavings = document.getElementById('initialSavings');
const accountNumber = document.getElementById('accountNumber')

registrationForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const newUserData = {
        id: accountNumber.value,
        name: newUserName.value,
        savingsbalance: Number(initialSavings.value),
        loanbalance: 0, // Initialize loan balance to 0
        contributions: 0, // Initialize contributions
        totalcontributions: 10000 // Example total contributions limit
    };

    fetch('http://localhost:3000/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newUserData)
    })
    .then(res => {
        if (!res.ok) {
            throw new Error('Response was not ok');
        }
        return res.json();
    })
    .then(data => {
        console.log(`User registered successfully: ${data}`);
        alert('User registered successfully!');
        // Optionally, clear the input fields
        newUserName.value = '';
        initialSavings.value = '';
    })
    .catch(error => {
        console.error(`Error: ${error}`);
    });
});

const contributionData = document.getElementById('contributionData')
const contributionForm = document.getElementById('contributionForm')

contributionForm.addEventListener('submit',(e) => {
    
    let lastUserId = localStorage.getItem('currentUserId');
    console.log('clicked')
    e.preventDefault()
    fetch(`http://localhost:3000/users/${lastUserId}`)
    .then(res => res.json())
    .then(user => {
        let currentBalance = user.savingsbalance
        let currentContribution  = user.contributions
        const inputData = {
            contributions : currentContribution + Number(contributionData.value) ,
            savingsbalance: currentBalance - Number(contributionData.value)
        }
        fetch(`http://localhost:3000/users/${lastUserId}`,{
            method:'PATCH',
            headers:{
                'Content-Type':'application/json'
            },
            body : JSON.stringify(inputData)
        })
        .then(res =>{
            if(!res.ok){
                throw new Error('Response was not ok')
            }else{
                return res.json()
            }
        })
        .then( data =>{
            alert('Success')
        })
        .catch( error =>{
            console.log(`error:${error}`)
        })
    })
})

document.addEventListener('DOMContentLoaded',displayProfile())