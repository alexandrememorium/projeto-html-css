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
const inputValor = document.querySelector("#inpt-valor");
inputValor.addEventListener("paste", function(x){
    x.preventDefault()
});
 



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
        
        //let valor = parseFloat(extrato[dados].valor.replace(/[^0-9]/g, ''));
        //novo para tratar valor
        let valor = (extrato[dados].valor.replace('R$', ''));
        valor = (valor.replace(/[.]/g, ''));
        valor = (valor.replace(',', '.'));
        valor = parseFloat(valor);
        //até aqui

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
                <td class="td_3"><p><strong>${(total < 0 ? formatarMoedaTotal.format(total*-1) : formatarMoedaTotal.format(total))}</strong></p></td>
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
        }
        desenhaTabela();
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

//jQuery(function() {
//    jQuery("#inpt-valor").maskMoney({
//        prefix:'R$',
//        thousands:'.', 
//        decimal:','
//    })
//});

function mascaraValor(e) {
    e.preventDefault();
    valor = e.target.value;
    if (valor == ''){
        valor = 'R$ 0,00';
    };
    if (e.key.match(/[0-9]/) != null){
        valor = valor.replace(/\./g , "");
        if (valor[3] == '0'){
            valor = valor.slice(0, 3) + valor.slice(4);
        };
        valor += e.key;
        valor = valor.replace(",", "");
        valor = addstr (valor, ',', -3);
        let valorInteiro = valor.slice(3, valor.length-3);
        let novovalorInteiro=valorInteiro;
        for (i=valorInteiro.length ; i != 0 ; i--){
            if ((i % 3) == 0 ){
                novovalorInteiro = addstr (novovalorInteiro, '.', -(i+1));   
            }
        }    
        if (novovalorInteiro.slice(0,1) == '.'){
            novovalorInteiro = novovalorInteiro.slice(1);
        };
        valor = valor.slice(0,3) + novovalorInteiro + valor.slice(-3);
        e.target.value = valor;
    } else if( e.key == 'Backspace') {
        valor = valor.replace(/\./g , "");
        valor = valor.slice(0, -1);
        valor = valor.replace(",", "");
        if (valor.length < 6){
            valor = addstr(valor, '0', -3);
        };
        valor = addstr(valor, ',', -3);
        let valorInteiro = valor.slice(3, valor.length-3);
        let novovalorInteiro=valorInteiro;
        for (i=valorInteiro.length ; i != 0 ; i--){
            if ((i % 3) == 0 ){
                novovalorInteiro = addstr (novovalorInteiro, '.', -(i+1));   
            }
        }    
        if (novovalorInteiro.slice(0,1) == '.'){
            novovalorInteiro = novovalorInteiro.slice(1);
        };
        valor = valor.slice(0,3) + novovalorInteiro + valor.slice(-3);
        e.target.value = valor;
    }
};

function addstr (strA, strB, posicao) {
    let result;
    if (posicao < 0){
        result = [strA.slice(0, strA.length+1+posicao), strB, strA.slice(strA.length+1+posicao, strA.length)].join('');
    } else {
        result = [strA.slice(0, posicao), strB, strA.slice(posicao)].join('');
    };
    return result;
};
