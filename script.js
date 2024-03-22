let userName = ""
let balance = 0

const extract = []

const loginUserForm = document.getElementById("form")
loginUserForm.addEventListener("submit", e => {
  e.preventDefault();

  userName = document.getElementById("userName").value

  if (userName === "") {
    alert("Usuário, digite seu nome!")
  }
  else {
    init()
  }

})

function init(){
  document.getElementById("appContent").innerHTML = `
  <h2>Olá, ${userName}! O que você irá fazer?</h2>
  <section class="actions">
    <button onclick="action(1)">Saldo</button>
    <button onclick="action(2)">Extrato</button>
    <button onclick="action(3)">Saque</button>
    <button onclick="action(4)">Depósito</button>
    <button onclick="action(5)">Transferência</button>
    <button onclick="action(6)">Sair</button>
  </section>
  `
}

function formatCurrency(value){
  return value.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })
}

function formatDate(date){
  const splitedDate = date.toLocaleString("pt-br").split(' ')
  return {
    date: splitedDate[0].replace(',', ''),
    hour: splitedDate[1]
  }
}

async function showBalance() {
  return {
    valueInCents: formatCurrency(balance / 100),
    valueWithoutFormat: balance
  }
}

async function checkPassword(password) {
  const truePassword = "3589"
  if (password !== truePassword) {
    return false
  }
  else {
    return true
  }
}

function action(option){
  switch (option) {
    case 1:
      // Saldo
      actionShowBalance()
      break;
    case 2:
      // Extrato
      showExtract()
      break;
    case 3:
      // Saque
      actionCashout()
      break;
    case 4:
      // Depósito
      actionDeposit()
      break;
    case 5:
      // Transferência
      actionTransfer()
      break;
  
    case 6:
      window.location.reload()
      break;
  }
}

function actionShowBalance(){
  document.getElementById("appContent").innerHTML = `
    <form id="checkIsPasswordMatches">
    <label for="password">${userName}, insira a sua senha: </label>
    <input type="password" name="password" id="password">

    <button type="submit">Acessar</button>
    <button type="button" onclick="init()">Cancelar</button>
    </form>
  `

  const form = document.getElementById("checkIsPasswordMatches")
  form.addEventListener("submit", async e => {
    e.preventDefault()

    const password = document.getElementById("password").value
    const isMatchedPassword = await checkPassword(password)

    if (isMatchedPassword === true) {
      document.getElementById("appContent").innerHTML = `
        <h2> ${userName}, seu saldo disponível é de: </h2>
        <p class="balanceValue">${(await showBalance()).valueInCents}</p>

        <button onclick="init()" class="returnButton">Voltar</button>
      `
    }
    else {
      alert('Acesso negado!')
      window.location.reload()
    }
  })
}

function actionDeposit() {
  document.getElementById("appContent").innerHTML = `
    <form id="checkIsPasswordMatches">
    <label for="password">${userName}, insira a sua senha: </label>
    <input type="password" name="password" id="password">

    <button type="submit">Acessar</button>
    <button type="button" onclick="init()">Cancelar</button>
    </form>
  `

  const form = document.getElementById("checkIsPasswordMatches")
  form.addEventListener("submit", async e => {
    e.preventDefault()

    const password = document.getElementById("password").value
    const isMatchedPassword = await checkPassword(password)

    if (isMatchedPassword === true) {
      document.getElementById("appContent").innerHTML = `
        <form id="depositValueForm">
        <label for="depositValue">${userName}, insira o valor do depósito: </label>
        <input type="number" step="0.01" name="depositValue" id="depositValue">

        <button type="submit">Depositar</button>
        <button type="button" onclick="init()">Cancelar</button>
        </form>
      `

      document.getElementById("depositValueForm").addEventListener('submit', e => {
        e.preventDefault()

        const depositValue = parseFloat(document.getElementById("depositValue").value)
        if (depositValue === "" || depositValue <= 0) {
          alert('Operação inválida!')
        }
        else{
            console.log(balance + (depositValue * 100))
            const newBalance = balance + (depositValue * 100)
            const movement = {
              type: 'Entrada',
              data: new Date().toISOString().toLocaleString('pt-BR', { timezone: 'UTC' }),
              value: depositValue * 100,
              oldBalance: balance,
              newBalance: newBalance,
            }
            extract.push(movement)
            balance = newBalance
            console.log(formatCurrency(depositValue))
            alert(`Recebemos o seu depósito no valor de ${formatCurrency(depositValue)}`)
            init()
        }
      })
    }
    else {
      alert('Acesso negado!')
      window.location.reload()
    }
  })
}

function actionCashout(){
  document.getElementById("appContent").innerHTML = `
    <form id="checkIsPasswordMatches">
    <label for="password">${userName}, insira a sua senha: </label>
    <input type="password" name="password" id="password">

    <button type="submit">Confirmar</button>
    </form>
  `

  const form = document.getElementById("checkIsPasswordMatches")
  form.addEventListener("submit", async e => {
    e.preventDefault()

    const password = document.getElementById("password").value
    const isMatchedPassword = await checkPassword(password)

    if (isMatchedPassword === true) {
      document.getElementById("appContent").innerHTML = `
        <form id="cashoutValueForm">
        <label for="cashoutValue">${userName}, insira o valor para o saque: </label>
        <input type="number" step="0.01" name="cashoutValue" id="cashoutValue">

        <button type="submit" id="cashoutButton">Sacar</button>
        <button type="button" onclick="init()" id="cancelButton">Cancelar</button>
        </form>
      `

      document.getElementById("cashoutValueForm").addEventListener('submit', e => {
        e.preventDefault()

        let cashoutValue = parseFloat(document.getElementById("cashoutValue").value) * 100
        document.getElementById("cashoutButton").innerHTML = "Carregando..."
        if (cashoutValue === "" || cashoutValue <= 0 || cashoutValue > balance) {
          alert('Operação não autorizada!')
        }
        else{
            const newBalance = balance - cashoutValue
            const movement = {
              type: 'saída',
              data: new Date().toISOString().toLocaleString('pt-BR', { timezone: 'UTC' }),
              value: cashoutValue,
              oldBalance: balance,
              newBalance
            }
            extract.push(movement)
            balance = newBalance
            alert("Saque realizado com sucesso!")
            init()
        }
        document.getElementById("cashoutButton").innerHTML = "Sacar"
      })
    }
    else {
      alert('Acesso negado!')
      window.location.reload()
    }
  })
}

function actionTransfer() {
  
  document.getElementById("appContent").innerHTML = `
    <form id="checkIsPasswordMatches">
    <label for="password">${userName}, insira a sua senha: </label>
    <input type="password" name="password" id="password">

    <button type="submit">Confirmar</button>
    </form>
  `

  const form = document.getElementById("checkIsPasswordMatches")
  form.addEventListener("submit", async e => {
    e.preventDefault()

    const password = document.getElementById("password").value
    const isMatchedPassword = await checkPassword(password)

    if (isMatchedPassword === true) {
      document.getElementById("appContent").innerHTML = `
        <form id="transferValueForm">
          <label for="transferTo">Para quem você deseja transferir? </label>
          <input type="text" name="transferTo" id="transferTo">
          
          <label for="cashoutValue">Qual o valor da transferência? </label>
          <input type="number" step="0.01" name="cashoutValue" id="cashoutValue">

          <button type="submit" id="transferToButton">Transferir</button>
          <button type="button" onclick="init()" id="cancelButton">Cancelar</button>
        </form>
      `

      document.getElementById("transferValueForm").addEventListener('submit', e => {
        e.preventDefault()

        const transferToName = document.getElementById("transferTo").value
        const transferToValue = parseFloat(document.getElementById("cashoutValue").value) * 100
        document.getElementById("transferToButton").innerHTML = "Carregando..."
        if (transferToValue === "" || transferToValue <= 0 || transferToValue > balance || transferToName === "") {
          alert('Operação não autorizada!')
        }
        else{
            const newBalance = balance - transferToValue
            const movement = {
              type: 'saída',
              data: new Date().toISOString().toLocaleString('pt-BR', { timezone: 'UTC' }),
              value: transferToValue,
              oldBalance: balance,
              newBalance,
              transferTo: transferToName
            }
            extract.push(movement)
            balance = newBalance
            alert("Tranferência realizada com sucesso!")
            init()
        }
        document.getElementById("transferToButton").innerHTML = "Tranferir"
      })
    }
    else {
      alert('Acesso negado!')
      window.location.reload()
    }
  })

}

function showExtract() {
  
  document.getElementById("appContent").innerHTML = `
    <form id="checkIsPasswordMatches">
    <label for="password">${userName}, insira a sua senha: </label>
    <input type="password" name="password" id="password">

    <button type="submit">Confirmar</button>
    </form>
  `

  const form = document.getElementById("checkIsPasswordMatches")
  form.addEventListener("submit", async e => {
    e.preventDefault()

    const password = document.getElementById("password").value
    const isMatchedPassword = await checkPassword(password)

    if (isMatchedPassword === true) {
      if (extract.length > 0) {
        document.getElementById("appContent").innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>Tipo</th>
                    <th>Data</th>
                    <th>Valor</th>
                    <th>Saldo anterior</th>
                    <th>Novo saldo</th>
                </tr>
            </thead>
            <tbody id="tableBody"></tbody>
        </table>
        `
        extract.map(item => {
          document.getElementById("tableBody").innerHTML += `
          <tr>
            <th>${item.type}</th>
            <th>${formatDate(new Date(item.data)).date}</th>
            <th>${formatCurrency(item.value / 100)}</th>
            <th>${formatCurrency(item.oldBalance / 100)}</th>
            <th>${formatCurrency(item.newBalance / 100)}</th>
          </tr>
          `
        })
      }
      else {
        document.getElementById("appContent").innerHTML = '<h2>Você ainda não fez nenhuma movimentação na conta</h2>'
      }

      document.getElementById("appContent").innerHTML += `<button type="button" onclick="init()" id="cancelButton">Voltar</button>`
    }
    else {
      alert('Acesso negado!')
      window.location.reload()
    }
  })

}
