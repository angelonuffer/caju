class Componente {
  constructor(tipo) {
    this.e = document.createElement(tipo)
    this.filhos = []
    this.e.style.borderStyle = "solid"
    this.e.style.borderWidth = "0px"
  }
  set largura(valor) { this.e.style.width = valor }
  set altura(valor) { this.e.style.height = valor }
  set crescimento(valor) { this.e.style.flexGrow = valor }
  set cor(valor) { this.e.style.color = valor }
  set espessura_da_borda(valor) { this.e.style.borderWidth = valor + "px" }
  set espessura_da_borda_superior(valor) { this.e.style.borderTopWidth = valor + "px" }
  set espessura_da_borda_inferior(valor) { this.e.style.borderBottomWidth = valor + "px" }
  set margem(valor) { this.e.style.margin = valor + "px" }
  set margem_interna(valor) { this.e.style.padding = valor + "px" }
  set margem_superior(valor) { this.e.style.marginTop = valor + "px" }
  set margem_inferior(valor) { this.e.style.marginBottom = valor + "px" }
  set lacuna(valor) { this.e.style.gap = valor + "px" }
  set camada(valor) { this.e.style.zIndex = valor }
  set justificar_conteúdo(valor) {
    this.e.style.justifyContent = {
      "centro": "center",
    }[valor]
  }
  set transbordamento(valor) {
    this.e.style.overflow = {
      "rolar": "scroll",
    }[valor]
  }
  adicione(filho) {
    filho.pai = this
    this.filhos.push(filho)
    this.e.appendChild(filho.e)
  }
  remova(filho) {
    this.filhos.splice(this.filhos.indexOf(filho), 1)
    this.e.removeChild(filho.e)
  }
  esconda() {
    if (this.e.style.display == "none") {
      return
    }
    this._display = this.e.style.display
    this.e.style.display = "none"
  }
  mostre() {
    this.e.style.display = this._display
  }
  ao_clicar(faça) {
    this.e.addEventListener("click", faça)
  }
}

class Coluna extends Componente {
  constructor(margem, margem_interna, lacuna) {
    super("div")
    this.e.style.display = "inline-flex"
    this.e.style.flexDirection = "column"
    this.margem = margem
    this.margem_interna = margem_interna
    this.lacuna = lacuna
  }
}

class Linha extends Componente {
  constructor(margem, margem_interna, lacuna) {
    super("div")
    this.e.style.display = "inline-flex"
    this.margem = margem
    this.margem_interna = margem_interna
    this.lacuna = lacuna
  }
}

class Grade extends Componente {
  constructor(margem, margem_interna, lacuna, colunas) {
    super("div")
    this.e.style.display = "inline-grid"
    this.e.style.gridTemplateColumns = [...Array(colunas).keys()].map(() => "auto").join(" ")
    this.margem = margem
    this.margem_interna = margem_interna
    this.lacuna = lacuna
  }
}

class Livro extends Componente {
  constructor() {
    super("div")
    this.e.style.display = "flex"
  }
  adicione(filho) {
    super.adicione(filho)
    if (this.filhos.length > 1) {
      filho.esconda()
    }
  }
  vá(i) {
    for (var j = 0; j < this.filhos.length; j++) {
      this.filhos[j].esconda()
    }
    this.filhos[i].mostre()
  }
}

class Página extends Componente {
  constructor() {
    super("div")
    this.e.style.display = "flex"
    this.crescimento = 1
  }
}

class Navegação extends Linha {
  constructor(seções) {
    super(0, 0, 0)
    this.largura = "100%"
    for (var i = 0; i < seções.length; i++) {
      var seção
      this.adicione(seção = new Item("#fd4659", 0))
      seção.crescimento = 1
      seção.justificar_conteúdo = "centro"
      var ícone
      seção.adicione(ícone = new Ícone(seções[i]))
      if (i > 0) {
        ícone.cor = "#ffffffbf"
      }
      seção.ao_clicar(function (i, ícone) {
        for (var j = 0; j < this.filhos.length; j++) {
          this.filhos[j].filhos[0].cor = "#ffffffbf"
        }
        ícone.cor = "#ffffff"
        this._ao_trocar(i)
      }.bind(this, i, ícone))
    }
    this._ao_trocar = () => {}
  }
  ao_trocar(chame) {
    this._ao_trocar = chame
  }
}

class VisualizadorHTML extends Componente {
  constructor() {
    super("iframe")
    this.crescimento = 1
  }
}

class Item extends Linha {
  constructor(cor, espessura_da_borda=3, margem=0, margem_interna=16,
      lacuna=16, cor_da_seleção="#ff9800") {
    super(margem, margem_interna, lacuna)
    this.e.style.backgroundColor = cor
    this.e.style.borderStyle = "solid"
    this.espessura_da_borda = espessura_da_borda
    this.e.style.borderColor = "#000000"
    this.e.style.alignItems = "center"
    this.cor_da_seleção = cor_da_seleção
  }
  selecione() {
    this.e.style.borderColor = this.cor_da_seleção
  }
  desselecione() {
    this.e.style.borderColor = "#000000"
  }
}

class Texto extends Componente {
  constructor(texto, tamanho=24, cor="#FFFFFF") {
    super("span")
    this.e.style.fontSize = tamanho + "px"
    this.e.style.color = cor
    this.e.textContent = texto
  }
}

class Ícone extends Componente {
  constructor(nome, tamanho=24, cor="#FFFFFF") {
    super("span")
    this.e.classList.add("mdi")
    this.e.classList.add("mdi-" + nome)
    this.e.style.fontSize = tamanho + "px"
    this.e.style.color = cor
  }
}

class CampoDeTexto extends Componente {
  constructor() {
    super("span")
    this.e.contentEditable = true
    this.e.style.minWidth = "48px"
    this.e.style.color = "#FFFFFF"
    this.e.style.fontSize = "24px"
  }
}

class Bloco extends Coluna {
  constructor(globais, cor) {
    super(0, 0, 2)
    this.e.style.alignItems = "flex-start"
    this.adicione(this.adicionar = new Item(cor))
    this.adicionar.esconda()
    this.adicionar.selecione()
    this.adicionar.adicione(new Ícone("plus-circle-outline"))
    this.adicionar.ao_clicar(() => {
      solicite_escolha(globais.tipos.filter(tipo => tipo[0] == "nada").map(tipo => [cor_do_tipo(tipo), tipo[1], tipo]), tipo => {
        this.adicione(new Lógica(globais, ...tipo))
        this.e.appendChild(this.adicionar.e)
      })
    })
  }
  selecione() {
    this.adicionar.mostre()
  }
  desselecione() {
    this.adicionar.esconda()
  }
  avalie(globais) {
    for (var i = 1; i < this.filhos.length; i++) {
      this.filhos[i].avalie(globais)
    }
  }
}

class Lógica extends Coluna {
  constructor(globais, retorna, tipo, argumentos, blocos) {
    super(0, 0, 2)
    this.nome_tipo = tipo
    this.argumentos = argumentos
    this.cor_do_tipo = cor_do_tipo([retorna, tipo, argumentos, blocos])
    this.e.style.alignItems = "flex-start"
    this.e.tabIndex = 0
    this.adicione(this.menu = new Linha(0, 0, 2))
    if (tipo != "início") {
      this.menu.adicione(this.deletar = new Item(this.cor_do_tipo))
      this.deletar.adicione(new Ícone("delete"))
      this.deletar.selecione()
      this.deletar.ao_clicar(() => {
        this.pai.remova(this)
      })
      this.menu.esconda()
    }
    this.adicione(this.comando = new Linha(0, 0, 2))
    this.comando.adicione(this.tipo = new Item(this.cor_do_tipo))
    if (tipo == "\"\"") {
      this.tipo.adicione(new Texto("\""))
      this.tipo.adicione(this.campo_de_texto = new CampoDeTexto())
      this.tipo.adicione(new Texto("\""))
    } else {
      this.tipo.adicione(new Texto(tipo))
    }
    if (argumentos.length == 1) {
      this.comando.adicione(this.definir_argumento = new Item(cor_do_tipo([argumentos[0][0]])))
      this.definir_argumento.adicione(new Ícone("chevron-left-circle-outline"))
      this.definir_argumento.selecione()
      this.definir_argumento.esconda()
      this.definir_argumento.ao_clicar(function (retorno) {
        solicite_escolha(globais.tipos.filter(tipo => tipo[0] == retorno).map(tipo => [cor_do_tipo(tipo), tipo[1], tipo]), tipo => {
          if (this.argumento !== undefined) {
            this.comando.e.removeChild(this.argumento.e)
          }
          this.comando.adicione(this.argumento = new Lógica(globais, ...tipo))
        })
      }.bind(this, argumentos[0][0]))
    }
    this.blocos = []
    if (blocos.length > 0) {
      this.adicione(this.seção_blocos = new Linha(0, 0, 2))
      this.seção_blocos.adicione(this.indentação = new Item(this.cor_do_tipo, 3, 0, 8))
      this.indentação.margem_superior = -5
      this.indentação.margem_inferior = -5
      this.indentação.espessura_da_borda_superior = 0
      this.indentação.espessura_da_borda_inferior = 0
      this.indentação.camada = 1
      var bloco
      this.seção_blocos.adicione(bloco = new Bloco(globais, this.cor_do_tipo))
      this.blocos.push(bloco)
      this.adicione(this.fim = new Item(this.cor_do_tipo, 3, 0, 8))
      this.fim.largura = 64
    }
    this.e.addEventListener("focus", function () {
      this.selecione()
    }.bind(this))
    this.e.addEventListener("blur", function () {
      this.desselecione()
    }.bind(this))
  }
  selecione() {
    this.menu.mostre()
    this.tipo.selecione()
    if (this.argumentos.length == 1) {
      this.definir_argumento.mostre()
    }
    if (this.blocos.length > 0) {
      this.indentação.selecione()
      this.blocos.forEach(bloco => bloco.selecione())
      this.fim.selecione()
    }
  }
  desselecione() {
    this.menu.esconda()
    this.tipo.desselecione()
    if (this.argumentos.length == 1) {
      this.definir_argumento.esconda()
    }
    if (this.blocos.length > 0) {
      this.indentação.desselecione()
      this.blocos.forEach(bloco => bloco.desselecione())
      this.fim.desselecione()
    }
  }
  avalie(globais) {
    if (this.nome_tipo == "\"\"") {
      return this.campo_de_texto.e.textContent
    }
    if (globais.hasOwnProperty(this.nome_tipo)) {
      if (this.argumento !== undefined) {
        globais[this.nome_tipo](this.argumento.avalie(globais))
      }
    }
    this.blocos.forEach(bloco => bloco.avalie(globais))
    return globais["caju.saída"]
  }
}

var cor_do_tipo = (tipo) => {
  if (tipo.length > 1) {
    if (tipo[3].length > 0) {
      return "#d7ab32"
    }
    for (var i = 0; i < tipo[2].length; i++) {
      if (tipo[2][i][0] == "nome") {
        return "#ed6d25"
      }
    }
  }
  return {
    "nada": "#97669a",
    "lógico": "#77b940",
    "número": "#3687c7",
    "texto": "#d53571",
    "lista": "#07b7e0",
    "objeto": "#330b9f",
    "cor": "#909090",
    "nome": "#d53571",
    "valor": "#ed6d25",
  }[tipo[0]]
}

var fundo = new Componente("div")
fundo.esconda()
fundo.ao_clicar(() => {
  diálogo.feche()
})
fundo.e.style.backgroundColor = "#00000088"
fundo.e.style.position = "fixed"
fundo.e.style.top = 0
fundo.e.style.bottom = 0
fundo.e.style.left = 0
fundo.e.style.right = 0
fundo.e.style.zIndex = 2
document.body.appendChild(fundo.e)

var diálogo = new Componente("div")
diálogo.esconda()
diálogo.feche = () => {
  diálogo.filhos.splice(0, diálogo.filhos.length)
  diálogo.e.textContent = ""
  diálogo.esconda()
  fundo.esconda()
}
diálogo.abra = () => {
  fundo.mostre()
  diálogo.mostre()
}
diálogo.e.style.backgroundColor = "#FFFFFF"
diálogo.e.style.position = "fixed"
diálogo.e.style.zIndex = 3
diálogo.e.style.left = "50%"
diálogo.e.style.top = "50%"
diálogo.e.style.transform = "translate(-50%, -50%)"
diálogo.e.style.maxHeight = "60%"
diálogo.e.style.overflowY = "scroll"
document.body.appendChild(diálogo.e)

var solicite_escolha = (opções, chame) => {
  var coluna_opções
  diálogo.adicione(coluna_opções = new Coluna(16, 0, 8))
  for (var i = 0; i < opções.length; i++) {
    var opção
    coluna_opções.adicione(opção = new Item(opções[i][0]))
    opção.adicione(new Texto(opções[i][1]))
    opção.ao_clicar(function (retorno) {
      chame(retorno)
      diálogo.feche()
    }.bind(null, opções[i][2]))
  }
  diálogo.abra()
}
