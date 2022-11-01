var extratoRaw = localStorage.getItem('extrato')
if (extratoRaw != null) {
    var extrato = JSON.parse(extratoRaw)
} else {
    var extrato = [];
}

const formatarMoedaTotal = new Intl.NumberFormat("pt-br", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
});

desenhaTabela()

//Impede o usuário de colar algo no campo valor.
//const inputValor = document.querySelector("#inpt-valor");
//inputValor.addEventListener("paste", function(x){
//    x.preventDefault()
//});
 
function desenhaTabela() {

    let total = 0;

    linhasExistentes = [...document.querySelectorAll('tbody tr')];
    linhasExistentes.forEach((element) => {
        element.remove()
    });    
    

    if (extrato.length == 0) {
        document.querySelector('table.list tbody').innerHTML +=
        `<tr class="conteudo-dinamico_NT">  
            <td style="border:none; text-align:center; width:100;" colspan=3>Nenhuma Transação cadastrada</td> 
        </tr>`;
      }
    
    for (dados in extrato) {
        
        let valor = parseFloat(extrato[dados].valor.replace(/[^0-9]/g, ""));
        
        if (extrato[dados].compraVenda) {
            total -= valor;
        } else {
            total += valor;
        }

        document.querySelector('table.list tbody').innerHTML += `
            <tr class="conteudo-dinamico">
                <td class="td_1"><p>${ (extrato[dados].compraVenda ? '-' : '+')}</p></td>
                <td class="td_2"><p>${extrato[dados].nome}</p></td>
                <td class="td_3"><p>${extrato[dados].valor}</p></td>
            </tr>`
    };
    
    if (extrato.length > 0) {
      
        document.querySelector('table.list tbody').innerHTML += `
            <tr class="conteudo-dinamico">
                <td class="td_1"></td>
                <td class="td_2"></td>
                <td class="td_3"></td>
            </tr>
            <tr class="tr_final">
                <td class="td_1"></td>
                <td class="td_2"><p><strong>Total</strong></p></td>
                <td class="td_3"><p><strong>${formatarMoedaTotal.format(total.toString().replace(/([0-9]{2})$/g, ".$1"))}</strong></p></td>
            </tr>`;

        if (total > 0) {
            document.querySelector('table.list tbody').innerHTML += `
            <tr class="lucro"> 
                <td class="td_1"></td>
                <td class="td_2"></td>
                <td class="td_3">[LUCRO]</td> 
            </tr>`
        } else if (total < 0) {
            document.querySelector('table.list tbody').innerHTML += `
               <tr class="lucro">
                  <td class="td_1"></td>
                  <td class="td_2"></td>
                  <td class="td_3">[PREJUÍZO]</td> 
               </tr>`
        }            
    }
}

function limparDados() {
    if (extrato.length > 0 && window.confirm("Deseja remover todas as informações?")) {
        for (element of document.querySelectorAll("tbody tr")) {
          element.remove();
          localStorage.clear();
          extrato = [];
          desenhaTabela();
        }
    } else if (extrato <= 0) {
        alert("Não foi possível limpar os dados pois não há transações no extrato..");
      }
} 

function testaForm(e) {
    e.preventDefault();
    extrato.push({
        compraVenda: (e.target.elements['compra-venda'].value == 'compra'),
        nome: e.target.elements['inpt-nome'].value,
        valor: e.target.elements['inpt-valor'].value
    }) 
    localStorage.setItem('extrato', JSON.stringify(extrato))
    desenhaTabela()
}

function cadastroTransacoes() {
    document.getElementById("compra-venda").focus();
} 

jQuery(function() {
    jQuery("#inpt-valor").maskMoney({
        prefix:'R$',
        thousands:'.', 
        decimal:','
    })
});