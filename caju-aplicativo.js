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
    } [valor]
  }
  set excesso(valor) {
    this.e.style.overflow = {
      "rolar": "scroll",
    } [valor]
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

export class Coluna extends Componente {
  constructor(margem, margem_interna, lacuna) {
    super("div")
    this.e.style.display = "inline-flex"
    this.e.style.flexDirection = "column"
    this.margem = margem
    this.margem_interna = margem_interna
    this.lacuna = lacuna
  }
}

export class Linha extends Componente {
  constructor(margem, margem_interna, lacuna) {
    super("div")
    this.e.style.display = "inline-flex"
    this.margem = margem
    this.margem_interna = margem_interna
    this.lacuna = lacuna
  }
}

export class Grade extends Componente {
  constructor(margem, margem_interna, lacuna, colunas) {
    super("div")
    this.e.style.display = "inline-grid"
    this.e.style.gridTemplateColumns = [...Array(colunas).keys()].map(() => "auto").join(" ")
    this.margem = margem
    this.margem_interna = margem_interna
    this.lacuna = lacuna
  }
}

export class Livro extends Componente {
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

export class Página extends Componente {
  constructor() {
    super("div")
    this.e.style.display = "flex"
    this.e.style.alignItems = "flex-start"
  }
}

export class Navegação extends Linha {
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

export class VisualizadorHTML extends Componente {
  constructor() {
    super("iframe")
    this.crescimento = 1
  }
}

export class Item extends Linha {
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

export class Texto extends Componente {
  constructor(texto, tamanho=24, cor="#FFFFFF") {
    super("span")
    this.e.style.fontSize = tamanho + "px"
    this.e.style.color = cor
    this.e.textContent = texto
  }
}

export class Ícone extends Componente {
  constructor(nome, tamanho=24, cor="#FFFFFF") {
    super("span")
    this.e.classList.add("mdi")
    this.e.classList.add("mdi-" + nome)
    this.e.style.fontSize = tamanho + "px"
    this.e.style.color = cor
  }
}

export class CampoDeTexto extends Componente {
  constructor() {
    super("span")
    this.e.contentEditable = true
    this.e.style.minWidth = "48px"
    this.e.style.color = "#FFFFFF"
    this.e.style.fontSize = "24px"
  }
}

export var fundo = new Componente("div")
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

export var diálogo = new Componente("div")
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

export var solicite_escolha = (opções, chame) => {
  var coluna_opções
  diálogo.adicione(coluna_opções = new Coluna(16, 0, 8))
  for (var i = 0; i < opções.length; i++) {
    var opção
    coluna_opções.adicione(opção = new Item(opções[i][0]))
    opção.adicione(new Texto(opções[i][1]))
    opção.ao_clicar(function(retorno) {
      chame(retorno)
      diálogo.feche()
    }.bind(null, opções[i][2]))
  }
  diálogo.abra()
}