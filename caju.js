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
  set excesso(valor) {
    this.e.style.overflow = {
      "rolar": "scroll",
    }[valor]
  }
  adicione(filho) {
    filho.pai = this
    this.filhos.push(filho)
    this.e.appendChild(filho.e)
    return filho
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
    this.e.style.alignItems = "flex-start"
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

class Comando extends Linha {
  constructor(globais, nome) {
    super(0, 0, 2)
    this.globais = globais
    this.nome = nome
    this.objeto = obtenha(globais, nome)
    this.cor_do_tipo = cor_do_tipo(this.objeto)
    this.e.tabIndex = 0
    this.menu = this.adicione(new Linha(0, 0, 2))
    this.menu.e.style.position = "relative"
    this.menu.e.style.width = "0px"
    this.menu.e.style.top = "-68px"
    this.menu.e.style.marginRight = "-2px"
    this.deletar = this.menu.adicione(new Item(this.cor_do_tipo))
    this.deletar.adicione(new Ícone("delete"))
    this.deletar.selecione()
    this.deletar.ao_clicar(() => {
      this.pai.remova(this)
    })
    this.menu.esconda()
    this.item_nome = this.adicione(new Item(this.cor_do_tipo))
    if (this.objeto.aparência) {
      this.objeto.aparência(this)
    } else {
      this.item_nome.adicione(new Texto(nome))
    }
    this.argumentos = []
    this.grade_argumentos = this.adicione(new Grade(0, 0, 0, 2))
    this.grade_argumentos.e.style.columnGap = "2px"
    if (this.objeto.argumentos) {
      for (var i = 0; i< this.objeto.argumentos.length; i++) {
        var argumento = {}
        this.argumentos.push(argumento)
        argumento.linha = this.grade_argumentos.adicione(new Linha(0, 0, 2))
        argumento.definir = argumento.linha.adicione(new Item(cor_do_tipo({
          retorna: this.objeto.argumentos[i][0]
        })))
        argumento.definir.adicione(new Ícone("chevron-left-circle-outline"))
        argumento.definir.selecione()
        argumento.definir.esconda()
        argumento.definir.ao_clicar(function (argumento, retorna) {
          var possibilidades
          if (retorna == "tipo") {
            possibilidades = Object.entries(globais).filter(([nome, valor]) => valor.retorna == "texto").map(([nome, valor]) => [cor_do_tipo(valor), nome, nome])
          } else if (retorna == "nome") {
            possibilidades = Object.entries(globais).filter(([nome, valor]) => valor.retorna == "texto").map(([nome, valor]) => [cor_do_tipo(valor), nome, nome])
          } else if (retorna == "valor") {
            possibilidades = Object.entries(globais).filter(([nome, valor]) => valor.retorna != "nada").map(([nome, valor]) => [cor_do_tipo(valor), nome, nome])
          } else {
            possibilidades = Object.entries(globais).filter(([nome, valor]) => valor.retorna == retorna).map(([nome, valor]) => [cor_do_tipo(valor), nome, nome])
          }
          solicite_escolha(possibilidades, nome => {
            argumento.valor = argumento.linha.adicione(new Comando(globais, nome))
          })
        }.bind(this, argumento, this.objeto.argumentos[i][0]))
      }
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
    this.item_nome.selecione()
    this.argumentos.map(argumento => {
      argumento.definir.mostre()
    })
  }
  desselecione() {
    this.menu.esconda()
    this.item_nome.desselecione()
    this.argumentos.map(argumento => {
      argumento.definir.esconda()
    })
  }
  estruture() {
    if (this.objeto.estruture) {
      return this.objeto.estruture(this)
    }
    return [this.nome, ...this.argumentos.map(argumento => argumento.valor.estruture())]
  }
}

class BlocoDeComandos extends Coluna {
  constructor(globais, nome) {
    super(0, 0, 2)
    this.nome = nome
    this.cor_do_tipo = cor_do_tipo(obtenha(globais, nome))
    this.e.style.alignItems = "flex-start"
    this.e.tabIndex = 0
    this.blocos = []
    var bloco
    this.blocos.push(bloco = this.adicione(new Comando(globais, nome)))
    bloco.remova(bloco.menu)
    bloco.e.removeAttribute("tabIndex")
    bloco.linha = this.adicione(new Linha(0, 0, 2))
    bloco.indentação = bloco.linha.adicione(new Item(this.cor_do_tipo, 3, 0, 8))
    bloco.indentação.margem_superior = -5
    bloco.indentação.margem_inferior = -5
    bloco.indentação.espessura_da_borda_superior = 0
    bloco.indentação.espessura_da_borda_inferior = 0
    bloco.indentação.camada = 1
    bloco.coluna = bloco.linha.adicione(new Coluna(0, 0, 2))
    bloco.coluna.e.style.alignItems = "flex-start"
    bloco.adicionar = bloco.coluna.adicione(new Item(this.cor_do_tipo))
    bloco.adicionar.esconda()
    bloco.adicionar.selecione()
    bloco.adicionar.adicione(new Ícone("plus-circle-outline"))
    bloco.comandos = []
    bloco.adicionar.ao_clicar(() => {
      var possibilidades = []
      if (globais[this.nome].locais) {
        possibilidades = [...possibilidades, ...Object.entries(globais[this.nome].locais).filter(([nome, valor]) => (valor.mutável == undefined || valor.mutável == true) && valor.retorna == "nada").map(([nome, valor]) => [cor_do_tipo(valor), this.nome + "." + nome, this.nome + "." + nome])]
      }
      possibilidades = [...possibilidades, ...Object.entries(globais).filter(([nome, valor]) => (valor.mutável == undefined || valor.mutável == true) && valor.retorna == "nada").map(([nome, valor]) => [cor_do_tipo(valor), nome, nome])]
      solicite_escolha(possibilidades, nome => {
        var objeto = obtenha(globais, nome)
        if (objeto.tipo == "comando") {
          bloco.comandos.push(bloco.coluna.adicione(new Comando(globais, nome)))
        }
        if (objeto.tipo == "bloco") {
          bloco.comandos.push(bloco.coluna.adicione(new BlocoDeComandos(globais, nome)))
        }
        bloco.coluna.e.appendChild(bloco.adicionar.e)
      })
    })
    this.fim = this.adicione(new Item(this.cor_do_tipo, 3, 0, 8))
    this.fim.largura = 64
    this.e.addEventListener("focus", function () {
      this.selecione()
    }.bind(this))
    this.e.addEventListener("blur", function () {
      this.desselecione()
    }.bind(this))
  }
  selecione() {
    this.blocos.map(bloco => {
      bloco.selecione()
      bloco.indentação.selecione()
      bloco.adicionar.mostre()
    })
    this.fim.selecione()
  }
  desselecione() {
    this.blocos.map(bloco => {
      bloco.desselecione()
      bloco.indentação.desselecione()
      bloco.adicionar.esconda()
    })
    this.fim.desselecione()
  }
  estruture() {
    return [this.nome, ...this.blocos.map(bloco =>
      bloco.comandos.map(comando => comando.estruture())
    )]
  }
}

var cor_do_tipo = (tipo) => {
  if (tipo.blocos) {
    return "#d7ab32"
  }
  if (tipo.argumentos) {
    for (var i = 0; i < tipo.argumentos.length; i++) {
      if (tipo.argumentos[i][0] == "nome") {
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
    "nome": "#ed6d25",
    "tipo": "#ed6d25",
    "valor": "#ed6d25",
  }[tipo.retorna]
}

var obtenha = (globais, nome) => {
  var nomes = nome.split(".")
  var objeto = globais[nomes[0]]
  for (var i = 1; i < nomes.length; i++) {
    objeto = objeto.locais[nomes[i]]
  }
  return objeto
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
